#!/usr/bin/env bun
/**
 * manage-state.ts — Deterministic State Graph Engine
 *
 * Zero LLM tokens. Pure CPU logic.
 * Manages workflow state transitions for the multi-agent pipeline.
 *
 * Usage:
 *   bun .agents/scripts/manage-state.ts --action=init --task=feat/my-feature --complexity=MEDIUM
 *   bun .agents/scripts/manage-state.ts --action=transition --task=feat/my-feature --to=node_1_architect
 *   bun .agents/scripts/manage-state.ts --action=set-verdict --task=feat/my-feature --target=review --verdict=PASS
 *   bun .agents/scripts/manage-state.ts --action=status --task=feat/my-feature
 */

import { execSync } from "child_process";
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  acknowledgeHandoffReceipt,
  createHandoffReceipt,
  handoffReceiptFileName,
  requiredHandoffArtifacts,
} from "./lib/handoff-state";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StateJson {
  task_id: string;
  workflow_type: "FEATURE" | "HOTFIX";
  complexity: "SMALL" | "MEDIUM" | "LARGE";
  current_node: string;
  status: "RUNNING" | "PAUSED" | "COMPLETED" | "CIRCUIT_BREAKER_ESCALATED" | "REMEDIATING";
  review_cycles: number;
  qa_cycles: number;
  artifacts: Record<string, string>;
  gate_checkpoints: {
    gate_0_scope: "PENDING" | "APPROVED" | "REJECTED";
    gate_1_architecture: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED";
    gate_6_final_verdict: "PENDING" | "APPROVED" | "REJECTED";
  };
  review_verification?: {
    commit_sha: string | null;
    branch: string | null;
    tree_hash: string | null;
    verified_at: string;
  };
  qa_verification?: {
    commit_sha: string | null;
    branch: string | null;
    tree_hash: string | null;
    verified_at: string;
  };
  created_at: string;
  updated_at: string;
}

interface GitSnapshot {
  commit_sha: string | null;
  branch: string | null;
  tree_hash: string | null;
}

function captureGitSnapshot(): GitSnapshot {
  const runGit = (cmd: string): string | null => {
    try {
      return execSync(cmd, { cwd: PROJECT_ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString("utf8").trim();
    } catch {
      return null;
    }
  };
  const commit_sha = runGit("git rev-parse HEAD");
  const branch = runGit("git rev-parse --abbrev-ref HEAD");
  if (!commit_sha) return { commit_sha: null, branch: null, tree_hash: null };
  // Hash working-tree code changes excluding .agent-work/ so QA reports don't self-invalidate
  const status = runGit("git status --porcelain -- . \":(exclude).agent-work\"") ?? "";
  const diff = runGit("git diff HEAD -- . \":(exclude).agent-work\"") ?? "";
  const tree_hash = createHash("sha256").update(status + "\n---\n" + diff).digest("hex").slice(0, 16);
  return { commit_sha, branch, tree_hash };
}

function checkSnapshotFreshness(
  label: string,
  pinned: { commit_sha: string | null; tree_hash: string | null } | undefined,
  current: GitSnapshot
): { status: "FRESH" | "STALE" | "UNVERIFIED"; reason?: string; current: GitSnapshot } {
  if (!pinned || !pinned.commit_sha) {
    return { status: "UNVERIFIED", reason: `No ${label} commit SHA pinned in STATE.json`, current };
  }
  if (!current.commit_sha) {
    return { status: "UNVERIFIED", reason: "Not inside a Git repository", current };
  }
  if (current.commit_sha !== pinned.commit_sha) {
    return {
      status: "STALE",
      reason: `Branch HEAD moved: ${label} passed on ${pinned.commit_sha.slice(0, 7)}, current HEAD is ${current.commit_sha.slice(0, 7)}`,
      current,
    };
  }
  if (pinned.tree_hash && current.tree_hash && current.tree_hash !== pinned.tree_hash) {
    return {
      status: "STALE",
      reason: `Working tree changed since ${label} passed (${label} tree ${pinned.tree_hash} !== current ${current.tree_hash})`,
      current,
    };
  }
  return { status: "FRESH", current };
}

function checkQaFreshness(state: StateJson) {
  return checkSnapshotFreshness("QA", state.qa_verification, captureGitSnapshot());
}

function checkReviewFreshness(state: StateJson) {
  return checkSnapshotFreshness("Review", state.review_verification, captureGitSnapshot());
}

// ─── Constants ───────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(join(__dirname, "..", ".."));
const AGENT_WORK_DIR = join(PROJECT_ROOT, ".agent-work");

const VALID_NODES = [
  "node_0_context_builder",
  "gate_0_scope_confirmation",
  "node_1_architect",
  "gate_1_architecture_approval",
  "node_2_implementation",
  "node_3_code_reviewer",
  "node_4_qa_validator",
  "gate_6_user_final_verdict",
  "node_5_release_manager",
  "completed",
] as const;

const HOTFIX_NODES = [
  "node_root_cause",
  "node_hotfix_implementer",
  "node_adversarial_diff_check",
  "node_targeted_qa",
  "gate_emergency_user_approval",
  "node_hotfix_release",
  "completed",
] as const;

// SMALL tier skips Architect (Node 1) and Code Review (Node 3)
const SMALL_ALLOWED_TRANSITIONS: Record<string, string[]> = {
  node_0_context_builder: ["gate_0_scope_confirmation"],
  gate_0_scope_confirmation: ["node_2_implementation"],
  node_2_implementation: ["node_4_qa_validator"],
  node_4_qa_validator: ["gate_6_user_final_verdict", "node_2_implementation"],
  gate_6_user_final_verdict: ["node_5_release_manager", "node_2_implementation"],
  node_5_release_manager: ["completed"],
};

// MEDIUM/LARGE tier uses full graph
const FULL_ALLOWED_TRANSITIONS: Record<string, string[]> = {
  node_0_context_builder: ["gate_0_scope_confirmation"],
  gate_0_scope_confirmation: ["node_1_architect", "node_2_implementation"],
  node_1_architect: ["gate_1_architecture_approval"],
  gate_1_architecture_approval: ["node_2_implementation"],
  node_2_implementation: ["node_3_code_reviewer"],
  node_3_code_reviewer: ["node_2_implementation", "node_4_qa_validator"],
  node_4_qa_validator: ["gate_6_user_final_verdict", "node_2_implementation"],
  gate_6_user_final_verdict: ["node_5_release_manager", "node_2_implementation"],
  node_5_release_manager: ["completed"],
};

const HOTFIX_ALLOWED_TRANSITIONS: Record<string, string[]> = {
  node_root_cause: ["node_hotfix_implementer"],
  node_hotfix_implementer: ["node_adversarial_diff_check"],
  node_adversarial_diff_check: ["node_hotfix_implementer", "node_targeted_qa"],
  node_targeted_qa: ["node_hotfix_implementer", "gate_emergency_user_approval"],
  gate_emergency_user_approval: ["node_hotfix_release", "node_hotfix_implementer"],
  node_hotfix_release: ["completed"],
};

const ARTIFACT_FILES: Record<string, string> = {
  TASK_CONTEXT: "TASK_CONTEXT.md",
  ARCHITECTURE_PLAN: "ARCHITECTURE_PLAN.md",
  IMPLEMENTATION_TASKS: "IMPLEMENTATION_TASKS.md",
  IMPLEMENTATION_PLAN: "IMPLEMENTATION_PLAN.md",
  IMPLEMENTATION_REPORT: "IMPLEMENTATION_REPORT.md",
  CODE_REVIEW: "CODE_REVIEW.md",
  QA_REPORT: "QA_REPORT.md",
  RELEASE_REPORT: "RELEASE_REPORT.md",
  ACCEPTANCE_CRITERIA: "ACCEPTANCE_CRITERIA.md",
  QA_CRITERIA: "QA_CRITERIA.md",
  REQUIREMENT: "REQUIREMENT.md",
  HOTFIX_CONTEXT: "HOTFIX_CONTEXT.md",
  HOTFIX_PLAN: "HOTFIX_PLAN.md",
  BROWSER_TEST_INSTRUCTIONS: "BROWSER_TEST_INSTRUCTIONS.md",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTaskDir(taskId: string): string {
  return join(AGENT_WORK_DIR, ...taskId.split("/"));
}

function getStatePath(taskId: string): string {
  return join(getTaskDir(taskId), "STATE.json");
}

function readState(taskId: string): StateJson {
  const statePath = getStatePath(taskId);
  if (!existsSync(statePath)) {
    console.error(`❌ STATE.json not found for task: ${taskId}`);
    console.error(`   Expected at: ${statePath}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(statePath, "utf-8"));
}

function writeState(taskId: string, state: StateJson): void {
  state.updated_at = new Date().toISOString();
  const statePath = getStatePath(taskId);
  writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

function assertHandoffArtifact(taskId: string, from: string, to: string, requireAcknowledged = true): string[] {
  const required = requiredHandoffArtifacts(from, to);
  if (required.length === 0) return [];
  const artifactPaths = required.map((name) => join(getTaskDir(taskId), name));
  const missing = artifactPaths.filter((path) => !existsSync(path));
  if (missing.length > 0) {
    console.error(`❌ Handoff blocked: ${from} → ${to} requires ${required.join(", ")}`);
    for (const path of missing) console.error(`   Missing: ${path}`);
    process.exit(1);
  }
  const receiptPath = join(getTaskDir(taskId), handoffReceiptFileName(from, to));
  if (!existsSync(receiptPath)) {
    const relativePaths = required.map((name) => join(".agent-work", taskId, name));
    writeFileSync(receiptPath, JSON.stringify(createHandoffReceipt(from, to, relativePaths), null, 2), "utf-8");
    console.log(`   Handoff receipt created: ${receiptPath}`);
  }
  const receipt = JSON.parse(readFileSync(receiptPath, "utf-8"));
  if (requireAcknowledged && (!receipt.acknowledgedAt || !receipt.acknowledgedBy || !receipt.acknowledgement)) {
    console.error(`❌ Handoff blocked: ${receiptPath} has no verified receiver acknowledgement.`);
    console.error(`   Acknowledge with --action=ack-handoff --task=${taskId} --from=${from} --to=${to} --by=<agent> --message=<verification>`);
    process.exit(1);
  }
  return artifactPaths;
}

function discoverArtifacts(taskId: string): Record<string, string> {
  const taskDir = getTaskDir(taskId);
  const artifacts: Record<string, string> = {};

  if (!existsSync(taskDir)) return artifacts;

  const files = readdirSync(taskDir);
  for (const file of files) {
    if (file === "STATE.json") continue;
    const key = file.replace(".md", "").replace(/-/g, "_").toUpperCase();
    artifacts[key.toLowerCase()] = join(".agent-work", taskId, file);
  }

  return artifacts;
}

function getTransitionMap(state: StateJson): Record<string, string[]> {
  if (state.workflow_type === "HOTFIX") return HOTFIX_ALLOWED_TRANSITIONS;
  if (state.complexity === "SMALL") return SMALL_ALLOWED_TRANSITIONS;
  return FULL_ALLOWED_TRANSITIONS;
}

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--")) {
      const [key, ...valueParts] = arg.slice(2).split("=");
      args[key] = valueParts.join("=") || "true";
    }
  }
  return args;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function actionInit(args: Record<string, string>): void {
  const taskId = args.task;
  const complexity = (args.complexity || "MEDIUM").toUpperCase() as StateJson["complexity"];
  const workflowType = taskId.startsWith("hotfix/") ? "HOTFIX" : "FEATURE";

  if (!taskId) {
    console.error("❌ --task is required for init");
    process.exit(1);
  }

  if (!["SMALL", "MEDIUM", "LARGE"].includes(complexity)) {
    console.error(`❌ Invalid complexity: ${complexity}. Must be SMALL, MEDIUM, or LARGE`);
    process.exit(1);
  }

  const taskDir = getTaskDir(taskId);
  const statePath = getStatePath(taskId);

  if (existsSync(statePath)) {
    console.error(`❌ Task already exists: ${taskId}`);
    console.error(`   STATE.json found at: ${statePath}`);
    console.error(`   Use --action=status to check current state, or delete the directory to start fresh.`);
    process.exit(1);
  }

  mkdirSync(taskDir, { recursive: true });

  const initialNode = workflowType === "HOTFIX" ? "node_root_cause" : "node_0_context_builder";

  const state: StateJson = {
    task_id: taskId,
    workflow_type: workflowType,
    complexity,
    current_node: initialNode,
    status: "RUNNING",
    review_cycles: 0,
    qa_cycles: 0,
    artifacts: {},
    gate_checkpoints: {
      gate_0_scope: "PENDING",
      gate_1_architecture: complexity === "SMALL" ? "SKIPPED" : "PENDING",
      gate_6_final_verdict: "PENDING",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  writeState(taskId, state);

  console.log(`✅ Task initialized: ${taskId}`);
  console.log(`   Workflow: ${workflowType}`);
  console.log(`   Complexity: ${complexity}`);
  console.log(`   Initial Node: ${initialNode}`);
  console.log(`   State File: ${statePath}`);
}

function actionTransition(args: Record<string, string>): void {
  const taskId = args.task;
  const targetNode = args.to;
  const newStatus = args.status as StateJson["status"] | undefined;

  if (!taskId || !targetNode) {
    console.error("❌ --task and --to are required for transition");
    process.exit(1);
  }

  const state = readState(taskId);

  if (state.current_node === "completed" && state.status === "COMPLETED") {
    console.error("❌ Task is already completed; no resume transition is allowed.");
    console.error("   Reopen/recovery requires an explicit state action, not a normal handoff.");
    process.exit(1);
  }

  const transitionMap = getTransitionMap(state);
  const allowedTargets = transitionMap[state.current_node];

  if (!allowedTargets) {
    console.error(`❌ No transitions allowed from: ${state.current_node}`);
    console.error(`   Task may be in a terminal state.`);
    process.exit(1);
  }

  if (!allowedTargets.includes(targetNode)) {
    console.error(`❌ Invalid transition: ${state.current_node} → ${targetNode}`);
    console.error(`   Allowed targets: ${allowedTargets.join(", ")}`);
    process.exit(1);
  }

  assertHandoffArtifact(taskId, state.current_node, targetNode);

  const previousNode = state.current_node;
  state.current_node = targetNode;

  if (newStatus) {
    state.status = newStatus;
  } else if (targetNode === "completed") {
    state.status = "COMPLETED";
  }

  // Auto-update gate checkpoints
  if (targetNode === "node_1_architect" || targetNode === "node_2_implementation") {
    if (previousNode === "gate_0_scope_confirmation") {
      state.gate_checkpoints.gate_0_scope = "APPROVED";
    }
  }
  if (targetNode === "node_2_implementation" && previousNode === "gate_1_architecture_approval") {
    state.gate_checkpoints.gate_1_architecture = "APPROVED";
  }
  if (targetNode === "node_5_release_manager" || targetNode === "node_hotfix_release") {
    const qaFreshness = checkQaFreshness(state);
    const reviewFreshness = checkReviewFreshness(state);
    if (qaFreshness.status === "STALE" && args.force !== "true") {
      console.error(`❌ STALE QA VERDICT: ${qaFreshness.reason}`);
      console.error(`   Re-run QA on the current commit before releasing (or pass --force=true to override).`);
      process.exit(1);
    }
    if (reviewFreshness.status === "STALE" && args.force !== "true") {
      console.error(`❌ STALE CODE REVIEW VERDICT: ${reviewFreshness.reason}`);
      console.error(`   Re-run Code Review on the current commit before releasing (or pass --force=true to override).`);
      process.exit(1);
    }
    if (targetNode === "node_5_release_manager") {
      state.gate_checkpoints.gate_6_final_verdict = "APPROVED";
    }
  }

  // Auto-discover artifacts on disk
  state.artifacts = discoverArtifacts(taskId);

  writeState(taskId, state);

  console.log(`✅ Transition: ${previousNode} → ${targetNode}`);
  if (newStatus) console.log(`   Status: ${newStatus}`);
  console.log(`   Artifacts discovered: ${Object.keys(state.artifacts).length}`);
}

function actionAcknowledgeHandoff(args: Record<string, string>): void {
  const taskId = args.task;
  const from = args.from;
  const to = args.to;
  const acknowledgedBy = args.by;
  const acknowledgement = args.message;
  if (!taskId || !from || !to || !acknowledgedBy || !acknowledgement) {
    console.error("❌ --task, --from, --to, --by, and --message are required for ack-handoff");
    process.exit(1);
  }
  const receiptPath = join(getTaskDir(taskId), handoffReceiptFileName(from, to));
  if (!existsSync(receiptPath)) {
    console.error(`❌ Handoff receipt not found: ${receiptPath}`);
    process.exit(1);
  }
  const required = requiredHandoffArtifacts(from, to);
  const missing = required.map((name) => join(getTaskDir(taskId), name)).filter((path) => !existsSync(path));
  if (missing.length > 0) {
    console.error(`❌ Cannot acknowledge handoff with missing artifacts: ${missing.join(", ")}`);
    process.exit(1);
  }
  acknowledgeHandoffReceipt(receiptPath, acknowledgedBy, acknowledgement);
  console.log(`✅ Handoff acknowledged: ${from} → ${to} by ${acknowledgedBy}`);
  console.log(`   Receipt: ${receiptPath}`);
}
function actionSetVerdict(args: Record<string, string>): void {
  const taskId = args.task;
  const target = args.target; // "review" or "qa"
  const verdict = args.verdict?.toUpperCase(); // "PASS" or "FAIL"

  if (!taskId || !target || !verdict) {
    console.error("❌ --task, --target, and --verdict are required for set-verdict");
    process.exit(1);
  }

  if (!["review", "qa"].includes(target)) {
    console.error(`❌ Invalid target: ${target}. Must be "review" or "qa"`);
    process.exit(1);
  }

  if (!["PASS", "FAIL"].includes(verdict)) {
    console.error(`❌ Invalid verdict: ${verdict}. Must be "PASS" or "FAIL"`);
    process.exit(1);
  }

  const state = readState(taskId);

  if (target === "review") {
    state.review_cycles += 1;

    if (verdict === "FAIL") {
      state.review_verification = undefined;
      if (state.review_cycles > 3) {
        state.status = "CIRCUIT_BREAKER_ESCALATED";
        state.current_node = "gate_6_user_final_verdict"; // escalation gate
        writeState(taskId, state);
        console.log(`🔴 CIRCUIT BREAKER: Review failed ${state.review_cycles} times (> 3 max).`);
        console.log(`   Status: CIRCUIT_BREAKER_ESCALATED`);
        console.log(`   Action Required: User must decide — refactor approach, override, or abort.`);
        return;
      }
      state.current_node = "node_2_implementation";
      writeState(taskId, state);
      console.log(`🟡 Review FAIL (cycle ${state.review_cycles}/3) → returning to Node 2 (Implementation)`);
      return;
    }

    // PASS — pin exact Git commit SHA & working-tree hash
    assertHandoffArtifact(taskId, state.current_node, "node_4_qa_validator");
    const reviewSnap = captureGitSnapshot();
    state.review_verification = {
      ...reviewSnap,
      verified_at: new Date().toISOString(),
    };
    state.current_node = "node_4_qa_validator";
    writeState(taskId, state);
    console.log(`✅ Review PASS (after ${state.review_cycles} cycle(s)) → advancing to Node 4 (QA Validator)`);
    if (reviewSnap.commit_sha) {
      console.log(`   📌 Pinned to commit ${reviewSnap.commit_sha.slice(0, 7)} (branch: ${reviewSnap.branch}, tree: ${reviewSnap.tree_hash})`);
    }
    return;
  }

  if (target === "qa") {
    state.qa_cycles += 1;

    if (verdict === "FAIL") {
      state.qa_verification = undefined;
      state.current_node = "node_2_implementation";
      writeState(taskId, state);
      console.log(`🟡 QA FAIL (cycle ${state.qa_cycles}) → returning to Node 2 (Implementation)`);
      return;
    }

    // PASS — pin exact Git commit SHA & working-tree hash so branch drift invalidates stale QA
    const snap = captureGitSnapshot();
    state.qa_verification = {
      ...snap,
      verified_at: new Date().toISOString(),
    };
    state.current_node = state.workflow_type === "HOTFIX" ? "gate_emergency_user_approval" : "gate_6_user_final_verdict";
    writeState(taskId, state);
    console.log(`✅ QA PASS (after ${state.qa_cycles} cycle(s)) → advancing to Gate 6 (User Final Verdict)`);
    if (snap.commit_sha) {
      console.log(`   📌 Pinned to commit ${snap.commit_sha.slice(0, 7)} (branch: ${snap.branch}, tree: ${snap.tree_hash})`);
    }
    return;
  }
}

function actionStatus(args: Record<string, string>): void {
  const taskId = args.task;

  if (!taskId) {
    console.error("❌ --task is required for status");
    process.exit(1);
  }

  const state = readState(taskId);
  const current = captureGitSnapshot();
  const reviewFreshness = checkSnapshotFreshness("Review", state.review_verification, current);
  const qaFreshness = checkSnapshotFreshness("QA", state.qa_verification, current);
  console.log(JSON.stringify({
    ...state,
    review_freshness: reviewFreshness.status,
    ...(reviewFreshness.reason ? { review_freshness_note: reviewFreshness.reason } : {}),
    qa_freshness: qaFreshness.status,
    ...(qaFreshness.reason ? { qa_freshness_note: qaFreshness.reason } : {}),
    current_head_sha: current.commit_sha,
  }, null, 2));
}

// ─── Main ────────────────────────────────────────────────────────────────────

const args = parseArgs();
const action = args.action;

if (!action) {
  console.error("❌ --action is required. Options: init, transition, ack-handoff, set-verdict, status");
  process.exit(1);
}

switch (action) {
  case "init":
    actionInit(args);
    break;
  case "transition":
    actionTransition(args);
    break;
  case "ack-handoff":
    actionAcknowledgeHandoff(args);
    break;
  case "set-verdict":
    actionSetVerdict(args);
    break;
  case "status":
    actionStatus(args);
    break;
  default:
    console.error(`❌ Unknown action: ${action}. Options: init, transition, ack-handoff, set-verdict, status`);
    process.exit(1);
}

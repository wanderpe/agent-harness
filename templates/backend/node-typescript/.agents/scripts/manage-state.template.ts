#!/usr/bin/env bun
/**
 * Deterministic State Graph Engine (TypeScript / Bun)
 * 
 * Manages atomic task state transitions, loop counters, and human gate checkpoints
 * in .agent-work/<TASK_ID>/STATE.json in <1ms on CPU with ZERO LLM tokens.
 * 
 * Usage:
 *   bun .agents/scripts/manage-state.ts --action=init --task=feat/my-feature --complexity=MEDIUM
 *   bun .agents/scripts/manage-state.ts --action=transition --task=feat/my-feature --to=node_1_architect
 *   bun .agents/scripts/manage-state.ts --action=set-verdict --task=feat/my-feature --target=review --verdict=PASS
 *   bun .agents/scripts/manage-state.ts --action=status --task=feat/my-feature
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  acknowledgeHandoffReceipt,
  createHandoffReceipt,
  handoffReceiptFileName,
  requiredHandoffArtifacts,
} from "./lib/handoff-state";

// (Identical implementation to .agents/scripts/manage-state.ts)
export * from "../../scripts/manage-state";

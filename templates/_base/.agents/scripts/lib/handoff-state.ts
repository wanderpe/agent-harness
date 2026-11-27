import { readFileSync, writeFileSync } from "fs";

export type HandoffReceipt = {
  from: string;
  to: string;
  artifact: string;
  artifacts: string[];
  artifactPath: string;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  acknowledgement?: string;
  reconciled?: boolean;
};

const HANDOFF_ARTIFACTS: Record<string, string[]> = {
  "node_root_cause->node_hotfix_implementer": ["HOTFIX_CONTEXT.md", "CODEBASE_MEMORY_REPORT.md"],
  "node_hotfix_implementer->node_adversarial_diff_check": ["HOTFIX_PLAN.md"],
  "node_adversarial_diff_check->node_targeted_qa": ["CODE_REVIEW.md"],
  "node_targeted_qa->gate_emergency_user_approval": ["QA_REPORT.md"],
  "gate_emergency_user_approval->node_hotfix_release": ["HUMAN_APPROVAL.md"],
  "node_hotfix_release->completed": ["RELEASE_REPORT.md"],
};

export function requiredHandoffArtifacts(from: string, to: string): string[] {
  return HANDOFF_ARTIFACTS[`${from}->${to}`] ?? [];
}

export function requiredHandoffArtifact(from: string, to: string): string | undefined {
  return requiredHandoffArtifacts(from, to)[0];
}

export function handoffReceiptFileName(from: string, to: string): string {
  return `HANDOFF_${from}_to_${to}.json`;
}

export function createHandoffReceipt(from: string, to: string, artifactPaths: string[], reconciled = false): HandoffReceipt {
  const artifacts = requiredHandoffArtifacts(from, to);
  if (artifacts.length === 0) throw new Error(`No handoff contract for ${from} -> ${to}`);
  if (artifactPaths.length !== artifacts.length) throw new Error(`Expected ${artifacts.length} artifact paths for ${from} -> ${to}`);
  return {
    from,
    to,
    artifact: artifacts[0],
    artifacts,
    artifactPath: artifactPaths[0],
    createdAt: new Date().toISOString(),
    ...(reconciled ? { reconciled: true } : {}),
  };
}

export function acknowledgeHandoffReceipt(receiptPath: string, acknowledgedBy: string, acknowledgement: string): HandoffReceipt {
  if (!acknowledgedBy.trim()) throw new Error("Acknowledged-by identity is required");
  if (!acknowledgement.trim()) throw new Error("Handoff acknowledgement is required");
  const receipt = JSON.parse(readFileSync(receiptPath, "utf-8")) as HandoffReceipt;
  if (receipt.acknowledgedAt) throw new Error(`Handoff receipt already acknowledged: ${receiptPath}`);
  const updated: HandoffReceipt = {
    ...receipt,
    acknowledgedAt: new Date().toISOString(),
    acknowledgedBy: acknowledgedBy.trim(),
    acknowledgement: acknowledgement.trim(),
  };
  writeFileSync(receiptPath, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

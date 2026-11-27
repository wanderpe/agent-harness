#!/usr/bin/env bun
/**
 * Deterministic Artifact Schema Validator (TypeScript / Bun)
 * 
 * Validates handoff markdown artifacts against defined schema headers and verdicts.
 * 
 * Usage:
 *   bun .agents/scripts/validate-artifact.ts --file=.agent-work/<TASK_ID>/ARCHITECTURE_PLAN.md --type=architecture
 */

export * from "../../scripts/validate-artifact";

#!/usr/bin/env bun
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { loadArtifactRegistry, resolveInsideRoot, validateArtifactContent, validateTranscriptRepetition } from "./lib/contracts";

function parseArgs(): Record<string, string> {
  return Object.fromEntries(process.argv.slice(2).filter((arg) => arg.startsWith("--")).map((arg) => {
    const [key, ...parts] = arg.slice(2).split("=");
    return [key, parts.join("=") || "true"];
  }));
}

const args = parseArgs();
if (!args.file || !args.type) {
  console.error("ERROR [ARTIFACT_ARGS] --file and --type are required");
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
try {
  const registry = loadArtifactRegistry(root);
  const contract = registry.artifacts[args.type];
  if (!contract) {
    console.error(`ERROR [ARTIFACT_TYPE] Unknown artifact type: ${args.type}`);
    console.error(`Valid types: ${Object.keys(registry.artifacts).join(", ")}`);
    process.exit(1);
  }
  const path = resolveInsideRoot(root, args.file);
  if (!existsSync(path)) {
    console.error(`ERROR [ARTIFACT_FILE] File not found: ${args.file}`);
    process.exit(1);
  }
  const content = readFileSync(path, "utf8");
  const errors = [
    ...validateArtifactContent(content, contract),
    ...validateTranscriptRepetition(content, root),
  ];
  if (errors.length > 0) {
    console.error(`INVALID ${args.type}: ${args.file}`);
    for (const error of errors) console.error(`ERROR [ARTIFACT_CONTRACT] ${error}`);
    process.exit(1);
  }
  console.log(`VALID ${args.type}: ${args.file}`);
  console.log(`Headings: ${contract.requiredHeadings.length}/${contract.requiredHeadings.length}`);
} catch (error) {
  console.error(`ERROR [ARTIFACT_REGISTRY] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

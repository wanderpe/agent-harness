import { existsSync, readFileSync, realpathSync, statSync } from "fs";
import { dirname, isAbsolute, relative, resolve } from "path";

export const SUPPORTED_SCHEMA_MAJOR = 1;

export interface ArtifactStatusContract {
  field: string;
  allowedValues: string[];
}

export interface ArtifactContract {
  filename: string;
  template: string;
  requiredHeadings: string[];
  status?: ArtifactStatusContract;
}

export interface ArtifactRegistry {
  schemaVersion: string;
  artifacts: Record<string, ArtifactContract>;
}

export interface Diagnostic {
  rule: string;
  path: string;
  message: string;
}

type TranscriptEvent =
  | { kind: "search"; signature: string }
  | { kind: "read"; path: string }
  | { kind: "write"; path: string };

const SEARCH_COMMANDS = new Set(["grep", "rg", "select-string", "grep_search"]);
const READ_COMMANDS = new Set(["get-content", "cat", "view_file"]);
const WRITE_COMMANDS = new Set([
  "set-content",
  "add-content",
  "apply_patch",
  "write_to_file",
  "replace_file_content",
  "multi_replace_file_content",
]);

function normalizeTranscriptPath(value: string, repositoryRoot: string): string {
  const candidate = value.trim().replace(/^["']|["']$/g, "").replace(/\\/g, "/");
  const absoluteRoot = resolve(repositoryRoot);
  const absoluteTarget = resolve(absoluteRoot, candidate);
  const relativeTarget = relative(absoluteRoot, absoluteTarget);
  const canonical = relativeTarget === "" || (!relativeTarget.startsWith("..") && !isAbsolute(relativeTarget))
    ? relativeTarget || "."
    : absoluteTarget;
  return canonical.replace(/\\/g, "/").toLowerCase();
}

function shellTokens(command: string): string[] {
  return command.match(/"[^"]*"|'[^']*'|\S+/g)?.map((token) => token.replace(/^["']|["']$/g, "")) ?? [];
}

function commandTarget(command: string): string | undefined {
  const tokens = shellTokens(command);
  const literalPathIndex = tokens.findIndex((token) => token.toLowerCase() === "-literalpath");
  if (literalPathIndex >= 0) return tokens[literalPathIndex + 1];
  return tokens.slice(1).reverse().find((token) => !token.startsWith("-"));
}

function structuredEvent(line: string, repositoryRoot: string): TranscriptEvent[] {
  const match = /^(?:tool(?:_call)?\s*[:=]\s*)?(grep_search|view_file|apply_patch|write_to_file|replace_file_content|multi_replace_file_content)\s*\((\{.*\})\)\s*$/i.exec(line.trim());
  if (!match) return [];
  try {
    const args = JSON.parse(match[2]) as Record<string, unknown>;
    const name = match[1].toLowerCase();
    if (name === "grep_search") return [{ kind: "search", signature: `${name} ${JSON.stringify(args)}` }];
    const candidate = args.path ?? args.file ?? args.filePath ?? args.target;
    if (name === "apply_patch" && typeof args.patch === "string") {
      return [...args.patch.matchAll(/^\*\*\* (?:Add|Update|Delete) File:\s*(.+)$/gm)].map((entry) => ({
        kind: "write" as const,
        path: normalizeTranscriptPath(entry[1], repositoryRoot),
      }));
    }
    if (typeof candidate !== "string") return [];
    return [{ kind: name === "view_file" ? "read" : "write", path: normalizeTranscriptPath(candidate, repositoryRoot) }];
  } catch {
    return [];
  }
}

export function parseTranscriptEvents(content: string, repositoryRoot: string): TranscriptEvent[] {
  const events: TranscriptEvent[] = [];
  let commandFence = false;
  for (const rawLine of content.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    const fence = /^```\s*(.*)$/i.exec(trimmed);
    if (fence) {
      commandFence = !commandFence && /^(?:bash|sh|shell|powershell|ps1|console)$/.test(fence[1].toLowerCase());
      continue;
    }
    const structured = structuredEvent(trimmed, repositoryRoot);
    if (structured.length > 0) {
      events.push(...structured);
      continue;
    }
    const prompt = /^(?:PS[^>]*>|\$|>)\s+(.+)$/.exec(trimmed);
    if (!commandFence && !prompt) continue;
    const command = (prompt?.[1] ?? trimmed).replace(/\s+/g, " ").trim();
    const name = shellTokens(command)[0]?.toLowerCase();
    if (!name) continue;
    if (SEARCH_COMMANDS.has(name)) events.push({ kind: "search", signature: `${name} ${command.slice(name.length).trim()}` });
    else if (READ_COMMANDS.has(name)) {
      const target = commandTarget(command);
      if (target) events.push({ kind: "read", path: normalizeTranscriptPath(target, repositoryRoot) });
    } else if (WRITE_COMMANDS.has(name)) {
      const target = commandTarget(command);
      if (target) events.push({ kind: "write", path: normalizeTranscriptPath(target, repositoryRoot) });
    }
  }
  return events;
}

export function validateTranscriptRepetition(content: string, repositoryRoot = process.cwd()): string[] {
  const errors: string[] = [];
  const searches = new Map<string, number>();
  const reads = new Map<string, number>();
  const reportedSearches = new Set<string>();
  const reportedReads = new Set<string>();
  for (const event of parseTranscriptEvents(content, repositoryRoot)) {
    if (event.kind === "search") {
      const count = (searches.get(event.signature) ?? 0) + 1;
      searches.set(event.signature, count);
      if (count === 3 && !reportedSearches.has(event.signature)) {
        reportedSearches.add(event.signature);
        errors.push(`REPETITION_IDENTICAL_SEARCH: identical search ran ${count} times: ${event.signature}`);
      }
    } else if (event.kind === "read") {
      const count = (reads.get(event.path) ?? 0) + 1;
      reads.set(event.path, count);
      if (count === 3 && !reportedReads.has(event.path)) {
        reportedReads.add(event.path);
        errors.push(`REPETITION_UNMODIFIED_READ: ${event.path} was read ${count} times without modification`);
      }
    } else {
      reads.set(event.path, 0);
      reportedReads.delete(event.path);
    }
  }
  return errors;
}

interface JsonSchemaSubset {
  type?: "object" | "array" | "string" | "boolean" | "number" | "null";
  required?: string[];
  properties?: Record<string, JsonSchemaSubset>;
  pattern?: string;
  items?: JsonSchemaSubset;
  enum?: unknown[];
  anyOf?: JsonSchemaSubset[];
  minLength?: number;
  minItems?: number;
  additionalProperties?: boolean | JsonSchemaSubset;
}

export function repositoryRootFromScript(scriptUrl: string): string {
  return resolve(dirname(new URL(scriptUrl).pathname.replace(/^\/(?:[A-Za-z]:)/, (value) => value.slice(1))), "..", "..");
}

export function resolveInsideRoot(root: string, candidate: string): string {
  if (!existsSync(root) || !statSync(root).isDirectory()) throw new Error(`Repository root must be an existing directory: ${root}`);
  if (isAbsolute(candidate)) throw new Error(`Path escapes repository root: ${candidate}`);
  const absoluteRoot = realpathSync(resolve(root));
  const absoluteCandidate = resolve(absoluteRoot, candidate);
  const rel = relative(absoluteRoot, absoluteCandidate);
  if (rel === ".." || rel.startsWith(`..\\`) || rel.startsWith("../")) {
    throw new Error(`Path escapes repository root: ${candidate}`);
  }
  let existingAncestor = absoluteCandidate;
  while (!existsSync(existingAncestor)) {
    const parent = dirname(existingAncestor);
    if (parent === existingAncestor) throw new Error(`Path has no existing ancestor: ${candidate}`);
    existingAncestor = parent;
  }
  const realAncestor = realpathSync(existingAncestor);
  const ancestorRel = relative(absoluteRoot, realAncestor);
  if (ancestorRel === ".." || ancestorRel.startsWith(`..\\`) || ancestorRel.startsWith("../")) {
    throw new Error(`Resolved path escapes repository root: ${candidate}`);
  }
  return absoluteCandidate;
}

export function readJsonInsideRoot<T>(root: string, candidate: string): T {
  const path = resolveInsideRoot(root, candidate);
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot parse ${candidate}: ${reason}`);
  }
}

export function assertSupportedVersion(version: unknown, label: string): void {
  if (typeof version !== "string" || !/^\d+\.\d+\.\d+(?:[-+].+)?$/.test(version)) {
    throw new Error(`${label} must use semantic versioning; received ${String(version)}`);
  }
  const major = Number(version.split(".")[0]);
  if (major !== SUPPORTED_SCHEMA_MAJOR) {
    throw new Error(`${label} major version ${major} is unsupported; migrate to major ${SUPPORTED_SCHEMA_MAJOR}`);
  }
}

export function validateJsonSchemaSubset(value: unknown, schema: JsonSchemaSubset, location = "$"): string[] {
  const errors: string[] = [];
  const supported = new Set(["$schema", "$id", "title", "type", "required", "properties", "pattern", "items", "enum", "anyOf", "minLength", "minItems", "additionalProperties"]);
  for (const key of Object.keys(schema)) if (!supported.has(key)) errors.push(`${location}: unsupported schema keyword ${key}`);
  if (schema.anyOf) {
    if (!Array.isArray(schema.anyOf) || schema.anyOf.length === 0) return [...errors, `${location}: anyOf must be a non-empty array`];
    const candidateErrors = schema.anyOf.map((candidate) => validateJsonSchemaSubset(value, candidate, location));
    if (!candidateErrors.some((candidate) => candidate.length === 0)) errors.push(`${location}: does not match any permitted schema`);
    return errors;
  }
  const actualType = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  if (schema.type && actualType !== schema.type) return [`${location}: expected ${schema.type}, received ${actualType}`];
  if (schema.enum && !schema.enum.some((entry) => entry === value)) errors.push(`${location}: value is not in the allowed enum`);
  if (schema.type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
    const object = value as Record<string, unknown>;
    for (const key of schema.required ?? []) if (!(key in object)) errors.push(`${location}: missing required property ${key}`);
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (key in object) errors.push(...validateJsonSchemaSubset(object[key], childSchema, `${location}.${key}`));
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(object)) if (!(key in (schema.properties ?? {}))) errors.push(`${location}: unexpected property ${key}`);
    } else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
      for (const [key, child] of Object.entries(object)) if (!(key in (schema.properties ?? {}))) {
        errors.push(...validateJsonSchemaSubset(child, schema.additionalProperties, `${location}.${key}`));
      }
    }
  }
  if (schema.type === "array" && Array.isArray(value) && schema.items) {
    value.forEach((item, index) => errors.push(...validateJsonSchemaSubset(item, schema.items!, `${location}[${index}]`)));
  }
  if (schema.type === "array" && Array.isArray(value) && schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${location}: expected at least ${schema.minItems} items`);
  if (schema.type === "string" && typeof value === "string" && schema.pattern && !new RegExp(schema.pattern).test(value)) {
    errors.push(`${location}: value does not match ${schema.pattern}`);
  }
  if (schema.type === "string" && typeof value === "string" && schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${location}: expected at least ${schema.minLength} characters`);
  return errors;
}

export function loadArtifactRegistry(root: string, path = ".agents/contracts/artifact-contracts.json"): ArtifactRegistry {
  const registry = readJsonInsideRoot<ArtifactRegistry>(root, path);
  assertSupportedVersion(registry.schemaVersion, "artifact contract schemaVersion");
  if (!registry.artifacts || typeof registry.artifacts !== "object" || Array.isArray(registry.artifacts)) {
    throw new Error("artifact contract registry must contain an artifacts object");
  }
  const filenames = new Set<string>();
  for (const [id, contract] of Object.entries(registry.artifacts)) {
    if (!id || !contract.filename || !contract.template || !Array.isArray(contract.requiredHeadings) || contract.requiredHeadings.length === 0) {
      throw new Error(`artifact contract ${id || "<empty>"} is incomplete`);
    }
    if (filenames.has(contract.filename)) throw new Error(`duplicate artifact filename: ${contract.filename}`);
    filenames.add(contract.filename);
    if (new Set(contract.requiredHeadings).size !== contract.requiredHeadings.length) {
      throw new Error(`artifact contract ${id} contains duplicate headings`);
    }
    if (contract.status && (!contract.status.field || !Array.isArray(contract.status.allowedValues) || contract.status.allowedValues.length === 0 || contract.status.allowedValues.some((value) => typeof value !== "string"))) {
      throw new Error(`artifact contract ${id} has an invalid status rule`);
    }
  }
  return registry;
}

function withoutHtmlComments(content: string): string {
  return content.replace(/<!--[\s\S]*?-->/g, "");
}

export function validateArtifactContent(content: string, contract: ArtifactContract): string[] {
  const visible = withoutHtmlComments(content);
  const headings = new Set(
    visible.split(/\r?\n/).flatMap((line) => {
      const match = /^#{1,6}\s+(.+?)\s*$/.exec(line.trim());
      return match ? [match[1].trim()] : [];
    }),
  );
  const errors = contract.requiredHeadings
    .filter((heading) => ![...headings].some((actual) => actual === heading || actual.startsWith(`${heading} `)))
    .map((heading) => `Missing heading: ## ${heading}`);
  if (contract.status) {
    const escaped = contract.status.field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = new RegExp(`^\\s*${escaped}\\s*:\\s*([A-Za-z_-]+)\\s*$`, "m").exec(visible);
    if (!match || !contract.status.allowedValues.includes(match[1])) {
      errors.push(`Missing or invalid ${contract.status.field}; expected ${contract.status.allowedValues.join(" | ")}`);
    }
  }
  return errors;
}

export function listFilesRecursively(root: string): string[] {
  if (!existsSync(root)) return [];
  if (!statSync(root).isDirectory()) return [root];
  const files: string[] = [];
  for (const entry of new Bun.Glob("**/*").scanSync({ cwd: root, onlyFiles: true, dot: true })) {
    files.push(resolve(root, entry));
  }
  return files;
}

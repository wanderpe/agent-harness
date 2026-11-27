# Create Pull Request via GitHub MCP Workflow

Use this workflow whenever creating a feature branch, committing code, and opening a Pull Request using the `github-mcp-server` MCP server tools.

---

## Pre-requisites & MCP Tools

The `github-mcp-server` provides the following lazy-loaded tools:
- `create_branch`
- `push_files`
- `create_pull_request`

---

## Workflow Steps

### Step 1: Check Target Repository Details
Identify:
- Repository `owner` and `repo`
- Target `base` branch (typically `main` or `master`)
- Target `branch` name (following `feat/`, `fix/`, `refactor/`, `chore/` conventions)

### Step 2: Create a Feature Branch
Invoke `call_mcp_tool` with `ToolName: "create_branch"`:
- `owner`: Repository owner
- `repo`: Repository name
- `branch`: New branch name (e.g., `feat/user-wallet-transaction-resource`)
- `from_branch`: Base branch name (e.g., `main`)

### Step 3: Commit Code with Caveman Conventional Commit (caveman-commit)
Invoke `call_mcp_tool` with `ToolName: "push_files"`:
- `owner`: Repository owner
- `repo`: Repository name
- `branch`: Feature branch name
- `files`: Array of `{ path, content }` objects for modified or new files.
- `message`: A context-rich commit message structured as follows:

```text
<type>(<scope>): <short summary>

### Context & Motivation
<Why this change was made and what problem it solves>

### Key Changes
- <List of specific implementation details>
- <Design decisions, patterns, or architecture considerations>

### Impact & Safety
- <Security, performance, DB transaction safety, or tenancy impact>
```

### Step 4: Open Pull Request with Detailed Body
Invoke `call_mcp_tool` with `ToolName: "create_pull_request"`:
- `owner`: Repository owner
- `repo`: Repository name
- `title`: Concise PR title following Conventional Commits format
- `head`: Feature branch name
- `base`: Base branch name
- `body`: Structured markdown PR description formatted as follows:

```markdown
## 📌 Summary of Changes
<High-level summary of the PR feature or fix>

## 🛠️ Changes Implemented
- **[Component/Layer]**: Description of changes
- **[Database/Models]**: Migration or model schema adjustments
- **[API/Resources]**: API contract changes

## 🛡️ QA, Security & Concurrency Verification
- [x] Authorization and tenant scoping verified
- [x] Database transactions enforced for multi-step mutations
- [x] Potential race conditions / concurrency risks evaluated
- [x] Validation and edge cases handled

## 🧪 Testing Strategy
- Unit & Feature test summary
- Verification details

---
*Created automatically via GitHub MCP Server*
```

---

## PR Body Structure (`pr` skill)
Format the PR description using the built-in `.agents/skills/pr/SKILL.md` template:
- **Summary**: Concise diagram, diff-sketch, or call tree.
- **Evidence**: Concrete Before / After test output or screenshots.
- **Merge Danger**: One-way vs two-way door + Blast Radius.

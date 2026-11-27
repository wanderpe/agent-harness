# Release Report — {{TASK_ID}}

## User Approval

- **Gate 6 Verdict**: <!-- APPROVED -->
- **Approved At**: <!-- timestamp -->

## Documentation Updated

- [ ] `MEMORY.md` — entry appended to Section 7
- [ ] `MEMORY_ARCHIVE.md` — detailed narrative entry added
- [ ] Domain chunks updated (if applicable)

## MEMORY.md Updated

| Date | Task ID | Scope | Key Files | Verdict |
|:---|:---|:---|:---|:---|
| | | | | ✅ SHIPPED |

## Commit

- **Message**: `<!-- feat(scope): description -->`
- **Branch**: `<!-- explicit user-approved target from project model / release gate -->`
- **SHA**: `<!-- commit hash -->`

## Team & API Handoff Brief (for Slack / Jira / PR)

```markdown
### 🚀 Release / Handoff: {{TASK_ID}}
- **Summary**: <What was released and business problem solved>
- **API Contracts / Endpoints Touched**: <Endpoints, Server Actions, or DTO updates>
- **Payload Schema Changes**: <Request/Response changes or 'None'>
- **Downstream Impact**: <Sibling modules, mobile app, background workers>
- **Edge Cases Tested**: <Empty states, nulls, timeouts, mobile layout verified>
- **QA Test Steps**: <Brief steps for QA team to verify in staging>
```

## Files Changed

```
<!-- Paste git diff --stat output -->
```

## Catalogs Synced

- [ ] `sync-catalogs.ts` executed after release

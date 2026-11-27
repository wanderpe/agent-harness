# Hotfix Plan — {{TASK_ID}}

## Hotfix Summary

<!-- One-sentence description of the fix -->

## Lines to Touch

| File | Lines | Change |
|:---|:---|:---|
| | | |

## Fix Description

<!-- Detailed explanation of the surgical fix. What changes and why. (Confirm no symptom-only band-aid) -->

## Regression Risk

- **Risk Level**: <!-- LOW / MEDIUM / HIGH -->
- **Blast Radius Consumers**: <!-- Sibling components/routes tested for regressions -->
- **Edge Cases Considered**: <!-- Empty state, null/undefined inputs, mobile screen -->
- **Mitigation**: <!-- How regression risk is prevented -->

## Verification

- [ ] Fix resolves root cause (not just surface symptom)
- [ ] Edge cases verified (empty state, nulls, network failure toast)
- [ ] Blast radius sibling feature tested
- [ ] No new lint errors (`npm run lint`)
- [ ] Build passes (`npm run build`)
- [ ] No unrelated changes in diff

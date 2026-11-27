---
description:
---

# Frontend Engineering Workflow

Guide frontend requirements through codebase discovery,
UI/UX design, responsive design, implementation planning,
implementation, and manual verification.

The existing codebase is the source of truth.

The USER is the final reviewer and has the final decision
on whether the implementation is complete.

Do not automatically run the full test suite unless the
USER explicitly requests it.

---

## 1. Understand the Requirement

Determine whether the request is:

- new page
- new component
- feature
- enhancement
- bug fix
- refactor
- responsive improvement
- UI/UX improvement
- performance improvement

Understand:

- user goal
- expected functionality
- affected pages
- affected components
- affected state
- responsive requirements

Do not implement yet.

Ask only questions that cannot be answered by inspecting
the existing codebase.

---

## 2. Inspect the Existing Codebase

Before designing or implementing anything, inspect the
existing application.

Analyze:

- project structure
- routes
- pages
- layouts
- components
- shared components
- UI primitives
- styling system
- Tailwind configuration
- design tokens
- typography
- colors
- spacing
- breakpoints
- icons
- forms
- tables
- modals
- navigation
- loading states
- error states
- empty states
- responsive patterns
- state management
- API/data-fetching patterns

Search for similar existing implementations.

Prefer extending existing components and patterns instead
of creating new ones.

---

## 3. Design Review

Load and apply:

- `architecture-designer`
- `nextjs-best-practices`
- `ui-ux-pro-max`
- `shadcn-ui`
- `redux-toolkit` when state management is involved

The design must align with the existing codebase.

Review:

### UI/UX

- visual hierarchy
- spacing
- typography
- consistency
- interaction clarity
- accessibility
- loading states
- empty states
- error states
- success states
- feedback
- navigation
- forms
- interaction patterns

### Responsive Design

Consider at minimum:

- mobile
- tablet
- desktop
- large desktop

Do not simply shrink the desktop layout.

Determine whether layout, navigation, controls, tables,
cards, typography, and spacing need to change at different
breakpoints.

### Functionality

Review:

- state management
- API integration
- loading behavior
- error handling
- optimistic updates where appropriate
- caching
- URL state
- form behavior
- permissions
- edge cases

---

## 4. Codebase Standards

The implementation must follow existing project conventions.

Before creating a new:

- component
- hook
- utility
- Redux slice
- API function
- UI primitive
- styling pattern
- layout
- abstraction

search the repository for an existing equivalent.

Reuse existing components whenever possible.

Do not introduce a new design pattern without justification.

Do not duplicate existing functionality.

---

## 5. No AI-Slop UI

The UI must NOT look like generic AI-generated interface
design.

Avoid:

- unnecessary gradients
- excessive rounded cards
- excessive glassmorphism
- random shadows
- decorative blobs
- unnecessary icons
- excessive badges
- meaningless animations
- oversized headings
- excessive whitespace
- arbitrary colors
- inconsistent border radii
- inconsistent spacing
- excessive cards inside cards
- dashboard-style layouts when a simpler layout is better
- generic "modern SaaS" styling without reference to the
  existing product

Do not add visual elements simply because they look impressive.

Every visual element must have a purpose.

Prefer:

- clear hierarchy
- intentional spacing
- restrained styling
- consistent typography
- consistent component usage
- strong information architecture
- accessible interactions
- product-specific visual language

The existing product design system takes precedence over
generic design trends.

---

## 6. Implementation Plan

Create a detailed implementation plan before coding.

Include:

- affected routes/pages
- existing components to reuse
- components to modify
- components to create
- state changes
- API/data changes
- responsive behavior
- UI/UX decisions
- accessibility considerations
- loading states
- error states
- empty states
- interaction states
- dependencies
- potential regressions

Reference actual existing files.

Do NOT implement yet.

---

## 7. Context-Rich Task Generation

After the implementation plan is approved, create
context-rich implementation tasks.

Every task must include:

- task ID
- objective
- why it exists
- existing codebase context
- relevant files
- similar implementations
- UI/UX decision
- responsive behavior
- functionality requirements
- components to reuse
- components to create/modify
- state requirements
- API requirements
- accessibility requirements
- edge cases
- acceptance criteria
- implementation constraints

Tasks must explain WHY the implementation should be
done a particular way.

Order tasks by dependency.

---

## 8. Implementation

For EVERY task:

1. Read the complete task.
2. Inspect all referenced files.
3. Search for similar existing components.
4. Load relevant frontend skills.
5. Confirm alignment with the existing design system.
6. Confirm responsive behavior.
7. Implement the smallest appropriate change.
8. Preserve existing functionality.
9. Avoid unnecessary abstractions.
10. Do not modify unrelated code.

Relevant skills may include:

- `nextjs-best-practices`
- `ui-ux-pro-max`
- `shadcn-ui`
- `redux-toolkit`
- `architecture-designer`

Use only the skills relevant to the task.

---

## 9. Responsive Verification

Before considering implementation finished, review the
implementation at:

- mobile
- tablet
- desktop
- large desktop

Check:

- overflow
- horizontal scrolling
- text wrapping
- button sizing
- navigation behavior
- modal behavior
- table behavior
- card layouts
- spacing
- typography
- images
- forms
- touch targets

Do not assume desktop CSS automatically works on mobile.

---

## 10. Manual Verification Guide

Do NOT automatically declare the feature complete.

Provide the USER with a manual verification walkthrough.

Explain:

### What Changed

- pages
- components
- state
- API integration
- styling
- responsive behavior

### Logic Walkthrough

Explain the flow:

User interaction
→ component
→ state
→ API
→ response
→ UI update

### UI Walkthrough

Explain:

- layout hierarchy
- important interactions
- loading states
- error states
- empty states
- responsive behavior

### Manual Test Steps

Provide concrete steps the USER can follow.

Include:

- normal flow
- invalid input
- loading state
- error state
- empty state
- mobile behavior
- tablet behavior
- desktop behavior
- regression checks

### Expected Results

For each test, explain exactly what should happen.

---

## 11. Final User Review

The USER is the final reviewer.

Do not claim the feature is complete automatically.

Present:

### Implementation Summary

What changed and why.

### Codebase Alignment

How the implementation follows existing patterns.

### UI/UX Summary

What design decisions were made.

### Responsive Summary

How the UI behaves across screen sizes.

### Logic Walkthrough

How the feature works.

### Manual Verification Guide

Exactly how the USER should verify it.

### Known Issues / Risks

Anything that still needs attention.

### Recommended Improvements

Optional improvements that are not required.

Then ask the USER to decide:

- Complete
- Needs Changes
- Needs Further Investigation

The USER has final authority.

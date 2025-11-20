# Implementation Plan Guide

Creates actionable plans for Phase 3 (Plan) of the development process.

<!-- CUSTOMIZE THIS TEMPLATE:
- Add your repository structure
- Include your file naming conventions
- Define your task breakdown style
- Add your dependency management approach
-->

## Template

```markdown
# Plan: [Feature Name]

## Plan Overview

**Feature Name**: [Same as design]
**Design Document**: [Link to design]
**Date**: [Use `date +%Y%m%d`]

### Summary
[How you'll implement the design in 1 paragraph]

### Process Checklist
Copy to `.scratch/todo.md`:
- [x] 1. Understand
- [x] 2. Design
- [x] 2.5. Resolve Open Questions
- [x] 3. Plan (current)
- [ ] 4. Develop
- [ ] 5. Document
- [ ] 6. Update

### Resolved Questions from Design
*(Reference answers from Phase 2.5)*
- [Question]: [Answer that informs this plan]
- [Question]: [Answer that informs this plan]

## Repository Context

### Patterns to Follow
- [Pattern]: See `path/to/example.js`

### Files to Modify
- `path/to/file.js`: [what changes]

### Dependencies
<!-- Use MCP servers if available:
- versionator: Check latest versions with get_package_version("npm", "package-name")
- context7: Fetch current docs with get-library-docs (requires API key)
-->
- [package@version]: [why needed]

## Implementation Steps

### Step 1: [Setup/Foundation]
- [ ] Create directories:
  ```bash
  mkdir -p src/feature
  ```
- [ ] Create files:
  - `src/feature/index.js`: Entry point
  - `src/feature/core.js`: Main logic

### Step 2: [Core Implementation]
- [ ] Implement [specific functionality]:
  ```javascript
  // Structure/pseudocode
  function feature() {
    // Validate inputs (fail hard)
    // Process
    // Return result
  }
  ```

### Step 3: [Testing]
- [ ] Unit tests in `tests/feature.test.js`:
  - Test: valid input → expected output
  - Test: invalid input → throws error
  - Test: edge cases
- [ ] Run: `npm test`

### Step 4: [Integration]
- [ ] Wire into main app
- [ ] Update configuration
- [ ] Verify end-to-end

## File Structure
```
src/
├── feature/
│   ├── index.js
│   └── core.js
tests/
└── feature.test.js
```

## Validation
- [ ] All design requirements addressed
- [ ] All resolved questions from Phase 2.5 incorporated into plan
- [ ] File paths verified to exist
- [ ] Dependencies at latest versions
- [ ] Test coverage planned
- [ ] Fail-hard approach throughout
```

## Checklist
- [ ] Steps are specific and actionable
- [ ] All paths/commands verified
- [ ] Dependencies checked with versionator
- [ ] Tests cover success and failure
- [ ] No silent error handling

## Output
Save as: `[your-docs-dir]/plans/[date]_plan_[feature_name].md`

## Prerequisites
- Ensure Phase 2.5 has been completed (all open questions from design have been resolved)
- Reference resolved questions from the design document when creating this plan

## Next Step
Execute the plan with 4_DEVELOPMENT_PROCESS.md
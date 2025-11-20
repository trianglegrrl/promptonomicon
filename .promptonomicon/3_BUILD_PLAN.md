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
<!-- Use MCP servers if available to get accurate dependency information:
- versionator: ALWAYS use when adding/updating dependencies - check latest versions with get_package_version("npm", "package-name")
- context7: Use when you need current documentation for a library/package - get-library-docs (requires CONTEXT7_API_KEY)
-->
- [package@version]: [why needed - version from versionator MCP server]

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
- [ ] Dependencies checked with versionator MCP server (if available)
- [ ] Tests cover success and failure
- [ ] No silent error handling

## MCP Server Usage Guidelines

When creating implementation plans, use available MCP servers:

### versionator (Always use for dependencies)
- **When to use**: Before adding or updating ANY dependency
- **How to use**: `get_package_version("ecosystem", "package-name")`
- **Examples**:
  - `get_package_version("npm", "react")` → Get latest React version
  - `get_package_version("pypi", "django")` → Get latest Django version
  - `get_package_version("rubygems", "rails")` → Get latest Rails version
- **Why**: Ensures you're using current, supported versions and following versioning-first principles

### context7 (Use for library documentation)
- **When to use**: When you need current documentation for external libraries/frameworks
- **How to use**: `get-library-docs("/library/path")`
- **Examples**:
  - `get-library-docs("/react/react")` → Get React documentation
  - `get-library-docs("/expressjs/express")` → Get Express.js documentation
- **Why**: Gets up-to-date documentation directly from the source

### Supabase (Use for database/API work)
- **When to use**: When working with Supabase databases, authentication, storage, or real-time features
- **How to use**: Supabase MCP tools (if configured with SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN)
- **Why**: Direct integration with Supabase services for database queries, auth operations, etc.

### GitHub (Use for repository operations)
- **When to use**: When working with GitHub repositories, issues, pull requests, or GitHub API operations
- **How to use**: GitHub MCP tools (if configured with GITHUB_PAT)
- **Why**: Direct access to GitHub API for repository management, issue tracking, PR creation/review

### mcp-server-time (Use for time operations)
- **When to use**: When working with dates, times, scheduling, timezone conversions, or time-based logic
- **How to use**: Time-related MCP tools (if configured)
- **Why**: Provides accurate time operations and timezone handling

### General Rules
1. **Always use versionator** when dealing with dependencies - it's a core requirement
2. **Check MCP availability** before planning to use MCP features
3. **Document MCP requirements** in your plan if they're essential
4. **Use environment variables** - never hardcode tokens/keys

## Output
Save as: `[your-docs-dir]/plans/[date]_plan_[feature_name].md`

## Prerequisites
- Ensure Phase 2.5 has been completed (all open questions from design have been resolved)
- Reference resolved questions from the design document when creating this plan

## Next Step
Execute the plan with 4_DEVELOPMENT_PROCESS.md
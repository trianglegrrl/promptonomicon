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

Follow TDD (Test-Driven Development) for each step: RED → GREEN → REFACTOR

### Step 1: [Setup/Foundation]
- [ ] Create directory structure following project conventions
- [ ] Create initial files:
  - Entry point files
  - Core logic files
  - Test files (write tests first)
- [ ] Set up test framework if needed
- [ ] Verify starting state: tests run (should be empty/passing)

**Principles to Apply**:
- Keep it simple (KISS)
- Only create what's needed now (YAGNI)
- Clear, descriptive file names
- Logical directory structure

### Step 2: [Core Implementation - TDD Cycle]

For each component/function, follow RED-GREEN-REFACTOR:

#### RED: Write Tests First
- [ ] Write failing test for happy path
- [ ] Write failing test for error cases
- [ ] Write failing test for edge cases
- [ ] Run tests - confirm they fail for the right reason

#### GREEN: Implement Minimum Code
- [ ] Write minimum code to make tests pass
- [ ] No premature optimization
- [ ] No over-engineering
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Extract common functionality (DRY)
- [ ] Apply SOLID principles
- [ ] Improve naming for clarity
- [ ] Separate concerns if needed
- [ ] Run tests - confirm still passing

**Implementation Guidelines**:
- Validate inputs at function boundaries (fail-hard)
- Single responsibility per function/class
- Small functions (< 20 lines, max ~50)
- Descriptive names that reveal intent
- Limit parameters (use objects/structs for many params)

### Step 3: [Testing - Comprehensive Coverage]
- [ ] Unit tests for all components:
  - Happy path: valid input → expected output
  - Error path: invalid input → throws error
  - Edge cases: empty, null, boundary conditions
- [ ] Integration tests for component interactions
- [ ] Run all tests: `npm test` (or equivalent)
- [ ] Verify coverage >90%
- [ ] All tests passing before moving on

**Testing Principles**:
- Test behavior, not implementation
- One test = one behavior
- Clear test names describing what is tested
- Tests are independent and isolated
- Use mocks/stubs for external dependencies

### Step 4: [Integration]
- [ ] Wire components into main application
- [ ] Update configuration if needed
- [ ] Verify end-to-end workflow
- [ ] Test integration points
- [ ] Ensure error handling works across boundaries

**Integration Principles**:
- Test integration points thoroughly
- Verify data flow between components
- Confirm error propagation works correctly
- Ensure separation of concerns maintained

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

### Plan Completeness
- [ ] All design requirements addressed
- [ ] All resolved questions from Phase 2.5 incorporated into plan
- [ ] File paths verified to exist or will be created
- [ ] Dependencies at latest versions (checked with versionator MCP if available)

### Architecture & Design Principles
- [ ] SOLID principles applied in component design
- [ ] Separation of concerns maintained (presentation, business, data)
- [ ] DRY principle: no planned code duplication
- [ ] KISS principle: simplest solution chosen
- [ ] YAGNI principle: only necessary features planned

### Testing Strategy
- [ ] TDD approach planned (tests before implementation)
- [ ] Unit tests planned for all components
- [ ] Integration tests planned for component interactions
- [ ] Edge cases identified and testable
- [ ] Test coverage target >90% planned

### Code Quality
- [ ] Fail-hard error handling planned
- [ ] Input validation planned at boundaries
- [ ] Single responsibility per component
- [ ] Dependencies are minimal and explicit
- [ ] Clear naming conventions will be followed

### Implementation Approach
- [ ] Red-Green-Refactor cycle will be followed
- [ ] Small, incremental commits planned
- [ ] Code review checklist will be used
- [ ] Documentation plan in place
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
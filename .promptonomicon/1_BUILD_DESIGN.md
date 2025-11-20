# Design Document Guide

Creates design documents for Phases 1 (Understand) and 2 (Design) of the development process.

<!-- CUSTOMIZE THIS TEMPLATE:
- Add your specific design sections
- Include your architecture patterns
- Define your requirements format
- Add your success criteria style
-->

## Template

```markdown
# Design: [Feature Name]

## Feature Overview

**Feature Name**: [Clear, descriptive name]
**Date**: [Use `date +%Y%m%d`]
**Author**: [Name]
**Status**: Draft

### Executive Summary
[2-3 sentences: what this does and why it's needed]

### Problem Statement
[What problem does this solve?]

### Success Criteria
- [ ] [Specific, measurable outcome]
- [ ] [Another measurable outcome]

## Requirements Analysis

### Functional Requirements
- [What the system must do]
- [Specific behaviors required]

### Non-Functional Requirements
- Performance: [expectations]
- Security: [requirements]
- Usability: [standards]

### Constraints
- [Technical/business/time constraints]

## Context Investigation

**First**: Consult the Documentation Index (`.promptonomicon/DOCUMENTATION_INDEX.md`) to identify relevant documentation to review.

### Repository Analysis
- Architecture patterns: [what exists]
- Similar features: [examples]
- Integration points: [where this fits]

**Reference Documentation**:
- Review architecture docs (if applicable): See `.promptonomicon/DOCUMENTATION_INDEX.md`
- Review similar feature docs: See `ai-docs/features/` and previous design docs in `ai-docs/ai-design/`
- Review API docs (if using APIs): See `.promptonomicon/DOCUMENTATION_INDEX.md`
- Review implementation docs: See `ai-docs/ai-implementation/` for lessons learned

### Technical Stack
- [Languages, frameworks, tools in use]

## Proposed Solution

### High-Level Approach
[Overall strategy in 1-2 paragraphs]

### Architecture Principles to Apply

**SOLID Principles**:
- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Design for extension without modification
- **Liskov Substitution**: Derived components can replace base components
- **Interface Segregation**: Create focused, specific interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

**Separation of Concerns**:
- Separate presentation, business logic, and data access
- Each layer has distinct responsibilities
- Changes in one layer shouldn't cascade to others

**DRY (Don't Repeat Yourself)**:
- Identify common patterns and abstractions
- Extract shared logic into reusable components
- Avoid duplicating business rules or validation logic

**KISS (Keep It Simple)**:
- Choose the simplest solution that solves the problem
- Avoid over-engineering or premature optimization
- Prefer clarity over cleverness

**YAGNI (You Aren't Gonna Need It)**:
- Build only what's needed now
- Don't add features "just in case"
- Avoid premature abstraction

### Component Design
- **[Component Name]**
  - Purpose: [what it does - single, clear purpose]
  - Responsibilities: [what it owns - list specific responsibilities]
  - Interfaces: [how it connects - input/output contracts]
  - Dependencies: [what it depends on - use abstractions where possible]
  - State: [what state it manages, if any]

**Component Design Principles**:
- Each component should have a single, clear responsibility
- Components should be loosely coupled (minimal dependencies)
- Components should be highly cohesive (related functionality together)
- Interfaces should be minimal and focused
- Dependencies should flow in one direction (dependency inversion)

### Data Flow
[How data moves through the system]

**Data Flow Principles**:
- Data flows unidirectionally when possible
- State management is explicit and predictable
- Data transformations are clear and testable
- Avoid global mutable state
- Use immutable data structures when appropriate

### Error Handling
[Fail-hard approach - no silent failures]

**Error Handling Strategy**:
- Validate inputs at system boundaries
- Fail immediately with clear error messages
- No silent failures or fallback values
- Errors propagate to appropriate handlers
- Log errors with sufficient context for debugging
- User-facing errors should be user-friendly
- Internal errors should be logged with technical details

## Implementation Considerations

### Dependencies
- [Package]: [version] - [why needed]

### Testing Strategy

**Test-Driven Development (TDD)**:
- Write tests before implementation (Red-Green-Refactor)
- Test behavior, not implementation details
- Tests should be independent and isolated
- Use mocks/stubs for external dependencies

**Test Coverage**:
- Unit tests: Test individual components in isolation
- Integration tests: Test component interactions
- System tests: Test end-to-end workflows
- Edge cases: Boundary conditions, invalid inputs, error states
- Test coverage target: >90%

**What to Test**:
- Happy path: Expected behavior with valid inputs
- Error paths: Invalid inputs, missing data, error conditions
- Edge cases: Empty inputs, null values, boundary conditions
- Integration: Component interactions, data flow
- Regression: Previously fixed bugs

## Alternatives Considered

### [Alternative Name]
- Approach: [brief description]
- Pros: [benefits]
- Cons: [drawbacks]
- Why not chosen: [reasoning]

## Open Questions
- [ ] [Questions needing answers]

**Note**: After completing Phase 2, proceed to Phase 2.5 to resolve any open questions with the developer before moving to Phase 3 (Plan).

## Resolved Questions
*(Move questions here after Phase 2.5)*

- [Question]: [Answer/Decision from developer]
- [Question]: [Answer/Decision from developer]

## Decisions Needed
- [Decision]: [options and recommendation]
```

## Checklist
- [ ] Problem clearly defined
- [ ] Requirements comprehensive (functional and non-functional)
- [ ] Repository context investigated
- [ ] Solution aligns with existing patterns
- [ ] Architecture principles applied (SOLID, DRY, KISS, YAGNI)
- [ ] Separation of concerns addressed
- [ ] Components have single responsibility
- [ ] Dependencies are minimal and explicit
- [ ] Error handling strategy defined
- [ ] Fail-hard approach specified
- [ ] Testing strategy comprehensive
- [ ] Test coverage plan includes unit, integration, and edge cases
- [ ] Dependencies justified and version-checked
- [ ] Alternatives considered with trade-offs

## Output
Save as: `[your-docs-dir]/design/[date]_design_[feature_name].md`

## Next Step
1. If the design document contains "Open Questions", proceed to Phase 2.5 to resolve them with the developer
2. Once all questions are resolved (or if there are no open questions), proceed to Phase 3 using 3_BUILD_PLAN.md
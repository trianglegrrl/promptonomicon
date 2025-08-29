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

### Repository Analysis
- Architecture patterns: [what exists]
- Similar features: [examples]
- Integration points: [where this fits]

### Technical Stack
- [Languages, frameworks, tools in use]

## Proposed Solution

### High-Level Approach
[Overall strategy in 1-2 paragraphs]

### Component Design
- **[Component Name]**
  - Purpose: [what it does]
  - Responsibilities: [what it owns]
  - Interfaces: [how it connects]

### Data Flow
[How data moves through the system]

### Error Handling
[Fail-hard approach - no silent failures]

## Implementation Considerations

### Dependencies
- [Package]: [version] - [why needed]

### Testing Strategy
- Unit tests: [approach]
- Integration tests: [approach]
- Edge cases: [what to test]

## Alternatives Considered

### [Alternative Name]
- Approach: [brief description]
- Pros: [benefits]
- Cons: [drawbacks]
- Why not chosen: [reasoning]

## Open Questions
- [ ] [Questions needing answers]

## Decisions Needed
- [Decision]: [options and recommendation]
```

## Checklist
- [ ] Problem clearly defined
- [ ] Requirements comprehensive
- [ ] Repository context investigated
- [ ] Solution aligns with existing patterns
- [ ] Dependencies justified
- [ ] Alternatives considered
- [ ] Testing approach defined

## Output
Save as: `[your-docs-dir]/design/[date]_design_[feature_name].md`

## Next Step
Proceed to Phase 3 using 3_BUILD_PLAN.md
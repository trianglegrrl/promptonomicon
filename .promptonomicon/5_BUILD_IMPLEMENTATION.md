# Implementation Documentation Guide

Documents what was built for Phase 5 (Document) of the development process.

<!-- CUSTOMIZE THIS TEMPLATE:
- Define your documentation style
- Include metrics you care about
- Add sections for your specific needs
- Define your lessons learned format
-->

## Template

```markdown
# Implementation: [Feature Name]

## Overview

**Feature Name**: [Same as design/plan]
**Date**: [Use `date +%Y%m%d`]
**Design**: [Link to design doc]
**Plan**: [Link to plan doc]

### Summary
[What was actually built in 1 paragraph]

### Key Achievements
- [What works]
- [Performance/coverage metrics]
- [Integration points]

## What Was Built

### Architecture
[Simple diagram or description of structure]

### Components
**[Component Name]**: `src/path/to/component/`
- Purpose: [what it does]
- Key decisions: [why built this way]
- Interfaces: [how others use it]

### Data Flow
1. Input → [where]
2. Processing → [what]
3. Output → [how]

## Deviations from Plan

### [What Changed]
- **Planned**: [original approach]
- **Actual**: [what was built]
- **Why**: [reason for change]

## Testing

### Coverage
- Unit tests: X%
- Integration tests: Y tests
- Edge cases: [what's tested]

### Key Test Scenarios
```javascript
// Example of important test
test('fails on invalid input', () => {
  expect(() => feature(invalid))
    .toThrow('Specific error');
});
```

## Decisions & Trade-offs

### [Decision Name]
- **Options**: A vs B
- **Chose**: A
- **Because**: [reasoning]

## Lessons Learned

### What Went Well
- [Success points]

### What Was Challenging
- [Difficulties and solutions]

### For Next Time
- [Recommendations]

## Maintenance Notes

### Common Operations
- To add X: [steps]
- To modify Y: [approach]

### Monitoring
- Watch for: [metrics]
- Alert on: [conditions]
```

## Checklist
- [ ] Documents reality, not intentions
- [ ] Deviations explained
- [ ] Decisions documented
- [ ] Lessons captured
- [ ] Maintenance guidance included

## Output
Save as: `[your-docs-dir]/implementation/[date]_implementation_[feature_name].md`

## Next Step
Update all docs with 6_DOCUMENTATION_UPDATE.md
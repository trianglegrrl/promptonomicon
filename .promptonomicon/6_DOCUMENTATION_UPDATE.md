# Documentation Update Guide

Synchronizes all documentation for Phase 6 (Update) of the development process.

<!-- CUSTOMIZE THIS TEMPLATE:
- List YOUR documentation locations
- Include YOUR changelog format
- Define YOUR update checklist
- Add YOUR specific documentation types
-->

## Process

**First**: Consult the Documentation Index (`.promptonomicon/DOCUMENTATION_INDEX.md`) to identify all documentation that needs to be updated based on what was built.

### 1. Create Update Checklist

**Reference the Documentation Index**: Use `.promptonomicon/DOCUMENTATION_INDEX.md` to systematically identify all documentation that needs updates. For each document, check the "When to Update" section to determine if your changes require updates.

Based on what was built, identify what needs updating:

```markdown
## Update Checklist

### Core Docs
- [ ] README.md - Add feature to list
- [ ] CHANGELOG.md - Add version entry
- [ ] API docs - New endpoints

### Feature Docs
- [ ] Create `features/[name].md`
- [ ] Add examples
- [ ] Update tutorials

### Technical Docs
- [ ] Configuration guide
- [ ] Deployment notes
- [ ] Architecture diagrams
```

### 2. Find References

```bash
# Search for things to update
grep -r "similar-feature" --include="*.md" .
grep -r "related-component" --include="*.md" .

# Find code examples
grep -r "import.*package" --include="*.md" .
```

### 3. Common Updates

#### README.md
```markdown
## Features
- Existing feature
- **New Feature** - Brief description 🆕

## Quick Start
```javascript
// Add usage example
const result = newFeature(data);
```
```

#### CHANGELOG.md
```markdown
## [Unreleased]

### Added
- New feature that does X
- Configuration option for Y

### Changed
- Enhanced Z for better performance
```

#### API Documentation
```markdown
### POST /api/feature
Brief description

**Request:**
```json
{ "field": "value" }
```

**Response:**
```json
{ "result": "data" }
```

**Errors:**
- 400: Invalid input
- 422: Business rule violation
```

#### Configuration
```markdown
## New Feature Settings

| Option | Default | Description |
|--------|---------|-------------|
| enabled | true | Enable feature |
| timeout | 3000 | Timeout in ms |
```

### 4. Validate Updates

- [ ] All new features documented
- [ ] Examples run successfully
- [ ] Links work
- [ ] No contradictions
- [ ] Version numbers consistent

## Cross-Reference Updates

**Use Documentation Index**: Reference `.promptonomicon/DOCUMENTATION_INDEX.md` to ensure you don't miss any documentation that needs updates.

When adding features, systematically check each documentation type:
- Main feature list (README.md)
- Configuration sections (see Documentation Index for config docs)
- API references (see Documentation Index for API docs)
- Example code (check all docs that include examples)
- Troubleshooting guides (see Documentation Index)
- Architecture docs (if feature changes architecture)
- Testing docs (if feature adds new testing patterns)

**Documentation Index Reference**:
- Review `.promptonomicon/DOCUMENTATION_INDEX.md` for complete list
- Check "When to Update" for each documentation type
- Verify all relevant documentation is synchronized

## Checklist
- [ ] Consulted Documentation Index (`.promptonomicon/DOCUMENTATION_INDEX.md`)
- [ ] Created update checklist based on Documentation Index
- [ ] Found all references using Documentation Index
- [ ] Updated all locations identified in Documentation Index
- [ ] Validated changes
- [ ] No broken links
- [ ] Examples tested
- [ ] Documentation Index itself updated (if new docs added)

## Completion
- [ ] All docs synchronized
- [ ] Update `.scratch/todo.md` - check off phase 6
- [ ] Feature is DONE! 🎉
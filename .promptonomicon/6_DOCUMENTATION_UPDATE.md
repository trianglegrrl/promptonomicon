# Documentation Update Guide

Synchronizes all documentation for Phase 6 (Update) of the development process.

<!-- CUSTOMIZE THIS TEMPLATE:
- List YOUR documentation locations
- Include YOUR changelog format
- Define YOUR update checklist
- Add YOUR specific documentation types
-->

## Process

### 1. Create Update Checklist

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

When adding features, update:
- Main feature list
- Configuration sections
- API references
- Example code
- Troubleshooting guides

## Checklist
- [ ] Created update checklist
- [ ] Found all references
- [ ] Updated all locations
- [ ] Validated changes
- [ ] No broken links
- [ ] Examples tested

## Completion
- [ ] All docs synchronized
- [ ] Update `.scratch/todo.md` - check off phase 6
- [ ] Feature is DONE! 🎉
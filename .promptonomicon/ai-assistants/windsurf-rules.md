# Promptonomicon Framework - Windsurf Configuration

## Development Process

This repository uses Promptonomicon for structured AI-assisted development.

### Required Process

For all features, bug fixes, and significant changes:
1. Reference `.promptonomicon/PROMPTONOMICON.md`
2. Follow the six-phase process systematically
3. Generate required documentation in `ai-docs/`

### Process Phases

1. **Understand** → Investigate and document requirements
2. **Design** → Create design documentation
3. **Plan** → Build detailed implementation plan
4. **Develop** → Test-driven development
5. **Document** → Capture what was actually built
6. **Update** → Synchronize all documentation

### Available Tools

- **MCP Servers** (if configured):
  - versionator: Package version checking
  - context7: Library documentation fetching

### Project Structure

```
.promptonomicon/          # Process templates (customized)
ai-docs/                  # Generated documentation
  ai-design/             # Design documents
  ai-plans/              # Implementation plans
  ai-implementation/     # Reality documentation
  features/              # User-facing docs
.scratch/                # Temporary workspace
  todo.md               # Progress tracking
```

### Key Principles

- Documentation-driven development
- Fail-hard error handling
- Test coverage requirements
- Clean code (SOLID, DRY, KISS)

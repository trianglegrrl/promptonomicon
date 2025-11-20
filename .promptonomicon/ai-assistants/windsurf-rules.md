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
  - **versionator**: ALWAYS use for package version checking (before adding dependencies)
  - **context7**: Library documentation fetching (requires CONTEXT7_API_KEY)
  - **Supabase**: Database/API operations (requires SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN)
  - **GitHub**: Repository/API operations (requires GITHUB_PAT)
  - **mcp-server-time**: Time/date operations and scheduling
  - **promptonomicon**: To-do management and scratch notes (selected by default)
    - `todo_summary`: Generate formatted markdown summary (use when user asks "what's the status?" or "show me progress")
    - `todo_query_tasks`, `todo_query_notes`: Query tasks/notes programmatically (use for internal logic)
    - Other tools: `todo_create_task`, `todo_update_task`, `todo_delete_task`, `todo_create_note`, etc.
    - **When to use todo_summary**: User asks for status/progress, or when transitioning between phases
    - **When to use todo_query_***: For programmatic task/note access in code logic

### Project Structure

```
.promptonomicon/          # Process templates (customized)
ai-docs/                  # Generated documentation
  ai-design/             # Design documents
  ai-plans/              # Implementation plans
  ai-implementation/     # Reality documentation
  features/              # User-facing docs
.scratch/                # Temporary workspace
  todo.md               # Progress tracking (use Promptonomicon to-do MCP server if available)
```

### Key Principles

- Documentation-driven development
- Fail-hard error handling
- Test coverage requirements
- Clean code (SOLID, DRY, KISS)

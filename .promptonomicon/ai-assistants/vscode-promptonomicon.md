# Promptonomicon Configuration for VS Code AI Extensions

This project follows the Promptonomicon framework for AI-assisted development.

## Instructions for AI Assistants

When working on this codebase:

1. **Always check** `.promptonomicon/PROMPTONOMICON.md` for the development process
2. **Follow the six phases** for any feature or significant change
3. **Use MCP servers** if available:
   - **versionator**: ALWAYS use for checking package versions before adding dependencies
   - **context7**: Use for fetching current library documentation (requires CONTEXT7_API_KEY)
   - **Supabase**: Use for Supabase database/API operations (requires SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN)
   - **GitHub**: Use for GitHub repository/API operations (requires GITHUB_PAT)
   - **mcp-server-time**: Use for time/date operations and scheduling
   - **promptonomicon**: Use for to-do management and scratch notes (selected by default)
     - `todo_summary`: Generate formatted markdown summary (use when user asks "what's the status?" or "show me progress")
     - `todo_query_tasks`, `todo_query_notes`: Query tasks/notes programmatically (use for internal logic)
     - Other tools: `todo_create_task`, `todo_update_task`, `todo_delete_task`, `todo_create_note`, etc.
     - **When to use todo_summary**: User asks for status/progress, or when transitioning between phases
     - **When to use todo_query_***: For programmatic task/note access in code logic

## Quick Reference

- Process definition: `.promptonomicon/PROMPTONOMICON.md`
- Design templates: `.promptonomicon/1_BUILD_DESIGN.md`
- Planning templates: `.promptonomicon/3_BUILD_PLAN.md`
- Development standards: `.promptonomicon/4_DEVELOPMENT_PROCESS.md`
- Documentation outputs: `ai-docs/`
- Temporary workspace: `.scratch/` (use Promptonomicon to-do MCP server if available, otherwise use `.scratch/todo.md` for progress tracking)

## Project Standards

Refer to the customized templates in `.promptonomicon/` for:
- Architecture patterns
- Coding standards
- Testing requirements
- Documentation style

When in doubt, follow the Promptonomicon process.

# Promptonomicon Framework Instructions

This project uses the Promptonomicon framework for structured, documentation-driven development.

## Primary Directive

For ALL new features, bug fixes, or significant changes, you MUST follow the Promptonomicon process defined in `.promptonomicon/PROMPTONOMICON.md`.

## Six-Phase Process

1. **Understand** - Thoroughly investigate requirements and context
2. **Design** - Create comprehensive design documentation in `ai-docs/ai-design/`
3. **Plan** - Build detailed implementation plan in `ai-docs/ai-plans/`
4. **Develop** - Execute with test-driven development
5. **Document** - Capture what was actually built in `ai-docs/ai-implementation/`
6. **Update** - Synchronize all documentation

## Key Principles

- **Documentation-driven development**: Every feature begins and ends with documentation
- **Fail-hard policy**: No silent failures, exceptions propagate naturally
- **Test coverage requirements**: Tests must pass with high coverage at each step
- **Clean code practices**: Follow SOLID, DRY, KISS, YAGNI principles

## Available MCP Servers

When configured, use these MCP servers:

### versionator (ALWAYS use for dependencies)
- **When to use**: Before adding or updating ANY dependency
- **How to use**: `get_package_version("ecosystem", "package-name")`
- **Examples**: 
  - `get_package_version("npm", "react")` → Latest React version
  - `get_package_version("pypi", "django")` → Latest Django version
  - `get_package_version("rubygems", "rails")` → Latest Rails version
- **Critical**: Never guess package versions. Always use versionator when available.

### context7 (For library documentation)
- **When to use**: When you need current documentation for external libraries/frameworks
- **How to use**: `get-library-docs("/library/path")`
- **Requires**: CONTEXT7_API_KEY environment variable
- **Example**: `get-library-docs("/expressjs/express")` → Express.js docs

### Supabase (For database/backend work)
- **When to use**: Working with Supabase databases, authentication, storage, or real-time features
- **Requires**: SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN environment variables
- **Why**: Direct integration with Supabase services for database queries, auth operations

### GitHub (For repository operations)
- **When to use**: Working with GitHub repositories, issues, pull requests, or GitHub API operations
- **Requires**: GITHUB_PAT environment variable
- **Why**: Direct access to GitHub API for repository management, issue tracking, PR creation/review

### mcp-server-time (For time operations)
- **When to use**: Working with dates, times, timezones, scheduling, or time-based logic
- **Why**: Provides accurate time operations and timezone handling

## File Naming Convention

Always use datestamps for documentation files:
```bash
date +%Y%m%d
```

- Design: `ai-docs/ai-design/YYYYMMDD_design_feature_name.md`
- Plan: `ai-docs/ai-plans/YYYYMMDD_plan_feature_name.md`
- Implementation: `ai-docs/ai-implementation/YYYYMMDD_implementation_feature_name.md`
- Features: `ai-docs/features/feature-name.md`

## Working Directory

- Use `.scratch/` for temporary work and experiments
- For task management: Use the Promptonomicon to-do MCP server if available (via `promptonomicon mcp` or configured as an MCP server). Otherwise, track progress in `.scratch/todo.md` using the six-phase checklist
- All scratch work is gitignored

## Important Notes

- Always start by reading `.promptonomicon/PROMPTONOMICON.md`
- Follow the customized templates in `.promptonomicon/` for project-specific standards
- Use the todo_write tool to track progress through the six phases
- Commit all generated documentation in `ai-docs/`

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
- **versionator**: Check latest package versions with `get_package_version("ecosystem", "package")`
- **context7**: Fetch current library documentation (requires CONTEXT7_API_KEY)

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
- Track progress in `.scratch/todo.md` using the six-phase checklist
- All scratch work is gitignored

## Important Notes

- Always start by reading `.promptonomicon/PROMPTONOMICON.md`
- Follow the customized templates in `.promptonomicon/` for project-specific standards
- Use the todo_write tool to track progress through the six phases
- Commit all generated documentation in `ai-docs/`

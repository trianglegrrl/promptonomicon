# PROMPTONOMICON: Six-Phase Development Process

You must follow this six-phase process for all feature development. Each phase has a specific guide in the `.promptonomicon/` directory.

**IMPORTANT**: The templates in `.promptonomicon/` have been customized for this specific project. Follow them exactly.

## Core Principles

1. **Documentation-Driven**: Every feature begins and ends with documentation
2. **Fail-Hard Policy**: No silent failures, no fallback values, no suppressed errors
3. **Process Discipline**: Complete all six phases in order, no shortcuts
4. **Clean Code**: Follow SOLID, DRY, KISS, YAGNI principles

## The Process

### Phase 1: Understand
- Investigate the request and repository context thoroughly
- Identify requirements, constraints, existing patterns
- Ask clarifying questions if needed
- **Output**: Clear understanding captured in design document

### Phase 2: Design
- Create a design document using `.promptonomicon/1_BUILD_DESIGN.md`
- Define problem, requirements, solution approach, alternatives
- **Output**: `[your-docs-dir]/design/YYYYMMDD_design_[feature].md`
- Use `date +%Y%m%d` for datestamp

### Phase 3: Plan
- Create an implementation plan using `.promptonomicon/3_BUILD_PLAN.md`
- Break down into specific tasks, file paths, test cases
- **Output**: `[your-docs-dir]/plans/YYYYMMDD_plan_[feature].md`

### Phase 4: Develop
- Follow the coding process in `.promptonomicon/4_DEVELOPMENT_PROCESS.md`
- Write tests first (TDD), then implementation
- Follow fail-hard principles - no silent failures
- **Output**: Working, tested code with >90% coverage

### Phase 5: Document
- Document what was built using `.promptonomicon/5_BUILD_IMPLEMENTATION.md`
- Capture reality, decisions, deviations, lessons learned
- **Output**: `[your-docs-dir]/implementation/YYYYMMDD_implementation_[feature].md`

### Phase 6: Update
- Update all documentation using `.promptonomicon/6_DOCUMENTATION_UPDATE.md`
- Update README, API docs, examples, changelog
- **Output**: All documentation synchronized and consistent

## Tracking Progress

### The .scratch/ Directory

The `.scratch/` directory is your temporary workspace for the current feature:
- **Purpose**: Store temporary scripts, experiments, drafts, and work-in-progress files
- **Git ignored**: Nothing here gets committed (it's a safe space for messy work)
- **Key file**: `.scratch/todo.md` tracks your progress through the phases
- **Clean slate**: Clear it out between features

### Progress Tracking

Create or replace `.scratch/todo.md` to track your progress:

```markdown
# Feature: [Name]

- [ ] Phase 1: Understand
- [ ] Phase 2: Design
- [ ] Phase 3: Plan
- [ ] Phase 4: Develop
- [ ] Phase 5: Document
- [ ] Phase 6: Update

## Notes
[Working notes, discoveries, questions, etc.]
```

## Using Existing Documentation

**CRITICAL**: Before starting any new feature, you MUST review and leverage existing documentation.

### Phase 1: Review Existing Documentation
1. **Read `ai-docs/` thoroughly**:
   - `ai-docs/ai-design/` - Previous design decisions and patterns
   - `ai-docs/ai-plans/` - Implementation approaches that worked
   - `ai-docs/ai-implementation/` - What was actually built and lessons learned
   - `ai-docs/features/` - User-facing feature documentation

2. **Understand established patterns**:
   - How similar features were designed and implemented
   - Coding standards and architectural decisions
   - Testing approaches and coverage expectations
   - Documentation styles and conventions

3. **Use MCP servers for external documentation**:
   - **versionator**: Always check latest package versions before adding dependencies
   - **context7**: Get current documentation for external libraries and frameworks
   - Reference official docs for frameworks, libraries, and tools in use

4. **Leverage semantic search tools**:
   - Use semantic search to find relevant patterns in `ai-docs/`
   - Search for similar features, error handling approaches, or architectural decisions
   - Example: Search "authentication flow" to find how auth was previously implemented
   - Example: Search "database migration" to understand the established migration patterns

### Throughout Development
- **Maintain consistency** with existing patterns and decisions
- **Reference previous implementations** when solving similar problems
- **Build upon existing architecture** rather than introducing new patterns
- **Update related documentation** when your changes affect existing features

## Critical Rules

1. **Never skip phases** - Complete all six phases in order
2. **Create all documents** - Design, Plan, and Implementation docs are required
3. **Follow the templates** - Use the guides in `.promptonomicon/`
4. **Track your progress** - Update `.scratch/todo.md` as you work
5. **Review existing documentation** - Always start by understanding what's already been built

## Start Here

1. Read the feature request carefully
2. Begin Phase 1 (Understand)
3. Proceed through each phase sequentially
4. The feature is only complete when all six phases are checked off

Remember: The templates in `.promptonomicon/` contain this team's specific standards and practices. Follow them exactly.

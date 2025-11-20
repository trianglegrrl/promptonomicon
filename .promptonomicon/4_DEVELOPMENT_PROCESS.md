# Development (Coding) Guide

Executes the implementation for Phase 4 (Develop) of the development process.

<!-- CUSTOMIZE THIS ENTIRE FILE:
This is where you define YOUR development workflow, YOUR coding standards,
YOUR testing approach, and YOUR principles. The examples below are just
starting points - replace them with your actual practices.
-->

## Pre-Development Checklist
- [ ] Plan document complete and reviewed
- [ ] Dependencies installed
- [ ] Test framework ready
- [ ] Progress tracking shows phases 1-3 complete (use Promptonomicon to-do MCP server if available, otherwise `.scratch/todo.md`)
- [ ] Documentation Index reviewed (`.promptonomicon/DOCUMENTATION_INDEX.md`) - identified relevant docs to reference

**Reference Documentation**:
- Before starting development, review `.promptonomicon/DOCUMENTATION_INDEX.md` to identify:
  - Testing documentation (for test patterns and conventions)
  - API documentation (if using existing APIs)
  - Configuration documentation (for setup requirements)
  - Similar implementation docs (for patterns and lessons learned)

## Available Tools
<!-- MCP servers if configured:
- versionator: ALWAYS use for checking latest package versions before adding dependencies
- context7: Use for fetching current library documentation (requires CONTEXT7_API_KEY)
- Supabase: Use for Supabase database/API operations (requires SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN)
- GitHub: Use for GitHub repository/API operations (requires GITHUB_PAT)
- mcp-server-time: Use for time/date operations and scheduling
- promptonomicon: To-do manager MCP server with the following tools:
  - todo_summary: Generate formatted markdown summary of tasks and notes (use when user asks for status/progress)
  - todo_query_tasks: Query tasks programmatically (use for internal logic)
  - todo_query_notes: Query notes programmatically (use for internal logic)
  - todo_create_task, todo_update_task, todo_delete_task: Task management
  - todo_create_note, todo_update_note, todo_delete_note: Note management
  - When to use todo_summary: User asks "what's the status?", "show me progress", or when transitioning between phases
  - When to use todo_query_*: For programmatic task/note access in code logic
-->

## Development Workflow
### 1. Set Up Environment
<!-- Define your feature/bugfix workflow here, e.g. -->
```bash
# Create feature branch
git checkout -b feature/[name]

# Install dependencies (if any)
npm install  # or pip install, bundle install, etc.

# Verify tests run and we're starting with green tests
yarn test

# Or maybe it's python
source venv/bin/activate
```

#### Adding New Dependencies
<!-- When adding dependencies, ALWAYS use versionator MCP server if available -->
Before adding a new dependency:
1. **Check latest version** using versionator MCP: `get_package_version("npm", "package-name")`
2. Verify compatibility with existing dependencies
3. Update package.json/requirements.txt/etc. with version from versionator
4. Document why the dependency is needed in the plan/design document

**Critical**: Never guess package versions. Always use versionator MCP server when available.

### 2. Test-Driven Development (TDD) Cycle

Follow the **Red-Green-Refactor** cycle strictly:

#### RED: Write Failing Tests First
1. **Write the test** before any implementation code
2. **Make it specific**: Test one behavior at a time
3. **Test edge cases**: Invalid inputs, boundary conditions, error states
4. **Watch it fail**: Run tests to confirm they fail for the right reason
5. **Never skip**: Do not write implementation until tests are written

**Test Structure Principles**:
- One test = One behavior/outcome
- Clear test names that describe what is being tested
- Arrange-Act-Assert pattern (setup, execute, verify)
- Test both happy path and error cases
- Test edge cases and boundary conditions

#### GREEN: Implement Minimum Code to Pass
1. **Write minimal code** that makes the test pass
2. **No premature optimization**: Get it working first
3. **Avoid over-engineering**: Follow YAGNI (You Aren't Gonna Need It)
4. **Watch tests pass**: Confirm all tests pass
5. **Commit frequently**: Small, incremental commits

**Implementation Principles**:
- Make it work before making it beautiful
- If it passes tests but feels wrong, note it for refactoring
- Resist the urge to add features not yet tested

#### REFACTOR: Improve Code Quality
1. **Improve structure** without changing behavior
2. **All tests still pass**: Behavior remains unchanged
3. **Apply principles**: SOLID, DRY, separation of concerns
4. **Improve naming**: Code should be self-documenting
5. **Extract abstractions**: Remove duplication, improve clarity

**Refactoring Checklist**:
- [ ] Extract common functions/methods (DRY)
- [ ] Improve naming for clarity
- [ ] Apply SOLID principles
- [ ] Separate concerns (UI, business logic, data access)
- [ ] Remove dead code and unused variables
- [ ] Simplify complex logic
- [ ] Add comments only where logic is non-obvious
- [ ] Ensure single responsibility per function/class/module
- [ ] All tests still passing after refactoring

### 3. Implementation Standards

<!-- Be opinionated here! Tell Promptonomicon what you want your code to look like, how you do things, what your values and principles are.
 -->

#### Core Principles

**SOLID Principles** (Object-Oriented Design)
1. **Single Responsibility Principle (SRP)**: Each module/class/function should have one reason to change
   - One class = One responsibility
   - One function = One task
   - If you can't describe what it does in one sentence, split it
   
2. **Open/Closed Principle (OCP)**: Open for extension, closed for modification
   - Add new functionality by extending, not modifying existing code
   - Use abstractions (interfaces/protocols) to enable extension
   - Compose behavior rather than modifying classes
   
3. **Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types
   - Derived classes must not break expectations of base classes
   - Preconditions can't be strengthened, postconditions can't be weakened
   
4. **Interface Segregation Principle (ISP)**: Clients shouldn't depend on interfaces they don't use
   - Create small, focused interfaces
   - Avoid "god interfaces" that force implementation of unused methods
   
5. **Dependency Inversion Principle (DIP)**: Depend on abstractions, not concretions
   - High-level modules shouldn't depend on low-level modules
   - Both should depend on abstractions (interfaces/protocols)
   - Inject dependencies rather than creating them internally

**DRY (Don't Repeat Yourself)**
- Extract duplicate code into reusable functions/methods/modules
- Single source of truth for business logic
- If you write it twice, extract it
- Use configuration over duplication

**KISS (Keep It Simple, Stupid)**
- Prefer simple solutions over complex ones
- Readability over cleverness
- Explicit over implicit
- Clear code is better than clever code

**YAGNI (You Aren't Gonna Need It)**
- Don't add functionality until it's actually needed
- Don't solve problems you don't have yet
- Avoid premature abstraction
- Build only what's required now

**Separation of Concerns**
- Separate presentation from business logic from data access
- UI layer, business logic layer, data access layer (when applicable)
- Each layer has a distinct responsibility
- Changes in one layer shouldn't require changes in others

#### Fail-Hard Enforcement

**Always fail explicitly and immediately** - never hide errors:

✅ **CORRECT**: Fail immediately with clear error messages
```javascript
// Validate inputs first
if (!data) {
  throw new Error('Data is required');
}
if (typeof data !== 'object') {
  throw new TypeError(`Expected object, got ${typeof data}`);
}

// Validate business rules
if (data.value < 0) {
  throw new RangeError(`Value must be non-negative, got ${data.value}`);
}
```

❌ **WRONG**: Silent failures, fallbacks, or swallowed errors
```javascript
// Never do this!
try {
  return process(data);
} catch (e) {
  console.log(e);  // Hidden error
  return null;     // Silent failure
}

// Never do this!
const result = data ? process(data) : null;  // Silent fallback

// Never do this!
if (!data) return;  // Silent early return without indication
```

**Error Handling Rules**:
1. **Validate early**: Check inputs at function entry points
2. **Fail fast**: Throw immediately when invariants are violated
3. **Be specific**: Error messages should clearly state what went wrong and why
4. **Preserve context**: Include relevant information in error messages
5. **Don't suppress**: Never catch and ignore errors unless absolutely necessary
6. **Log appropriately**: Log errors at the appropriate level (application boundary)

#### File and Code Organization

**File Structure**:
- One concern per file/module
- Clear, descriptive file names
- Logical directory structure (group related files)
- Consistent naming conventions (snake_case, camelCase, PascalCase as appropriate for language)

**Function/Method Design**:
- Single responsibility per function
- Small functions (ideally < 20 lines, max ~50 lines)
- Pure functions when possible (no side effects, same input = same output)
- Descriptive function names that describe what they do
- Limit parameters (3-4 max; use objects/structs for more)

**Naming Conventions**:
- Names should reveal intent
- Avoid abbreviations unless universally understood
- Use verbs for functions/methods (getUser, calculateTotal)
- Use nouns for classes/modules/types (User, Calculator)
- Boolean variables/methods use "is", "has", "can", "should" (isValid, hasPermission)

**Code Comments**:
- Code should be self-documenting through good naming
- Add comments for "why", not "what"
- Explain complex business logic or non-obvious decisions
- Document public APIs thoroughly
- Keep comments up-to-date with code changes

#### Design Patterns (When Appropriate)

Use common design patterns when they solve actual problems:

- **Strategy Pattern**: When you need interchangeable algorithms
- **Factory Pattern**: When object creation logic is complex
- **Observer Pattern**: For event-driven systems
- **Adapter Pattern**: To integrate incompatible interfaces
- **Decorator Pattern**: To add behavior without modifying classes
- **Repository Pattern**: To abstract data access

**Pattern Guidelines**:
- Don't force patterns where they don't fit
- Patterns should emerge from solving problems, not be forced
- Prefer composition over inheritance
- Favor functional approaches when appropriate

### 4. Continuous Validation
```bash
# Run tests during development
npm test -- --watch

# Check coverage
npm test -- --coverage

# Lint code
npm run lint
```

## Common Patterns and Best Practices

### Input Validation Pattern

**Always validate inputs at function boundaries**:

1. **Check for null/undefined/empty** first
2. **Check types** to catch type errors early
3. **Validate business rules** (ranges, formats, constraints)
4. **Fail with descriptive errors** immediately

**Validation Principles**:
- Validate at the edge (entry points: API endpoints, public functions)
- Don't trust external input
- Validate once, use validated data internally
- Fail early with clear error messages

### Error Handling Pattern

**Error messages should be specific and actionable**:

✅ **Good error messages**:
- State what went wrong clearly
- Include relevant context (actual vs expected values)
- Suggest how to fix if possible
- Include relevant identifiers (user ID, file path, etc.)

❌ **Bad error messages**:
- Generic: "Error occurred"
- Missing context: "Invalid input"
- Too technical without explanation
- Blaming user instead of helping

### Testing Best Practices

**Test Coverage**:
- Aim for >90% code coverage
- Test happy paths (expected behavior)
- Test error paths (invalid inputs, edge cases)
- Test boundary conditions (empty, null, zero, max values)
- Test integration between components

**Test Organization**:
- Group related tests (by feature, by module)
- Use descriptive test names (describe what is being tested)
- One assertion per test when possible (focus on one behavior)
- Test isolation (tests shouldn't depend on each other)
- Clean up after tests (teardown, reset state)

**Test Types**:
- **Unit tests**: Test individual functions/modules in isolation
- **Integration tests**: Test interaction between components
- **System tests**: Test end-to-end workflows
- **Regression tests**: Test previously fixed bugs

### Code Review Checklist

Before considering code complete:
- [ ] All tests passing (unit, integration)
- [ ] Test coverage meets requirements (>90%)
- [ ] No linting errors or warnings
- [ ] Code follows SOLID principles
- [ ] No code duplication (DRY)
- [ ] Functions are small and focused
- [ ] Naming is clear and descriptive
- [ ] Error handling is explicit (fail-hard)
- [ ] No commented-out code or dead code
- [ ] Code is self-documenting (minimal comments needed)
- [ ] Dependencies are properly managed
- [ ] Performance considerations addressed (if applicable)
- [ ] Security considerations addressed (input validation, etc.)

## MCP Server Usage During Development

### versionator (Required for dependencies)
- **Always use** when adding or updating dependencies
- **Call before**: Adding any package to package.json, requirements.txt, Gemfile, etc.
- **Example**: `get_package_version("npm", "express")` → Returns latest version
- **Then**: Use that exact version in your dependency file
- **Why**: Versionator-first dependency versioning is a core principle

### context7 (For documentation)
- **Use when**: You need current documentation for libraries you're using
- **Call when**: Learning a new API, checking function signatures, reviewing best practices
- **Example**: `get-library-docs("/expressjs/express")` → Get Express.js docs
- **Why**: Gets current, accurate documentation without leaving your development environment

### Supabase (For database/backend)
- **Use when**: Querying databases, managing authentication, using storage, setting up real-time
- **Call when**: You need to interact with Supabase services
- **Why**: Direct database access and Supabase API operations

### GitHub (For repository management)
- **Use when**: Creating issues, managing PRs, checking repository status, accessing GitHub API
- **Call when**: You need GitHub repository or API functionality
- **Why**: Integrated GitHub operations without switching contexts

### mcp-server-time (For time operations)
- **Use when**: Working with dates, times, timezones, scheduling, or time-based calculations
- **Call when**: You need accurate time operations or timezone handling
- **Why**: Reliable time operations and conversions

### promptonomicon (For to-do management)
- **Use when**: Managing tasks, tracking progress, or storing scratch notes during development
- **Call when**: You need to create, update, query, or delete tasks or notes
- **Tools available**: 
  - `todo_summary`: Generate formatted markdown summary (use when user asks for status/progress or when transitioning between phases)
  - `todo_query_tasks`, `todo_query_notes`: Query tasks/notes programmatically (use for internal logic)
  - `todo_create_task`, `todo_get_task`, `todo_update_task`, `todo_delete_task`: Task management
  - `todo_create_note`, `todo_get_note`, `todo_update_note`, `todo_delete_note`: Note management
- **Why**: Structured task management integrated with Promptonomicon workflow, replaces scratch directory
- **Status Reporting**: When user asks "what's the status?" or "show me progress", use `todo_summary` tool to generate a formatted markdown summary. Use `todo_query_*` tools for programmatic access in code logic.

## Architecture Principles

### Layered Architecture (When Applicable)

**Presentation Layer**:
- UI components, views, controllers
- Handles user input/output
- Validates presentation-level concerns
- Delegates business logic to service layer

**Business Logic Layer**:
- Core application logic
- Domain models and rules
- Orchestrates workflow
- Validates business rules
- Independent of presentation and data access

**Data Access Layer**:
- Database queries, API calls
- Data persistence and retrieval
- Abstracts storage implementation
- Returns data structures, not business objects

**Benefits**:
- Changes in one layer don't affect others
- Easier to test (mock dependencies)
- Clear separation of responsibilities
- Reusable business logic

### Dependency Management

**Dependency Rules**:
- Dependencies flow inward (presentation → business → data)
- Inner layers don't know about outer layers
- Use dependency injection for testability
- Avoid circular dependencies

**Dependency Injection**:
- Pass dependencies as parameters (constructor/setter injection)
- Don't create dependencies inside classes (use factories/frameworks)
- Makes code testable (can inject mocks)
- Makes dependencies explicit

### Code Quality Metrics

**Maintainability**:
- Cyclomatic complexity: Keep functions simple (< 10 complexity)
- Code duplication: < 5% duplicated code
- Test coverage: > 90%
- Documentation: Public APIs fully documented

**Performance**:
- Profile before optimizing
- Measure, don't guess
- Optimize hot paths (bottlenecks)
- Consider big-O complexity
- Cache expensive operations when appropriate

**Security**:
- Validate all external input
- Sanitize data before storing/displaying
- Use parameterized queries (prevent SQL injection)
- Don't log sensitive information
- Follow principle of least privilege
- Keep dependencies updated

## Completion Checklist
- [ ] All plan steps executed
- [ ] All tests passing (unit and integration)
- [ ] Test coverage >90%
- [ ] No linting errors or warnings
- [ ] Code follows SOLID principles
- [ ] Code follows DRY (no duplication)
- [ ] Code follows KISS (simple and clear)
- [ ] Code follows YAGNI (no unnecessary features)
- [ ] Separation of concerns maintained
- [ ] Fail-hard error handling throughout
- [ ] Input validation at function boundaries
- [ ] Code follows repository patterns
- [ ] All dependencies checked with versionator MCP (if available)
- [ ] Code review checklist completed
- [ ] Update progress tracking - check off phase 4 (use Promptonomicon to-do MCP server if available, otherwise `.scratch/todo.md`)

## Next Step
Document what you built with 5_BUILD_IMPLEMENTATION.md
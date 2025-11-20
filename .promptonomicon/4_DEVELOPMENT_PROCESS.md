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
- [ ] `.scratch/todo.md` shows phases 1-3 complete

## Available Tools
<!-- MCP servers if configured:
- versionator: ALWAYS use for checking latest package versions before adding dependencies
- context7: Use for fetching current library documentation (requires CONTEXT7_API_KEY)
- Supabase: Use for Supabase database/API operations (requires SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN)
- GitHub: Use for GitHub repository/API operations (requires GITHUB_PAT)
- mcp-server-time: Use for time/date operations and scheduling
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

### 2. Test-Driven Development Cycle
<!-- Define your tdd or other development workflow here, e.g. -->

#### RED: Write Failing Tests First
```javascript
// Example test structure
describe('Feature', () => {
  it('handles valid input', () => {
    const result = feature(validInput);
    expect(result).toBe(expectedOutput);
  });

  it('fails hard on invalid input', () => {
    expect(() => feature(invalidInput))
      .toThrow('Specific error message');
  });
});
```

#### GREEN: Implement Minimum Code
```javascript
function feature(input) {
  // Validate inputs - fail hard
  if (!isValid(input)) {
    throw new Error(`Invalid input: ${input}`);
  }

  // Implement core logic
  return process(input);
}
```

#### REFACTOR: Improve Code Quality
- Extract common functions
- Improve naming
- Add comments for complex logic
- Ensure SOLID principles

### 3. Implementation Standards

<!-- Be opinionated here! Tell Promptonomicon what you want your code to look like, how you do things, what your values and principles are.
 -->

#### Fail-Hard Enforcement
```javascript
// ✅ CORRECT: Fail immediately
if (!data) {
  throw new Error('Data is required');
}

// ❌ WRONG: Silent failures
try {
  return process(data);
} catch (e) {
  console.log(e);
  return null;  // Never do this!
}
```

#### File Organization
- One concern per file
- Clear naming
- Logical structure
- Explicit imports/exports

### 4. Continuous Validation
```bash
# Run tests during development
npm test -- --watch

# Check coverage
npm test -- --coverage

# Lint code
npm run lint
```

## Common Patterns

### Input Validation
```javascript
function validateInput(input) {
  if (!input || typeof input !== 'object') {
    throw new TypeError('Input must be an object');
  }
  if (!input.requiredField) {
    throw new Error('Missing required field: requiredField');
  }
}
```

### Error Messages
Be specific about what went wrong:
```javascript
throw new Error(`Expected string, got ${typeof input}`);
throw new Error(`Value ${value} exceeds maximum ${max}`);
```

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

## Completion Checklist
- [ ] All plan steps executed
- [ ] All tests passing
- [ ] Coverage >90%
- [ ] No linting errors
- [ ] Code follows repository patterns
- [ ] All dependencies checked with versionator MCP (if available)
- [ ] Update `.scratch/todo.md` - check off phase 4

## Next Step
Document what you built with 5_BUILD_IMPLEMENTATION.md
# Customizing Promptonomicon for Your Repository

This guide provides step-by-step instructions for AI agents to customize Promptonomicon templates to match your repository's specific requirements, architecture patterns, and development practices.

**Usage**: When you want to customize Promptonomicon for a repository, tell your AI assistant:
```
"Follow the process in .promptonomicon/INTEGRATION.md to customize PROMPTONOMICON for this project."
```

The AI agent will follow this systematic process to ensure comprehensive, expert-level customization.

## Overview

This customization process ensures that Promptonomicon templates:
- Reflect your actual repository structure and patterns
- Include language/framework-specific best practices
- Capture your team's coding standards and conventions
- Document when and how to reference existing documentation
- Produce beautiful, repeatable code without unnecessary processes

### Quick Start (Alternative Approach)

If you prefer to guide the customization process yourself using prompts, you can use this simpler approach:

**Step 1: Initial Customization**

Use this prompt with your AI assistant to populate the templates:

````markdown
@Web I have the .promptonomicon/ directory, which contains a bunch of templates.

I also have this guidance:

```
[INSERT YOUR DEVELOPMENT STANDARDS HERE]

Examples of what to include:
- Code style preferences (e.g., "Use TypeScript strict mode")
- Testing requirements (e.g., "All tests must pass before merging")
- Architecture patterns (e.g., "Use SOLID principles, prefer composition")
- Git workflow (e.g., "Use conventional commits, squash merge PRs")
- Documentation standards (e.g., "All public APIs need JSDoc comments")
- Build/deployment process (e.g., "Run `yarn build:check` before pushing")
- Error handling approach (e.g., "Fail hard, no silent failures")
```

I want you to carefully examine my current documentation locations:
- .cursor/rules/
- CLAUDE.md
- docs/development/
- README.md
- CONTRIBUTING.md
- [ADD YOUR SPECIFIC LOCATIONS HERE]

Use what you learn to customize the Promptonomicon templates with the details of this repo. Make sure you capture everything important.

1. Read the templates in .promptonomicon/ and create a list of places that need to be updated
2. Carefully review the documentation in the directories I mentioned to extract all important details on developer practices
3. File by file, update the template .promptonomicon files with the specific details from this repository
4. After you've updated a file, double-check to see if you've made all the changes. Carefully review for accuracy, make any final adjustments, and then move on to the next file
5. Focus on documentation that will make both AI agents and developers more effective

Take your time and create an excellent, accurate set of Promptonomicon templates for this repository.
````

**Step 2: Review and Refine**

After Step 1, use this prompt to review and fix any issues:

````markdown
Now I need you to double-check all of the files in .promptonomicon/, one by one, and verify that they are correct. Make any small changes you need to make.

In addition, I noticed the following issues in my review:

[INSERT YOUR SPECIFIC ISSUES HERE]

Examples:
- "You said to run `yarn typecheck` and `yarn lint` but `yarn typecheck` already runs `yarn lint` in this repo, so that's a duplicate. You should mention running `tsc` and `eslint` separately"
- "We prefer to do our builds manually, so add a section that says 'Run builds manually using `yarn build` rather than relying on CI for build validation'"
- "You missed our preference for functional components over class components in React"
- "The error handling section should mention our custom error boundary pattern"

Please fix these issues, making the minimum necessary changes. The output should be a carefully reviewed, accurate set of .promptonomicon/ files.
````

**Note**: For comprehensive, systematic customization following all best practices, use the full process below. The quick start approach is useful for iterative refinement or quick initial setup.

## Phase 1: Repository Investigation

### 1.1 Examine Repository Structure

**Investigate**:
- Directory structure and organization patterns
- File naming conventions (camelCase, snake_case, kebab-case)
- Module/package structure (how code is organized)
- Configuration files (package.json, requirements.txt, Gemfile, etc.)
- Build and deployment configuration
- Test structure and organization

**Look for**:
- Consistent patterns in file organization
- Separation of concerns (UI, business logic, data access)
- How features/modules are structured
- Where configuration lives
- How tests are organized relative to source code

**Document findings** in `.scratch/customization-notes.md`:
```markdown
## Repository Structure Findings
- Source code location: `src/` or `lib/` or root?
- Test location: `__tests__/`, `tests/`, or co-located?
- Configuration: `config/`, root, or environment-based?
- File naming: [camelCase/snake_case/etc]
```

### 1.2 Review Existing Documentation

**Examine all documentation** to understand current practices:

**Primary Sources**:
- `README.md` - Project overview, setup, usage
- `CONTRIBUTING.md` - Development guidelines
- `CHANGELOG.md` - Historical changes and patterns
- Architecture documentation (if exists)
- API documentation (if exists)
- Developer guides or wikis

**Secondary Sources**:
- Code comments and docstrings
- Inline documentation
- Example files or demo code
- Configuration comments
- Commit messages (patterns and conventions)

**Extract**:
- Coding standards mentioned
- Testing approach described
- Git workflow documented
- Deployment process explained
- Code review requirements
- Documentation expectations

### 1.3 Analyze Existing Code Patterns

**Codebase Analysis**:

**Architecture Patterns**:
- What architectural patterns are used? (MVC, MVP, Clean Architecture, etc.)
- How are layers separated?
- How are dependencies managed? (dependency injection, service locator, etc.)
- How is configuration handled?
- How is error handling implemented?

**Coding Patterns**:
- Function/class size and structure
- Naming conventions (variables, functions, classes)
- Code organization (how logic is grouped)
- Error handling approaches
- Input validation patterns
- Logging practices

**Use semantic search** to find:
- Similar features implemented
- Common patterns across codebase
- Established conventions
- Architectural decisions documented in code

**Use grep/search** to find:
- Test patterns (`describe`, `test`, `it` patterns)
- Import/require patterns
- Configuration patterns
- Error handling patterns

### 1.4 Identify Key Technologies and Frameworks

**Document**:
- Programming language(s) and versions
- Framework(s) used (React, Django, Rails, etc.)
- Testing frameworks (Jest, pytest, RSpec, etc.)
- Build tools (webpack, vite, gradle, etc.)
- Package managers (npm, pip, bundler, cargo, etc.)
- Linting/formatting tools (ESLint, Prettier, Black, RuboCop, etc.)
- CI/CD tools (GitHub Actions, GitLab CI, Jenkins, etc.)

**Note special considerations**:
- Container usage (Docker, Kubernetes)
- Development environment setup
- Database usage and migrations
- API patterns (REST, GraphQL, gRPC)
- Authentication/authorization approach

## Phase 2: Best Practices Research

### 2.1 Research Language/Framework Best Practices

**Use web search** to find current best practices for:

**Language-Specific**:
- Official style guides (PEP 8, Google Java Style, etc.)
- Official conventions and idioms
- Common patterns and anti-patterns
- Performance best practices
- Security best practices

**Framework-Specific**:
- Official framework conventions
- Recommended project structure
- Testing best practices for the framework
- Performance optimization guidelines
- Security best practices

**Current Standards**:
- Latest version conventions (things change over time)
- Community consensus on best practices
- Industry standards for the stack
- Accessibility requirements (if applicable)

**Document findings** with sources and rationale:
```markdown
## Best Practices for [Language/Framework]
- Source: [Official documentation URL]
- Key convention: [Description]
- Rationale: [Why this matters]
```

### 2.2 Understand Development Workflow

**Determine**:
- How developers run the project locally
- Testing workflow (when/how tests run)
- Code review process
- Git workflow (branching strategy, commit conventions)
- Deployment process
- How code is packaged/distributed

**Container Considerations**:
- Is development done in containers? (Docker, etc.)
- Are commands run inside or outside containers?
- How are dependencies managed?
- How are environment variables handled?

**Document command patterns**:
```markdown
## Development Commands
- Install dependencies: [command]
- Run development server: [command]
- Run tests: [command]
- Run linter: [command]
- Build: [command]
- Where commands run: [inside/outside containers]
```

### 2.3 Research Testing Best Practices

**Investigate**:
- Testing framework best practices
- TDD/BDD approaches for the stack
- Test organization patterns
- Mocking/stubbing patterns
- Coverage expectations
- Integration testing approaches

**Document**:
- Testing framework configuration
- Test file naming conventions
- Test organization structure
- Coverage requirements
- Testing utilities and helpers used

## Phase 3: Template Review

### 3.1 Understand Template Structure

**Read each template** in `.promptonomicon/`:
- `1_BUILD_DESIGN.md` - Design phase template
- `3_BUILD_PLAN.md` - Planning phase template
- `4_DEVELOPMENT_PROCESS.md` - Development phase template
- `5_BUILD_IMPLEMENTATION.md` - Implementation documentation template
- `6_DOCUMENTATION_UPDATE.md` - Documentation update template
- `PROMPTONOMICON.md` - Main process entrypoint

**Understand**:
- What each template covers
- Where customization comments (`<!-- CUSTOMIZE -->`) are located
- What principles are already included (SOLID, DRY, KISS, YAGNI, etc.)
- How templates reference each other
- What's language-agnostic vs. what needs customization

### 3.2 Identify Customization Points

**Create customization checklist**:

For each template, identify:
- Sections that need repository-specific examples
- Command examples that need updating
- Patterns that need to match repository conventions
- Areas that need framework-specific guidance
- Documentation references that need updating

**Priority areas**:
1. **4_DEVELOPMENT_PROCESS.md**: Most critical - contains workflow, commands, patterns
2. **3_BUILD_PLAN.md**: File paths, directory structure, dependency management
3. **1_BUILD_DESIGN.md**: Architecture patterns, component structure
4. **6_DOCUMENTATION_UPDATE.md**: Documentation locations, update process
5. **5_BUILD_IMPLEMENTATION.md**: Documentation style and metrics

## Phase 4: Build Documentation Index

### 4.1 Create Documentation Index File

**Create** `.promptonomicon/DOCUMENTATION_INDEX.md`:

This file maps all documentation locations, their purpose, when to reference them, and when to update them.

**Template Structure**:

```markdown
# Documentation Index

This index maps all documentation locations in this repository, indicating:
- **Purpose**: What each document is for
- **When to Reference**: When developers/AI should read it
- **When to Update**: When the document should be modified

## Core Documentation

### README.md
- **Purpose**: Project overview, quick start, main entry point for new contributors
- **Location**: Repository root
- **When to Reference**:
  - Setting up development environment
  - Understanding project purpose and features
  - Finding quick start instructions
- **When to Update**:
  - New features added (Phase 6)
  - Setup instructions change
  - Major project changes

### CONTRIBUTING.md
- **Purpose**: [Document what this contains]
- **Location**: [Where it is]
- **When to Reference**:
  - [When to read this]
- **When to Update**:
  - [When to modify this]

[Continue for all documentation files...]

## Architecture Documentation

### docs/architecture/
- **Purpose**: [Description]
- **Location**: [Path]
- **When to Reference**:
  - [When developers/AI need this]
- **When to Update**:
  - [When this should be modified]

[Continue for architecture docs...]

## API Documentation

[Similar structure for API docs]

## Feature Documentation

[Similar structure for feature-specific docs]
```

### 4.2 Populate Documentation Index

**For each documentation file** found in Phase 1:

1. **Identify purpose**: What is this document for?
2. **Determine when to reference**:
   - During which phases of development?
   - When making what types of decisions?
   - When working on what areas?
3. **Determine when to update**:
   - After which phases?
   - When features change?
   - When patterns evolve?

**Be specific**: 
- Don't just say "when needed" - specify exact scenarios
- Include phase numbers (Phase 1: Understand, Phase 2: Design, etc.)
- Reference specific activities (adding features, fixing bugs, updating APIs)

**Example**:
```markdown
### docs/api/authentication.md
- **Purpose**: Authentication API endpoints and usage patterns
- **Location**: `docs/api/authentication.md`
- **When to Reference**:
  - Phase 1: When designing features that use authentication
  - Phase 2: When planning authentication-related changes
  - Phase 4: When implementing authentication functionality
- **When to Update**:
  - Phase 6: After adding new authentication endpoints
  - Phase 6: After changing authentication patterns
```

## Phase 5: Customize Templates

**Note**: You can also use the "Quick Start" prompts in the Overview section above for iterative customization or refinement.

### 5.1 Customize 4_DEVELOPMENT_PROCESS.md

**Priority sections to customize**:

1. **Set Up Environment**:
   - Replace example commands with actual repository commands
   - Document actual setup workflow
   - Include container commands if applicable
   - Specify where commands run (inside/outside containers)

2. **Test-Driven Development Cycle**:
   - Update test examples to match testing framework
   - Use actual test syntax (Jest, pytest, RSpec, etc.)
   - Match repository's test organization
   - Include actual test commands

3. **Implementation Standards**:
   - Add framework-specific patterns
   - Include actual coding conventions from repository
   - Add language-specific examples
   - Reference actual style guides used

4. **Continuous Validation**:
   - Replace with actual commands (npm test, pytest, etc.)
   - Include actual linting commands
   - Add actual coverage commands
   - Document actual workflow

**Add repository-specific sections**:
- Framework-specific patterns (React components, Django models, etc.)
- Database patterns (if applicable)
- API patterns (if applicable)
- Container usage (if applicable)

### 5.2 Customize 3_BUILD_PLAN.md

**Priority sections**:

1. **Repository Context**:
   - Document actual repository structure
   - List actual patterns to follow
   - Reference actual example files
   - Document actual file paths

2. **Dependencies**:
   - Document actual dependency management (npm, pip, etc.)
   - Include actual dependency file format
   - Document version checking process
   - Add repository-specific dependency patterns

3. **Implementation Steps**:
   - Update file structure examples to match repository
   - Use actual directory patterns
   - Include actual commands
   - Match repository's development workflow

4. **File Structure**:
   - Show actual repository structure
   - Use actual directory names
   - Match actual organization patterns

### 5.3 Customize 1_BUILD_DESIGN.md

**Priority sections**:

1. **Context Investigation**:
   - Document actual architecture patterns used
   - Reference actual similar features
   - Include actual integration points
   - Document actual technical stack

2. **Component Design**:
   - Match repository's component/module structure
   - Use actual naming conventions
   - Reference actual architectural patterns
   - Include framework-specific component types

3. **Testing Strategy**:
   - Match actual testing framework
   - Use actual test organization
   - Include actual testing patterns
   - Reference actual coverage requirements

### 5.4 Customize 6_DOCUMENTATION_UPDATE.md

**Priority sections**:

1. **Documentation Locations**:
   - List actual documentation locations from index
   - Reference actual documentation files
   - Include actual paths
   - Document actual update patterns

2. **Update Checklist**:
   - Match actual documentation structure
   - Include actual documentation types
   - Reference actual changelog format
   - Document actual update workflow

3. **Reference Documentation Index**:
   - Add section referencing `.promptonomicon/DOCUMENTATION_INDEX.md`
   - Explain when to consult it
   - Guide on using it during Phase 6

### 5.5 Update All Templates to Reference Documentation Index

**Add to each template** (1_BUILD_DESIGN.md, 3_BUILD_PLAN.md, 4_DEVELOPMENT_PROCESS.md, 6_DOCUMENTATION_UPDATE.md):

In the appropriate section (usually early in the document, near "Context Investigation" or "Repository Context"):

```markdown
## Documentation Reference

**Before starting, consult the Documentation Index**:
- **Location**: `.promptonomicon/DOCUMENTATION_INDEX.md`
- **When to Reference**: 
  - Phase 1: To understand available documentation
  - Phase 2: To find relevant architecture/API docs
  - Phase 3: To identify documentation that may need updates
  - Phase 6: To ensure all relevant docs are updated
- **Purpose**: Maps all documentation, when to read it, and when to update it
```

**Specific placements**:

- **1_BUILD_DESIGN.md**: In "Context Investigation" section
- **3_BUILD_PLAN.md**: In "Repository Context" section  
- **4_DEVELOPMENT_PROCESS.md**: In "Pre-Development Checklist" or early workflow section
- **6_DOCUMENTATION_UPDATE.md**: At the beginning, as primary reference

## Phase 6: Validation and Review

### 6.0 Tips for Success

**Before You Start**:
- Run `promptonomicon init` to get the base templates
- Gather all your existing documentation locations
- List your development standards, build processes, and coding preferences

**During Customization**:
- Work through one phase at a time - don't rush
- Test that your customized templates work with a small feature
- Have your AI assistant explain any changes it's unsure about
- Keep your original documentation until you're satisfied with the customization

**After Customization**:
- Run `promptonomicon doctor` to validate your setup
- Try implementing a small feature following your new templates
- Get team feedback on the customized process
- Iterate and refine based on real usage

### 6.1 Review Customizations

**For each customized template**:

1. **Completeness**: Are all customization points addressed?
2. **Accuracy**: Do examples match actual repository?
3. **Consistency**: Are patterns consistent across templates?
4. **Clarity**: Are instructions clear and actionable?
5. **Completeness**: Are all necessary details included?

**Checklist**:
- [ ] All commands are actual repository commands
- [ ] All file paths match actual structure
- [ ] All examples use actual syntax/patterns
- [ ] Documentation index is complete and accurate
- [ ] All templates reference documentation index appropriately
- [ ] Customizations follow expert-level standards

### 6.2 Expert Review Criteria

**An expert software architect should review and say**:
- ✅ "This is exactly right"
- ✅ "The right amount of care without unnecessary processes"
- ✅ "This will produce beautiful, repeatable code"
- ✅ "It captures what matters without being overly prescriptive"

**Quality indicators**:
- **Balanced**: Not too detailed, not too vague
- **Practical**: Reflects actual practices, not theoretical ideals
- **Actionable**: Clear instructions that can be followed
- **Maintainable**: Easy to update as patterns evolve
- **Comprehensive**: Covers all necessary aspects

### 6.3 Test Customization

**Verify**:
1. Templates make sense for the repository
2. Examples are relevant and accurate
3. Commands work as documented
4. Documentation index is helpful and accurate
5. Process flows naturally from template to template

**Test by**:
- Walking through a hypothetical feature implementation
- Checking that all necessary information is available
- Verifying that references are correct
- Confirming that the process is clear and logical

## Output Checklist

After completing customization, verify:

- [ ] **Documentation Index Created**: `.promptonomicon/DOCUMENTATION_INDEX.md` exists and is comprehensive
- [ ] **Templates Customized**: All templates updated with repository-specific information
- [ ] **Examples Updated**: All code examples use actual repository syntax/patterns
- [ ] **Commands Updated**: All commands are actual repository commands
- [ ] **Documentation References**: All templates reference documentation index appropriately
- [ ] **Architecture Captured**: Repository patterns and conventions documented
- [ ] **Best Practices Included**: Language/framework best practices researched and included
- [ ] **Workflow Documented**: Actual development workflow captured
- [ ] **Expert Review Ready**: Customizations meet expert-level standards

## Usage After Customization

Once customization is complete, developers and AI agents should:

1. **For new features**: Reference `.promptonomicon/PROMPTONOMICON.md`
2. **For documentation**: Consult `.promptonomicon/DOCUMENTATION_INDEX.md`
3. **For questions**: Check customized templates for guidance

**AI Agent Usage**:
```
"Follow the Promptonomicon process in .promptonomicon/PROMPTONOMICON.md to implement [feature]"
```

The AI will automatically:
- Reference the documentation index when needed
- Follow customized templates
- Use repository-specific patterns and commands
- Maintain consistency with existing codebase

## Phase 7: Documentation Migration (Optional)

If you have existing documentation you want to convert to Promptonomicon format, follow this process:

### 7.1 Identify Existing Documentation

**Document current locations**:
- User-facing feature documentation
- Technical design documents
- Architectural decision records
- Release history (CHANGELOG)
- API documentation
- Developer guides

### 7.2 Create Migration Plan

**Use this prompt** (or follow the process manually):

````markdown
I want to migrate my existing repository documentation to the Promptonomicon documentation hierarchy.

My current documentation is located in:
- docs/features/ (user-facing feature documentation)
- docs/architecture/ (technical design documents)
- docs/decisions/ (architectural decision records)
- CHANGELOG.md (release history)
- [ADD YOUR SPECIFIC LOCATIONS HERE]

The Promptonomicon structure uses:
- ai-docs/features/ (user-facing documentation)
- ai-docs/ai-design/ (design documents with YYYYMMDD_design_feature_name.md format)
- ai-docs/ai-implementation/ (what was actually built)
- ai-docs/ai-plans/ (implementation plans)

Please help me:

1. Review my existing documentation and categorize it according to the Promptonomicon structure
2. Create a migration plan that shows which files should move where
3. For each file, determine if it should be:
   - Moved directly (with filename updates for date format)
   - Split into multiple Promptonomicon documents (e.g., design + implementation)
   - Merged with other documents
   - Converted to a different format

4. Execute the migration, ensuring:
   - All important information is preserved
   - Cross-references between documents are updated
   - The new structure follows Promptonomicon naming conventions
   - A summary of changes is provided

Focus on preserving the historical record while organizing it according to Promptonomicon principles.
````

### 7.3 Execute Migration

**For each document**:
- Categorize according to Promptonomicon structure
- Update filenames to match naming conventions (YYYYMMDD format for design/plan/implementation docs)
- Update cross-references
- Preserve historical information
- Update documentation index after migration

### 7.4 What This Accomplishes

- Organizes existing documentation into Promptonomicon structure
- Preserves historical information while improving discoverability
- Updates cross-references and maintains document relationships
- Creates a cleaner, more standardized documentation hierarchy

## Maintenance

**When to re-run customization**:
- Major architectural changes
- Framework upgrades that change conventions
- Significant workflow changes
- Documentation structure changes
- New documentation added

**Quick updates**:
- Minor changes can be made directly to templates
- Documentation index should be updated when docs change
- Keep templates aligned with actual practices

## Getting Help

If you run into issues during customization:

1. **Check setup**: Run `promptonomicon doctor` to validate your configuration
2. **Review templates**: Check templates in `.promptonomicon/` for accuracy
3. **Test incrementally**: Try customizing one template at a time with a small test
4. **Use quick start**: Try the Quick Start prompts in the Overview section for iterative refinement
5. **Consult documentation**: Reference `.promptonomicon/PROMPTONOMICON.md` for process guidance

## Example Results

After completing customization, you'll have:

- **Customized Templates**: `.promptonomicon/` files tailored to your team's standards
- **AI Assistant Integration**: Automatic setup for Cursor, Claude, VS Code, and Windsurf
- **MCP Server Configuration**: Access to real-time package versions and documentation
- **Documentation Index**: Complete mapping of all documentation locations and when to use them
- **Organized Documentation**: Clean hierarchy in `ai-docs/` that follows your standards
- **Team Onboarding**: Clear process that any AI assistant can follow

Your customized repository will provide AI assistants with clear, consistent guidance that matches your team's actual development practices.

---

**Remember**: The goal is templates that guide developers and AI agents to produce code that looks like it was written by an expert who deeply understands the repository, its patterns, and its standards. The templates should be comprehensive enough to ensure quality, but flexible enough to avoid unnecessary friction.

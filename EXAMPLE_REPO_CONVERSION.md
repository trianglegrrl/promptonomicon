# Converting Your Repository to Promptonomicon

This guide shows you how to use AI coding assistants (Claude, Cursor, etc.) to convert your existing repository to use the Promptonomicon framework effectively.

## Overview

Converting to Promptonomicon involves three main steps:
1. **Populate Templates** - Customize Promptonomicon templates with your existing standards
2. **Review and Refine** - Double-check accuracy and fix any issues
3. **Migrate Documentation** (Optional) - Convert existing docs to Promptonomicon structure

## Step 1: Populate Your Templates

Use this prompt with your AI assistant to customize the Promptonomicon templates:

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
- Build/deployment process (e.g., "Run `npm run build:check` before pushing")
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

### What This Step Accomplishes

- Extracts your existing development standards from various documentation sources
- Populates `.promptonomicon/4_DEVELOPMENT_PROCESS.md` with your coding standards
- Updates `.promptonomicon/3_BUILD_PLAN.md` with your architecture patterns
- Customizes other templates with your specific requirements

## Step 2: Review and Refine

After Step 1, use this prompt to review and fix any issues:

````markdown
Now I need you to double-check all of the files in .promptonomicon/, one by one, and verify that they are correct. Make any small changes you need to make.

In addition, I noticed the following issues in my review:

[INSERT YOUR SPECIFIC ISSUES HERE]

Examples:
- "You said to run `yarn typecheck` and `yarn lint` but `yarn typecheck` already runs `yarn lint` in this repo, so that's a duplicate. You should mention running `tsc` and `eslint` separately"
- "We prefer to do our builds manually, so add a section that says 'Run builds manually using `npm run build` rather than relying on CI for build validation'"
- "You missed our preference for functional components over class components in React"
- "The error handling section should mention our custom error boundary pattern"

Please fix these issues, making the minimum necessary changes. The output should be a carefully reviewed, accurate set of .promptonomicon/ files.
````

### What This Step Accomplishes

- Catches inaccuracies from the initial population
- Fixes missing details specific to your workflow
- Ensures templates are internally consistent
- Validates that all important practices are captured

## Step 3: Migrate Existing Documentation (Optional)

If you have existing documentation you want to convert to Promptonomicon format, use this prompt:

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

### What This Step Accomplishes

- Organizes existing documentation into Promptonomicon structure
- Preserves historical information while improving discoverability
- Updates cross-references and maintains document relationships
- Creates a cleaner, more standardized documentation hierarchy

## Tips for Success

### Before You Start
- Run `promptonomicon init` to get the base templates
- Gather all your existing documentation locations
- List your development standards, build processes, and coding preferences

### During Conversion
- Work through one step at a time - don't rush
- Test that your customized templates work with a small feature
- Have your AI assistant explain any changes it's unsure about
- Keep your original documentation until you're satisfied with the conversion

### After Conversion
- Run `promptonomicon doctor` to validate your setup
- Try implementing a small feature following your new templates
- Get team feedback on the customized process
- Iterate and refine based on real usage

## Example Results

After following this process, you'll have:

- **Customized Templates**: `.promptonomicon/` files tailored to your team's standards
- **AI Assistant Integration**: Automatic setup for Cursor, Claude, VS Code, and Windsurf
- **MCP Server Configuration**: Access to real-time package versions and documentation
- **Organized Documentation**: Clean hierarchy in `ai-docs/` that follows your standards
- **Team Onboarding**: Clear process that any AI assistant can follow

## Getting Help

If you run into issues during conversion:

1. Check `promptonomicon doctor` for setup problems
2. Review the templates in `.promptonomicon/` for accuracy
3. Test with a small feature before converting large amounts of documentation
4. See [INTEGRATION.md](INTEGRATION.md) for detailed setup instructions

Your converted repository will provide AI assistants with clear, consistent guidance that matches your team's actual development practices.

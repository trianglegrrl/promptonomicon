<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="promptonomicon-logo-darkbg.png">
    <source media="(prefers-color-scheme: light)" srcset="promptonomicon-logo-lightbg.png">
    <img alt="Promptonomicon Logo" src="promptonomicon-logo-lightbg.png" width="600">
  </picture>
</p>

# Promptonomicon

Transform how you build software with AI through structured, documentation-driven development.

## What is Promptonomicon?

Promptonomicon is a framework that gives AI coding assistants a consistent, high-quality development process. It works with any AI tool (Cursor, Claude, Windsurf, etc.) by providing:

- **Six-phase process** that ensures thorough, well-documented development
- **Customizable templates** that encode your team's standards and practices
- **Single entrypoint** (`PROMPTONOMICON.md`) that any AI can follow

The result: AI assistants that follow your standards, document their work, and deliver production-ready code.

## The Process

Every feature follows these six phases:

1. **Understand** - Investigate requirements and context thoroughly
2. **Design** - Create comprehensive design documentation
3. **Plan** - Build detailed, actionable implementation plans
4. **Develop** - Execute with test-driven development
5. **Document** - Capture what was actually built
6. **Update** - Synchronize all reference documentation

## Repository Structure

```
your-repo/
├── .promptonomicon/             # Your customized process templates
│   ├── 1_BUILD_DESIGN.md       # Design doc template
│   ├── 3_BUILD_PLAN.md         # Implementation plan template
│   ├── 4_DEVELOPMENT_PROCESS.md # Your coding standards
│   ├── 5_BUILD_IMPLEMENTATION.md # Reality documentation
│   ├── 6_DOCUMENTATION_UPDATE.md # Update checklist
│   └── PROMPTONOMICON.md       # AI entrypoint - "start here"
├── ai-docs/                     # Generated documentation (commit these!)
│   ├── ai-design/              # Design documents
│   ├── ai-plans/               # Implementation plans
│   ├── ai-implementation/      # What was built
│   └── features/               # User-facing docs
└── .scratch/                    # Temporary work (gitignored)
    ├── README.md                # Usage guide (auto-created)
    └── todo.md                  # Current feature progress
```

## Quick Start

### Installation

#### NPM (Recommended)

```bash
# Install globally
npm install -g promptonomicon

# Or add to your project
npm install --save-dev promptonomicon

# If installed locally, use npx
npx promptonomicon init
```

#### Yarn

```bash
# Install globally
yarn global add promptonomicon

# Or add to your project
yarn add --dev promptonomicon

# If installed locally
yarn promptonomicon init
```

### Using Promptonomicon in Your Project

#### Quick Setup

```bash
# Initialize in your project directory
promptonomicon init

# Check your setup
promptonomicon doctor

# Reset templates to latest version (destructive)
promptonomicon reset --yes
```

#### Commands

- **`promptonomicon init`** - Initialize Promptonomicon in the current directory
  - Creates all required directories
  - Fetches latest templates from GitHub
  - Sets up `.scratch` directory for temporary work
  - Use `--force` to overwrite existing setup

- **`promptonomicon doctor`** - Check if your setup is healthy
  - Verifies all directories exist
  - Checks all template files are present
  - Compares with latest templates on GitHub

- **`promptonomicon reset`** - Reset templates to latest version
  - **⚠️ Warning**: This overwrites all customizations
  - Fetches fresh templates from GitHub
  - Use `--yes` to skip confirmation

#### Manual Setup (Alternative)

1. **Copy the framework** to your repository:
   - `.promptonomicon/` directory (including all templates and PROMPTONOMICON.md)

2. **Customize the templates** in `.promptonomicon/` with your:
   - Design principles and architecture patterns
   - Coding standards and testing approach
   - Documentation style and requirements

3. **Use with any AI assistant**:
   ```
   >  "Follow the Promptonomicon process in
      .promptonomicon/PROMPTONOMICON.md to
      implement [feature]"

   ```

See [INTEGRATION.md](INTEGRATION.md) for detailed setup instructions.

### This Repository

This repository serves as both the npm package source and a living example:

- **Framework files**: `.promptonomicon/` directory containing all templates
- **NPM package**: Published to [npmjs.com/package/promptonomicon](https://www.npmjs.com/package/promptonomicon)
- **Example output**: `ai-docs-sample/` shows what gets generated
- **Integration guide**: [INTEGRATION.md](INTEGRATION.md) for customization details

### Development

To contribute or modify Promptonomicon:

```bash
# Clone the repository
git clone https://github.com/trianglegrrl/promptonomicon.git
cd promptonomicon

# Install dependencies
npm install

# Test locally
npm link
promptonomicon doctor

# Run tests
npm test
```

### Publishing

The package is automatically published to npm when you create a new release on GitHub:

1. **Set up npm authentication**:
   - Generate an npm access token at [npmjs.com/settings](https://www.npmjs.com/settings)
   - Add it as `NPMJS_ACCESS_TOKEN` in your GitHub repository secrets
   - Go to Settings → Secrets and variables → Actions → New repository secret

2. **Create a release**:
   ```bash
   # Tag your release
   git tag -a v1.0.1 -m "Release version 1.0.1"
   git push origin v1.0.1

   # Then create a release on GitHub
   # The CI/CD pipeline will automatically publish to npm
   ```

## Key Principles

- **Documentation-Driven**: Every feature begins and ends with documentation
- **Fail-Hard Policy**: No silent failures, exceptions propagate naturally
- **Process Discipline**: Six phases, no shortcuts
- **Clean Code**: SOLID, DRY, KISS, YAGNI throughout

## File Naming Convention

All generated documents follow a consistent pattern:
- Design: `ai-docs/ai-design/YYYYMMDD_design_feature_name.md`
- Plan: `ai-docs/ai-plans/YYYYMMDD_plan_feature_name.md`
- Implementation: `ai-docs/ai-implementation/YYYYMMDD_implementation_feature_name.md`
- Features: `ai-docs/features/feature-name.md`

Use `date +%Y%m%d` to generate datestamps.

## The .scratch Directory

The `.scratch/` directory is your temporary workspace:
- **Purpose**: Temporary scripts, work-in-progress docs, experiments
- **Key file**: `.scratch/todo.md` tracks your progress through the 6 phases
- **Git ignored**: Nothing here gets committed (except the README)
- **Auto-created**: The install script sets this up with usage instructions

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built to standardize AI-assisted software development across teams and tools.
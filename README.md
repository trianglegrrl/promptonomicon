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

### Using Promptonomicon in Your Project

#### Quick Install

```bash
# Clone this repo and run the install script from your project root
git clone https://github.com/[your-username]/promptonomicon.git /tmp/promptonomicon
bash /tmp/promptonomicon/install-promptonomicon.sh

# Or for non-interactive installation (CI/CD friendly)
bash /tmp/promptonomicon/install-promptonomicon.sh -y
```

This creates all directories and copies the framework files.

#### Manual Setup

1. **Copy the framework** to your repository:
   - `.promptonomicon/` directory (including all templates and PROMPTONOMICON.md)

2. **Customize the templates** in `.promptonomicon/` with your:
   - Design principles and architecture patterns
   - Coding standards and testing approach
   - Documentation style and requirements

3. **Use with any AI assistant**:
   ```
   "Follow the Promptonomicon process in .promptonomicon/PROMPTONOMICON.md to implement [feature]"
   ```

See [INTEGRATION.md](INTEGRATION.md) for detailed setup instructions.

### This Repository

This repository serves as both the framework source and a living example:

- **Framework files**: `.promptonomicon/` directory (copy this entire directory)
- **Install script**: `install-promptonomicon.sh` for quick setup
- **Example output**: `ai-docs-sample/` shows what gets generated
- **Integration guide**: [INTEGRATION.md](INTEGRATION.md) for customization details

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
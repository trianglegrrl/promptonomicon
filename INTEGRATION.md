# Integrating Promptonomicon Into Your Repository

This guide explains how to add Promptonomicon to your existing project and customize it for your team's specific needs.

## Quick Start

### Installation via npm (Recommended)

```bash
# Install globally
npm install -g promptonomicon

# Or install as a dev dependency
npm install --save-dev promptonomicon
```

### Initialize in Your Project

```bash
# If installed globally
promptonomicon init

# If installed locally
npx promptonomicon init

# With MCP servers (interactive)
promptonomicon init --with-mcp-servers

# With specific MCP servers (non-interactive)
promptonomicon init --with-mcp-servers=context7,versionator
```

## What Gets Installed

```
your-repo/
├── .promptonomicon/           # Framework directory
│   ├── 1_BUILD_DESIGN.md     # Customize: your design approach
│   ├── 3_BUILD_PLAN.md       # Customize: your planning style
│   ├── 4_DEVELOPMENT_PROCESS.md # Customize: your coding standards
│   ├── 5_BUILD_IMPLEMENTATION.md # Customize: your doc preferences
│   ├── 6_DOCUMENTATION_UPDATE.md # Customize: your update process
│   └── PROMPTONOMICON.md    # Single entrypoint for AI tools
├── ai-docs/                   # Documentation output directories
│   ├── ai-design/
│   ├── ai-plans/
│   ├── ai-implementation/
│   └── features/
├── .scratch/                  # Temporary workspace
│   └── README.md            # Usage instructions
└── [your existing files...]
```

## Customization Guide

Each template in `.promptonomicon/` contains sections marked for customization:

### 1_BUILD_DESIGN.md
- Add your specific design requirements
- Include your architecture patterns
- Define your success criteria format

### 3_BUILD_PLAN.md
- Add your repository structure
- Include your dependency management approach
- Define your task breakdown style

### 4_DEVELOPMENT_PROCESS.md
- **Add your setup workflow** (npm/pip/bundler commands)
- **Define your testing approach** (TDD, BDD, etc.)
- **Include your coding standards** (style guides, linting rules)
- **Specify your principles** (fail-hard, error handling, etc.)

### 5_BUILD_IMPLEMENTATION.md
- Define your documentation style
- Include your metrics requirements
- Specify your decision documentation format

### 6_DOCUMENTATION_UPDATE.md
- List your standard documentation locations
- Include your changelog format
- Define your update checklist

## Working with AI Tools

### Automatic Integration

Promptonomicon can automatically integrate with your AI coding assistant:

#### Cursor
- Creates `.cursor/rules/promptonomicon.mdc` with instructions to use Promptonomicon (uses modern .mdc format)
- Adds MCP server configuration to `.cursor/mcp.json` if requested
- Merges with existing MCP configurations

#### Claude
- Creates `CLAUDE.md` in project root with Promptonomicon instructions
- Claude automatically reads this file when working in your project
- For MCP servers in Claude Desktop, see manual configuration guide

#### VS Code
- Creates `.vscode/promptonomicon.md` for AI extensions
- Creates `.vscode/mcp.json` if requested (merged with existing config)
- MCP server support depends on your AI extension

#### Windsurf
- Creates `.windsurf/rules.md` with Promptonomicon instructions
- Creates `.windsurf/mcp.json` if requested (merged with existing config)
- MCP server support depends on Windsurf's implementation

### Manual Integration

For any AI assistant, simply reference the entrypoint:

```
"Follow the Promptonomicon process defined in .promptonomicon/PROMPTONOMICON.md to implement this feature: [describe feature]"
```

The AI will:
1. Read PROMPTONOMICON.md
2. Follow the six-phase process
3. Use your customized templates
4. Track progress in `.scratch/todo.md`
5. Use MCP servers if configured (context7 for docs, versionator for versions)

### MCP Server Integration

Promptonomicon includes two Model Context Protocol (MCP) servers:

#### versionator-mcp
- Checks latest versions of packages across all ecosystems
- Works automatically without configuration
- Used in dependency management tasks

#### context7
- Fetches up-to-date documentation for libraries
- Requires `CONTEXT7_API_KEY` environment variable
- Enhances AI's knowledge of current library APIs

### Tool-Agnostic Design

Promptonomicon works with any AI coding assistant because:
- It uses standard Markdown files
- No special syntax or tool-specific features
- Clear, sequential process
- Self-contained documentation
- Optional MCP server enhancements

## Best Practices

1. **Customize Once, Use Many Times**
   - Spend time upfront customizing templates
   - They become your team's "way of doing things"
   - AI assistants will follow your standards

2. **Keep Templates Focused**
   - Don't over-document
   - Include only what's essential
   - Use examples and code snippets

3. **Evolve Your Templates**
   - Update based on what works
   - Remove what doesn't help
   - Keep them living documents

4. **Version Control**
   - Commit your `.promptonomicon/` directory
   - Track changes to your customizations
   - Share improvements with your team

## Example Customizations

### For a React Project
```markdown
<!-- In 4_DEVELOPMENT_PROCESS.md -->
### 1. Set Up Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm test -- --watch
```

### Component Structure
- Use functional components with hooks
- One component per file
- Co-locate styles and tests
```

### For a Python Project
```markdown
<!-- In 4_DEVELOPMENT_PROCESS.md -->
### 1. Set Up Environment
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest
```

### Code Standards
- Follow PEP 8
- Use type hints
- Docstrings for all public functions
```

## Available Commands

### promptonomicon init
Initialize Promptonomicon in your project:
- Creates all required directories
- Fetches latest templates from GitHub
- Optionally configures MCP servers
- Sets up AI assistant integration files

### promptonomicon doctor
Check your Promptonomicon setup:
- Verifies all files and directories exist
- Compares templates with latest versions
- Warns if templates haven't been customized
- Validates MCP server configuration

### promptonomicon reset
Reset templates to latest version:
- **⚠️ Warning**: Overwrites all customizations
- Use `--yes` to skip confirmation
- Use `--with-mcp-servers` to reconfigure MCP

## MCP Server Configuration

### Environment Variables

For context7 (documentation fetching):
```bash
# Add to your .env or shell profile
export CONTEXT7_API_KEY="your-api-key-here"
```

### Configuration Locations

MCP servers are configured in:
- **Cursor**: `.cursor/mcp.json`
- **Claude Desktop**: `~/.config/claude/claude_desktop_config.json`
- **VS Code**: Extension-specific settings
- **Generic**: `.mcp.json` in project root

## Troubleshooting

**Q: The AI isn't following my customizations**
A: Make sure to explicitly reference .promptonomicon/PROMPTONOMICON.md in your request

**Q: Can I use different file names?**
A: Yes, but update .promptonomicon/PROMPTONOMICON.md to point to your renamed files

**Q: How detailed should customizations be?**
A: Include enough to enforce your standards, but keep it scannable

**Q: MCP servers aren't working**
A: Run `promptonomicon doctor` to check configuration. Ensure required API keys are set.

**Q: How do I know if I should customize templates?**
A: Run `promptonomicon doctor` - it will warn if you're using unmodified templates

## Next Steps

1. Install with `npm install -g promptonomicon`
2. Run `promptonomicon init` in your repository
3. Customize each template with your standards
4. Configure MCP servers if desired
5. Test with your preferred AI tool
6. Iterate based on results

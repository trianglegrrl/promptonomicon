# Integrating Promptonomicon Into Your Repository

This guide explains how to add Promptonomicon to your existing project and customize it for your team's specific needs.

## Quick Start

### Option 1: Automated Install

```bash
# Clone and run the install script
git clone https://github.com/[your-username]/promptonomicon.git /tmp/promptonomicon
bash /tmp/promptonomicon/install-promptonomicon.sh

# Or for non-interactive installation
bash /tmp/promptonomicon/install-promptonomicon.sh -y
```

### Option 2: Manual Install

1. Copy the `.promptonomicon/` directory to your repository root
2. Ensure `PROMPTONOMICON.md` is inside `.promptonomicon/`
3. Create `ai-docs/` subdirectories and `.scratch/` directory
4. Customize the templates in `.promptonomicon/` with your opinions

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

### For Any AI Assistant (Claude, Cursor, Windsurf, etc.)

Simply reference the entrypoint:

```
"Follow the Promptonomicon process defined in .promptonomicon/PROMPTONOMICON.md to implement this feature: [describe feature]"
```

The AI will:
1. Read PROMPTONOMICON.md
2. Follow the six-phase process
3. Use your customized templates
4. Track progress in `.scratch/todo.md`

### Tool-Agnostic Design

Promptonomicon works with any AI coding assistant because:
- It uses standard Markdown files
- No special syntax or tool-specific features
- Clear, sequential process
- Self-contained documentation

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

## Troubleshooting

**Q: The AI isn't following my customizations**
A: Make sure to explicitly reference .promptonomicon/PROMPTONOMICON.md in your request

**Q: Can I use different file names?**
A: Yes, but update .promptonomicon/PROMPTONOMICON.md to point to your renamed files

**Q: How detailed should customizations be?**
A: Include enough to enforce your standards, but keep it scannable

## Next Steps

1. Copy the files to your repository
2. Customize each template with your opinions
3. Test with your preferred AI tool
4. Iterate based on results

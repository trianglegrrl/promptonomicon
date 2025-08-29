#!/bin/bash
# Install Promptonomicon framework into your repository

set -e  # Exit on error

# Parse command line arguments
AUTO_APPROVE=false
while [[ $# -gt 0 ]]; do
  case $1 in
    -y|--yes)
      AUTO_APPROVE=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [-y|--yes]"
      echo "  -y, --yes    Auto-approve all prompts (non-interactive mode)"
      echo "  -h, --help   Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use -h for help"
      exit 1
      ;;
  esac
done

# Function to prompt user
confirm() {
  local prompt="$1"
  if [ "$AUTO_APPROVE" = true ]; then
    echo "✓ $prompt (auto-approved)"
    return 0
  fi

  while true; do
    read -p "❓ $prompt [y/n]: " yn
    case $yn in
      [Yy]* ) return 0;;
      [Nn]* ) return 1;;
      * ) echo "Please answer yes (y) or no (n).";;
    esac
  done
}

echo "📚 Promptonomicon Installation"
echo "=============================="
echo ""

# Check if we're in a git repository
if [ -d .git ]; then
  echo "✓ Git repository detected"
else
  echo "⚠️  Warning: Not in a git repository"
  if ! confirm "Continue installation anyway?"; then
    echo "Installation cancelled."
    exit 0
  fi
fi

# Check for existing Promptonomicon installation
if [ -d .promptonomicon ]; then
  echo "⚠️  Warning: .promptonomicon directory already exists"
  if ! confirm "Overwrite existing Promptonomicon files?"; then
    echo "Installation cancelled."
    exit 0
  fi
fi

# Show what will be installed
echo ""
echo "This will install:"
echo "  • .promptonomicon/ directory with process templates"
echo "  • ai-docs/ directory structure for documentation"
echo "  • .scratch/ directory for temporary work"
echo "  • Update .gitignore to exclude .scratch/*"
echo ""

if ! confirm "Proceed with installation?"; then
  echo "Installation cancelled."
  exit 0
fi

echo ""
echo "📁 Creating directory structure..."

# Create directories
if confirm "Create .promptonomicon directory?"; then
  mkdir -p .promptonomicon
  echo "  ✓ Created .promptonomicon/"
fi

if confirm "Create ai-docs directory structure?"; then
  mkdir -p ai-docs/{ai-design,ai-plans,ai-implementation,features}
  echo "  ✓ Created ai-docs/ with subdirectories"
fi

if confirm "Create .scratch directory?"; then
  mkdir -p .scratch
  echo "  ✓ Created .scratch/"
fi

# Copy framework files
echo ""
echo "📄 Copying framework files..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if source files exist
if [ ! -d "$SCRIPT_DIR/.promptonomicon" ]; then
  echo "❌ Error: Cannot find source .promptonomicon directory at $SCRIPT_DIR/.promptonomicon"
  echo "Please run this script from the cloned Promptonomicon repository."
  exit 1
fi

if confirm "Copy process templates to .promptonomicon/?"; then
  # Copy the process templates
  for file in 1_BUILD_DESIGN.md 3_BUILD_PLAN.md 4_DEVELOPMENT_PROCESS.md 5_BUILD_IMPLEMENTATION.md 6_DOCUMENTATION_UPDATE.md README.md PROMPTONOMICON.md; do
    if [ -f "$SCRIPT_DIR/.promptonomicon/$file" ]; then
      cp "$SCRIPT_DIR/.promptonomicon/$file" .promptonomicon/
      echo "  ✓ Copied $file"
    else
      echo "  ⚠️  Warning: $file not found in source"
    fi
  done
fi

# Create .scratch README
if confirm "Create .scratch/README.md with usage instructions?"; then
  cat > .scratch/README.md << 'EOF'
# Scratch Directory

This directory is for temporary work that should NOT be committed to version control.

## Purpose

The `.scratch/` directory serves as a workspace for:
- Temporary scripts and code snippets
- Work-in-progress documentation
- Backup copies while refactoring
- Test data and experimental code
- Running todo lists for features

## Important Files

### `todo.md`
When implementing a feature, create a `todo.md` file here to track progress through the six-phase development process:

```markdown
# Feature: [Feature Name]

## Development Process Checklist

- [ ] 1. **Understand** - Thoroughly investigate requirements and repository context
- [ ] 2. **Design** - Create comprehensive design documentation
- [ ] 3. **Plan** - Build detailed implementation plans from designs
- [ ] 4. **Develop** - Follow the plan using test-driven development
- [ ] 5. **Document** - Capture implementation details and decisions
- [ ] 6. **Update** - Synchronize all reference documentation

## Notes
[Add any working notes, discoveries, or reminders here]
```

## Usage Guidelines

1. **Create freely**: Use this space for any temporary work
2. **Name clearly**: Use descriptive names for temporary files
3. **Clean regularly**: Delete files when no longer needed
4. **Never commit**: This directory is in `.gitignore`

## Examples

- `temp-validation-logic.js` - Experimenting with validation approach
- `api-response-sample.json` - Sample data for testing
- `refactor-backup-20251216.js` - Backup before major changes
- `todo.md` - Current feature progress tracking

Remember: If it's important enough to keep, it belongs in the actual codebase with proper documentation!
EOF
  echo "  ✓ Created .scratch/README.md"
fi

# Update .gitignore
echo ""
if ! grep -q "^\.scratch/\*" .gitignore 2>/dev/null; then
  if confirm "Update .gitignore to exclude .scratch/* ?"; then
    echo -e "\n# Scratch directory for temporary work\n.scratch/*\n# But keep the README\n!.scratch/README.md" >> .gitignore
    echo "  ✓ Updated .gitignore"
  fi
else
  echo "  ✓ .gitignore already configured for .scratch/"
fi

echo ""
echo "✅ Promptonomicon installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Customize the templates in .promptonomicon/ for your project"
echo "2. Use with any AI assistant:"
echo "   'Follow the Promptonomicon process in .promptonomicon/PROMPTONOMICON.md to [implement feature]'"
echo ""
echo "📖 See INTEGRATION.md for detailed customization instructions"
echo ""
echo "💡 Tip: Run with -y flag to auto-approve all prompts: $0 -y"
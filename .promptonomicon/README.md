# Promptonomicon Templates

This directory contains the customizable process templates for your project.

## Customization Guide

Each template contains `<!-- CUSTOMIZE -->` comments showing where to add your project-specific standards:

- **1_BUILD_DESIGN.md** - Your design document format
- **3_BUILD_PLAN.md** - Your planning approach
- **4_DEVELOPMENT_PROCESS.md** - Your coding standards and workflow
- **5_BUILD_IMPLEMENTATION.md** - Your documentation style
- **6_DOCUMENTATION_UPDATE.md** - Your update procedures

## Usage

These templates are referenced by `PROMPTONOMICON.md` in this directory. When working with AI tools, reference that file to invoke the process.

## Important

Don't reference these files directly in your AI prompts. Always use:
```
"Follow the Promptonomicon process in .promptonomicon/PROMPTONOMICON.md"
```

This ensures the AI reads the entrypoint and follows the complete process.

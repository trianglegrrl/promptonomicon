# Configuring Claude Desktop for Promptonomicon

This guide explains how to configure Claude Desktop to use Promptonomicon and MCP servers.

## Adding Promptonomicon Instructions

To make Claude automatically follow Promptonomicon in your project:

1. Create a `CLAUDE.md` file in your project root
2. Copy the contents from `.promptonomicon/ai-assistants/CLAUDE.md`
3. Claude will automatically read and follow these instructions

## MCP Server Configuration

If you want to use the included MCP servers with Claude Desktop:

1. **Locate your Claude configuration**:
   - macOS: `~/.config/claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the MCP servers**:
   ```json
   {
     "mcpServers": {
       "versionator": {
         "command": "npx",
         "args": ["-y", "@versionator/mcp-server"]
       },
       "context7": {
         "command": "npx",
         "args": ["-y", "@context7/mcp-server"],
         "env": {
           "CONTEXT7_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

3. **Restart Claude Desktop** for changes to take effect

## What These Servers Do

- **versionator**: Provides real-time package version information across all ecosystems
- **context7**: Fetches current documentation for libraries (requires API key from context7.com)

## Process Overview

The Promptonomicon process ensures:
- Thorough investigation before coding
- Comprehensive design documentation
- Detailed implementation planning
- Test-driven development
- Reality documentation
- Synchronized updates

All documentation is generated in the `ai-docs/` directory.

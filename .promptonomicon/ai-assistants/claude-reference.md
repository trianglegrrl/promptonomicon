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
       },
       "supabase": {
         "type": "http",
         "url": "https://mcp.supabase.com/mcp?project_ref=${SUPABASE_PROJECT_REF}",
         "headers": {
           "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
         }
       },
       "time": {
         "command": "uvx",
         "args": ["mcp-server-time"]
       },
       "github": {
         "url": "https://api.githubcopilot.com/mcp/",
         "headers": {
           "Authorization": "Bearer ${GITHUB_PAT}"
         }
       }
     }
   }
   ```
   
   **Note**: Replace the `${ENV_VAR}` placeholders with actual values or ensure the environment variables are set.

3. **Restart Claude Desktop** for changes to take effect

## What These Servers Do

### versionator (ALWAYS use for dependencies)
- **Purpose**: Provides real-time package version information across all ecosystems
- **When to use**: Before adding or updating ANY dependency
- **How to use**: `get_package_version("ecosystem", "package-name")`
- **Why**: Ensures you're using current, supported versions (versionator-first principle)

### context7 (For library documentation)
- **Purpose**: Fetches current documentation for libraries
- **When to use**: When you need current documentation for external libraries/frameworks
- **How to use**: `get-library-docs("/library/path")`
- **Requires**: CONTEXT7_API_KEY environment variable (get API key from context7.com)

### Supabase (For database/backend work)
- **Purpose**: Direct integration with Supabase services
- **When to use**: Working with Supabase databases, authentication, storage, or real-time features
- **Requires**: SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN environment variables
- **Why**: Direct database access and Supabase API operations

### GitHub (For repository operations)
- **Purpose**: Direct access to GitHub API
- **When to use**: Working with GitHub repositories, issues, pull requests, or GitHub API operations
- **Requires**: GITHUB_PAT environment variable (GitHub Personal Access Token)
- **Why**: Repository management, issue tracking, PR creation/review

### mcp-server-time (For time operations)
- **Purpose**: Provides accurate time operations and timezone handling
- **When to use**: Working with dates, times, timezones, scheduling, or time-based calculations
- **Why**: Reliable time operations and conversions

## Process Overview

The Promptonomicon process ensures:
- Thorough investigation before coding
- Comprehensive design documentation
- Detailed implementation planning
- Test-driven development
- Reality documentation
- Synchronized updates

All documentation is generated in the `ai-docs/` directory.

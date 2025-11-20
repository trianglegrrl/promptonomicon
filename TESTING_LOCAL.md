# Testing Promptonomicon Locally in Another Repository

This guide explains how to test the local development version of Promptonomicon (including the MCP server) in another repository.

## Prerequisites

1. You have the Promptonomicon repository cloned locally
2. You have a test repository where you want to test Promptonomicon
3. You're using `yarn` (or `npm` - adjust commands accordingly)

## Step 1: Build and Link Both Packages

You can use the convenience script to build the MCP server and link both packages:

```bash
cd /path/to/promptonomicon
yarn link:all
```

This will:
1. Build the MCP server (TypeScript → JavaScript)
2. Link the main `promptonomicon` CLI package
3. Link the `promptonomicon-mcp` server package

**Or do it manually:**

```bash
# Build the MCP server
cd /path/to/promptonomicon
yarn build:mcp

# Link both packages
yarn link
cd packages/mcp-server
yarn link
```

## Step 3: Use in Your Test Repository

Navigate to your test repository and link both packages:

```bash
cd /path/to/your/test-repo

# Link the main CLI
yarn link promptonomicon

# Link the MCP server
yarn link promptonomicon-mcp
```

## Step 4: Verify Links Are Working

Before testing, verify that both packages are properly linked:

```bash
# In your test repo, check linked packages
yarn list --link

# You should see both:
# promptonomicon
# promptonomicon-mcp
```

You can also test that `npx` will find the linked MCP server:

```bash
# This should use the linked version, not download from npm
npx promptonomicon-mcp --help
```

If it tries to download from npm instead, the link might not be working. Try:
1. Re-linking: `yarn link promptonomicon-mcp` in your test repo
2. Check the link: `yarn list --link` should show the package

## Step 5: Test the CLI Commands

Now you can test the CLI commands:

```bash
# Initialize Promptonomicon
promptonomicon init

# Check setup
promptonomicon doctor

# Test MCP server directly
promptonomicon mcp

# Or run it with options
promptonomicon mcp --http --port 3000
```

## Step 6: Test MCP Server Integration

When you run `promptonomicon init` or `promptonomicon reset`, the MCP server should be:

1. **Selected by default** in the MCP server selection
2. **Configured in `.promptonomicon/.mcp.json`** with the correct command and data-dir
3. **Runnable** via `promptonomicon mcp` command

### Verify MCP Configuration

Check that `.promptonomicon/.mcp.json` includes:

```json
{
  "mcpServers": {
    "promptonomicon": {
      "command": "npx",
      "args": ["-y", "promptonomicon-mcp", "--data-dir", ".promptonomicon"],
      "description": "Promptonomicon to-do manager MCP server (selected by default)"
    }
  }
}
```

**Note**: When using `yarn link`, `npx` will use the linked version instead of downloading from npm, so this should work correctly.

## Step 7: Test with an AI Assistant

1. Configure your AI assistant (Cursor, Claude Desktop, etc.) to use the MCP server
2. The MCP server should be available via the linked package
3. Test creating tasks and notes through the AI assistant

## Troubleshooting

### MCP Server Not Found

If `npx promptonomicon-mcp` can't find the package:

1. Verify the link: `yarn list --link`
2. Rebuild the MCP server: `cd packages/mcp-server && yarn build`
3. Re-link: `yarn link` in the MCP server directory, then `yarn link promptonomicon-mcp` in your test repo

### CLI Not Found

If `promptonomicon` command is not found:

1. Verify the link: `yarn list --link`
2. Check that the bin is executable: `ls -l /path/to/promptonomicon/bin/promptonomicon.js`
3. Re-link: `yarn link` in the main directory, then `yarn link promptonomicon` in your test repo

### TypeScript Errors in MCP Server

If you see TypeScript errors, make sure you've built the package:

```bash
cd packages/mcp-server
yarn build
```

### Changes Not Reflecting

After making changes to either package:

1. **For CLI changes**: No rebuild needed (it's JavaScript), just re-link if needed
2. **For MCP server changes**: Rebuild with `yarn build` in `packages/mcp-server`

## Unlinking

When you're done testing, unlink the packages:

```bash
# In your test repo
cd /path/to/your/test-repo
yarn unlink promptonomicon
yarn unlink promptonomicon-mcp
```

Then in the Promptonomicon repo, use the convenience script:

```bash
cd /path/to/promptonomicon
yarn unlink:all
```

**Or do it manually:**

```bash
cd /path/to/promptonomicon
yarn unlink
cd packages/mcp-server
yarn unlink
```

## Alternative: Using npm

If you prefer `npm` instead of `yarn`:

```bash
# Link packages
cd /path/to/promptonomicon
npm link

cd packages/mcp-server
npm link

# Use in test repo
cd /path/to/your/test-repo
npm link promptonomicon
npm link promptonomicon-mcp
```

## Testing the Full Flow

1. **Initialize**: `promptonomicon init` (should select MCP server by default)
2. **Verify MCP config**: Check `.promptonomicon/.mcp.json` has the promptonomicon server
3. **Run MCP server**: `promptonomicon mcp` (should start successfully)
4. **Test with AI**: Configure your AI assistant and test creating tasks/notes
5. **Verify data**: Check `.promptonomicon/todos-{projectName}.json` is created


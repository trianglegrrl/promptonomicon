# Promptonomicon To-Do MCP Server

A Model Context Protocol (MCP) server for managing to-do tasks and scratch notes in Promptonomicon projects.

## Features

- **Task Management**: Create, read, update, and delete tasks with hierarchical sub-tasks
- **Scratch Notes**: Manage scratch notes that can be marked as completed
- **Project-Based**: All data is organized by project name with automatic filtering
- **Smart Querying**: Query tasks by status, order, content, and parent relationships
- **Persistent Storage**: Data stored in `.promptonomicon/todos-{projectName}.json` files

## Installation

The MCP server is automatically available when Promptonomicon is initialized with MCP servers:

```bash
promptonomicon init --with-mcp-servers=promptonomicon
```

Or install it directly:

```bash
npx promptonomicon-mcp
```

## Usage

### Running the Server

**Stdio mode** (for MCP clients):
```bash
promptonomicon mcp
# or
npx promptonomicon-mcp
```

**HTTP mode** (for testing):
```bash
promptonomicon mcp --http --port 3000
# or
npx promptonomicon-mcp --http --port 3000
```

### Project Name Resolution

The server automatically resolves the project name with the following priority:

1. CLI argument: `--project-name <name>`
2. Environment variable: `PROMPTONOMICON_PROJECT_NAME`
3. Auto-detect from git remote URL
4. Auto-detect from `package.json` name
5. Current directory name (fallback)

### MCP Tools

#### Task Tools

- **`todo_create_task`**: Create a new task
  - Parameters: `projectName`, `content`, `description` (optional), `status`, `order`, `parentId` (optional)
  
- **`todo_get_task`**: Get a task by ID
  - Parameters: `projectName`, `taskId`
  
- **`todo_update_task`**: Update an existing task
  - Parameters: `id`, `projectName`, `content` (optional), `description` (optional), `status` (optional), `order` (optional)
  
- **`todo_delete_task`**: Delete a task by ID
  - Parameters: `projectName`, `taskId`
  
- **`todo_query_tasks`**: Query tasks with filters
  - Parameters: `projectName`, `status` (optional), `minOrder` (optional), `maxOrder` (optional), `contentSearch` (optional), `parentId` (optional)

#### Scratch Note Tools

- **`todo_create_note`**: Create a new scratch note
  - Parameters: `projectName`, `content`
  
- **`todo_get_note`**: Get a note by ID
  - Parameters: `projectName`, `noteId`
  
- **`todo_update_note`**: Update a note (can mark as completed)
  - Parameters: `id`, `projectName`, `content` (optional), `completed` (optional)
  
- **`todo_delete_note`**: Delete a note by ID
  - Parameters: `projectName`, `noteId`
  
- **`todo_query_notes`**: Query notes by completion status
  - Parameters: `projectName`, `completed` (optional)

## Task Hierarchy

Tasks support hierarchical sub-tasks using dot notation:

- Root task: `1`, `2`, `3`
- First-level sub-task: `1.1`, `1.2`, `2.1`
- Deep sub-task: `2.1.1`, `2.1.1.1.1`

When creating a sub-task, specify the `parentId` parameter. The server automatically generates hierarchical IDs.

## Data Storage

All data is stored in `.promptonomicon/todos-{projectName}.json` files. Each project has its own isolated data store.

## Development

```bash
# Install dependencies
yarn install

# Build
yarn build

# Run tests
yarn test

# Run with coverage
yarn test:coverage

# Run OpenAI Agents SDK integration test (requires OPENAI_API_KEY)
yarn test:integration

# Start server (development)
yarn start
```

### Integration Testing with OpenAI Agents SDK

The package includes an integration test that uses the OpenAI Agents SDK to verify the MCP server tools work correctly with AI agents. This test:

1. Uses an AI agent with access to all MCP server tools (todo_create_task, todo_query_tasks, todo_create_note, etc.)
2. Has the agent create tasks, sub-tasks, and scratch notes
3. Updates task statuses and note completion
4. Queries tasks and notes with various filters
5. Verifies all operations work correctly

**Requirements:**
- `OPENAI_API_KEY` environment variable must be set
- Uses `gpt-5-mini` model for cost efficiency

**Run the integration test:**
```bash
export OPENAI_API_KEY=sk-...
yarn test:integration              # Normal output
yarn test:integration:verbose      # Verbose output showing all MCP tool calls
```

The test uses the same services (TaskService, ScratchNoteService) that the MCP server uses, demonstrating that the MCP tools work correctly and can be used by AI agents.

**Verbose mode** (`--verbose` or `-v`) shows:
- All MCP tool calls (todo_create_task, todo_query_tasks, etc.)
- Tool parameters and results
- Execution timing
- Final data verification (task/note counts)

## License

MIT


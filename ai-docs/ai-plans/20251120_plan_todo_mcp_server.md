# Plan: Promptonomicon To-Do MCP Server

## Plan Overview

**Feature Name**: Promptonomicon To-Do MCP Server
**Design Document**: `ai-docs/ai-design/20251120_design_todo_mcp_server.md`
**Date**: 20251120

### Summary
Build a FastMCP TypeScript MCP server that provides structured to-do management for Promptonomicon projects. The server will support hierarchical tasks, scratch notes, project-based filtering, and JSON file persistence. It will be integrated into the Promptonomicon CLI as an optional MCP server (selected by default) and replace the scratch directory workflow.

### Process Checklist
Copy to `.scratch/todo.md`:
- [x] 1. Understand
- [x] 2. Design
- [x] 2.5. Resolve Open Questions
- [x] 3. Plan (current)
- [ ] 4. Develop
- [ ] 5. Document
- [ ] 6. Update

### Resolved Questions from Design
- **Tags/Labels**: Not in initial version (YAGNI)
- **Hierarchy Depth**: No hard limit, validate to prevent abuse (warn at 10+, max 20)
- **Due Dates/Time Tracking**: Not in initial version (YAGNI)
- **Archive**: Delete for now, can add archive later
- **Bulk Operations**: Start with single operations (YAGNI)
- **Project Name**: Support multiple sources (CLI arg > env var > auto-detect > prompt)
- **Task Dependencies**: Not in initial version (YAGNI)
- **Scratch Note Formatting**: Plain text for now (YAGNI)

## Repository Context

### Patterns to Follow
- **CLI Structure**: See `bin/promptonomicon.js` for Commander.js patterns
- **MCP Server Configuration**: See `MCP_SERVER_TEMPLATES` in `bin/promptonomicon.js` (lines 64-103)
- **Test Structure**: See `__tests__/index.test.js` for Jest test patterns
- **Error Handling**: Follow fail-hard principles from `.promptonomicon/4_DEVELOPMENT_PROCESS.md`

**Reference Documentation**:
- MCP server setup: See `bin/promptonomicon.js` `setupMCPServers()` function
- Testing patterns: See `__tests__/` directory
- Development process: See `.promptonomicon/4_DEVELOPMENT_PROCESS.md`

### Files to Create
- `packages/mcp-server/package.json`: MCP server package configuration
- `packages/mcp-server/src/index.ts`: Main MCP server entry point
- `packages/mcp-server/src/models.ts`: TypeScript interfaces for Task and ScratchNote
- `packages/mcp-server/src/storage.ts`: ProjectStorage implementation
- `packages/mcp-server/src/services/taskService.ts`: TaskService implementation
- `packages/mcp-server/src/services/scratchNoteService.ts`: ScratchNoteService implementation
- `packages/mcp-server/src/tools.ts`: MCP tool definitions
- `packages/mcp-server/src/cli.ts`: CLI command handler
- `packages/mcp-server/src/utils/projectName.ts`: Project name resolution utility
- `packages/mcp-server/src/utils/validation.ts`: Input validation utilities
- `packages/mcp-server/__tests__/storage.test.ts`: Storage layer tests
- `packages/mcp-server/__tests__/taskService.test.ts`: TaskService tests
- `packages/mcp-server/__tests__/scratchNoteService.test.ts`: ScratchNoteService tests
- `packages/mcp-server/__tests__/mcp-server.test.ts`: MCP server integration tests
- `packages/mcp-server/tsconfig.json`: TypeScript configuration
- `packages/mcp-server/README.md`: MCP server documentation

### Files to Modify
- `bin/promptonomicon.js`: Add `promptonomicon mcp` command and MCP server template
- `package.json`: Add workspace configuration for monorepo (if needed) or reference to MCP server
- `.promptonomicon/PROMPTONOMICON.md`: Update to mention to-do MCP server
- `.promptonomicon/4_DEVELOPMENT_PROCESS.md`: Update to mention to-do MCP server usage
- `.promptonomicon/ai-assistants/cursor-rules.mdc`: Update to mention to-do MCP server
- `.promptonomicon/ai-assistants/CLAUDE.md`: Update to mention to-do MCP server

### Dependencies
- **fastmcp@3.23.1**: FastMCP framework (checked via versionator)
- **zod**: Schema validation (likely included with FastMCP, verify)
- **typescript@latest**: TypeScript compiler (check via versionator)
- **@types/node@latest**: Node.js type definitions (check via versionator)
- **tsx**: TypeScript execution (for running TypeScript directly, check via versionator)
- **jest@30.2.0**: Testing framework (already in devDependencies)
- **@types/jest@latest**: Jest type definitions (check via versionator)
- **ts-jest@latest**: TypeScript support for Jest (check via versionator)

## Implementation Steps

Follow TDD (Test-Driven Development) for each step: RED → GREEN → REFACTOR

### Step 1: Project Setup and Foundation

- [ ] Create directory structure:
  ```
  packages/mcp-server/
  ├── src/
  │   ├── services/
  │   └── utils/
  ├── __tests__/
  └── package.json
  ```
- [ ] Create `packages/mcp-server/package.json`:
  - Set up package name: `@promptonomicon/mcp-server` or `promptonomicon-mcp`
  - Add bin entry: `"promptonomicon-mcp": "./dist/cli.js"`
  - Add dependencies: fastmcp, zod, typescript
  - Add devDependencies: jest, ts-jest, @types/jest, @types/node, tsx
  - Add scripts: build, test, start
- [ ] Create `packages/mcp-server/tsconfig.json`:
  - Target: ES2022
  - Module: ES2022
  - ModuleResolution: node
  - OutDir: dist
  - RootDir: src
- [ ] Create `packages/mcp-server/jest.config.js`:
  - Use ts-jest preset
  - Configure test environment
  - Set up coverage thresholds
- [ ] Verify starting state: Run `npm test` (should pass with no tests)

**Principles to Apply**:
- Keep it simple (KISS)
- Only create what's needed now (YAGNI)
- Clear, descriptive file names
- Logical directory structure

### Step 2: Data Models and Validation (TDD)

#### RED: Write Tests First
- [ ] Create `__tests__/models.test.ts`:
  - Test Task interface structure
  - Test ScratchNote interface structure
  - Test hierarchical ID generation (1.1, 2.1.1, etc.)
  - Test project name validation
- [ ] Create `__tests__/validation.test.ts`:
  - Test project name sanitization (prevent path traversal)
  - Test task ID validation
  - Test status enum validation
  - Test order number validation
- [ ] Run tests - confirm they fail

#### GREEN: Implement Minimum Code
- [ ] Create `src/models.ts`:
  - Define Task interface (id, content, description, status, order, projectName, parentId, subTasks)
  - Define ScratchNote interface (id, content, projectName, completed, createdAt)
  - Define Status enum (pending, in-progress, completed)
  - Define ProjectData interface (tasks, scratchNotes)
- [ ] Create `src/utils/validation.ts`:
  - Implement `validateProjectName()`: alphanumeric, hyphens, underscores only
  - Implement `sanitizeProjectName()`: prevent path traversal
  - Implement `validateTaskId()`: validate hierarchical IDs
  - Implement `validateStatus()`: validate status enum
- [ ] Create `src/utils/hierarchy.ts`:
  - Implement `generateSubTaskId()`: generate hierarchical IDs (1.1, 2.1.1)
  - Implement `parseTaskId()`: parse hierarchical ID into parts
  - Implement `getParentId()`: extract parent ID from hierarchical ID
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Extract common validation patterns (DRY)
- [ ] Improve naming for clarity
- [ ] Add JSDoc comments for public functions
- [ ] Run tests - confirm still passing

### Step 3: Storage Layer (TDD)

#### RED: Write Tests First
- [ ] Create `__tests__/storage.test.ts`:
  - Test `readProjectData()`: read existing file, return data
  - Test `readProjectData()`: file not found, return empty data
  - Test `readProjectData()`: corrupted JSON, throw error
  - Test `writeProjectData()`: write data to file
  - Test `writeProjectData()`: atomic write (temp file then rename)
  - Test `writeProjectData()`: permission error, throw error
  - Test `projectExists()`: check if project file exists
  - Test project name validation in file paths

#### GREEN: Implement Minimum Code
- [ ] Create `src/storage.ts`:
  - Implement `ProjectStorage` class
  - Implement `readProjectData(projectName)`: read JSON file, return ProjectData
  - Implement `writeProjectData(projectName, data)`: write JSON file atomically
  - Implement `projectExists(projectName)`: check if file exists
  - Handle file system errors (fail-hard)
  - Validate project names before file operations
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Extract file path logic
- [ ] Improve error messages
- [ ] Add retry logic for atomic writes (if needed)
- [ ] Run tests - confirm still passing

### Step 4: Task Service (TDD)

#### RED: Write Tests First
- [ ] Create `__tests__/taskService.test.ts`:
  - Test `createTask()`: create task successfully
  - Test `createTask()`: invalid project name, throw error
  - Test `createTask()`: parent task not found, throw error
  - Test `createTask()`: generate hierarchical ID for sub-task
  - Test `getTask()`: get task by ID
  - Test `getTask()`: task not found, throw error
  - Test `updateTask()`: update task successfully
  - Test `updateTask()`: task not found, throw error
  - Test `deleteTask()`: delete task successfully
  - Test `deleteTask()`: task not found, throw error
  - Test `queryTasks()`: query by project
  - Test `queryTasks()`: query by status
  - Test `queryTasks()`: query by order range
  - Test `queryTasks()`: query by content search
  - Test `queryTasks()`: query sub-tasks by parent ID
  - Test hierarchy validation: prevent cycles
  - Test hierarchy validation: validate parent exists

#### GREEN: Implement Minimum Code
- [ ] Create `src/services/taskService.ts`:
  - Implement `TaskService` class
  - Implement `createTask(params)`: create task, generate ID, validate parent
  - Implement `getTask(projectName, taskId)`: get task by ID
  - Implement `updateTask(params)`: update task properties
  - Implement `deleteTask(projectName, taskId)`: delete task
  - Implement `queryTasks(projectName, filters)`: query tasks by various criteria
  - Implement hierarchy validation (prevent cycles, validate parent exists)
  - Use ProjectStorage for persistence
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Extract query logic into separate functions
- [ ] Improve error messages
- [ ] Optimize query performance if needed
- [ ] Run tests - confirm still passing

### Step 5: Scratch Note Service (TDD)

#### RED: Write Tests First
- [ ] Create `__tests__/scratchNoteService.test.ts`:
  - Test `createNote()`: create note successfully
  - Test `createNote()`: invalid project name, throw error
  - Test `getNote()`: get note by ID
  - Test `getNote()`: note not found, throw error
  - Test `updateNote()`: update note successfully
  - Test `updateNote()`: mark note as completed
  - Test `deleteNote()`: delete note successfully
  - Test `queryNotes()`: query by project
  - Test `queryNotes()`: query by completion status

#### GREEN: Implement Minimum Code
- [ ] Create `src/services/scratchNoteService.ts`:
  - Implement `ScratchNoteService` class
  - Implement `createNote(params)`: create note, generate ID
  - Implement `getNote(projectName, noteId)`: get note by ID
  - Implement `updateNote(params)`: update note properties
  - Implement `deleteNote(projectName, noteId)`: delete note
  - Implement `queryNotes(projectName, filters)`: query notes by criteria
  - Use ProjectStorage for persistence
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Extract common patterns from TaskService (DRY)
- [ ] Improve error messages
- [ ] Run tests - confirm still passing

### Step 6: Project Name Resolution (TDD)

#### RED: Write Tests First
- [ ] Create `__tests__/projectName.test.ts`:
  - Test `resolveProjectName()`: CLI argument provided, use it
  - Test `resolveProjectName()`: environment variable provided, use it
  - Test `resolveProjectName()`: auto-detect from git remote
  - Test `resolveProjectName()`: auto-detect from package.json
  - Test `resolveProjectName()`: fallback to directory name
  - Test `resolveProjectName()`: prompt user if none found (mock)

#### GREEN: Implement Minimum Code
- [ ] Create `src/utils/projectName.ts`:
  - Implement `resolveProjectName(options)`: resolve project name with priority
  - Implement `detectFromGit()`: read git remote URL
  - Implement `detectFromPackageJson()`: read package.json name
  - Implement `getDirectoryName()`: get current directory name
  - Implement `promptForProjectName()`: prompt user (if needed)
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Extract detection logic
- [ ] Improve error handling
- [ ] Run tests - confirm still passing

### Step 7: MCP Server and Tools (TDD)

#### RED: Write Tests First
- [ ] Create `__tests__/mcp-server.test.ts`:
  - Test MCP server initialization
  - Test tool registration (all tools present)
  - Test `createTask` tool: valid input, returns task ID
  - Test `createTask` tool: invalid input, returns error
  - Test `getTask` tool: valid ID, returns task
  - Test `getTask` tool: invalid ID, returns error
  - Test `updateTask` tool: valid input, updates task
  - Test `deleteTask` tool: valid ID, deletes task
  - Test `queryTasks` tool: various filter combinations
  - Test `createNote` tool: valid input, returns note ID
  - Test `getNote` tool: valid ID, returns note
  - Test `updateNote` tool: valid input, updates note
  - Test `deleteNote` tool: valid ID, deletes note
  - Test `queryNotes` tool: various filter combinations
  - Test MCP protocol compliance (tool definitions, error responses)

#### GREEN: Implement Minimum Code
- [ ] Create `src/tools.ts`:
  - Define MCP tools using FastMCP:
    - `todo_create_task`: Create task
    - `todo_get_task`: Get task by ID
    - `todo_update_task`: Update task
    - `todo_delete_task`: Delete task
    - `todo_query_tasks`: Query tasks
    - `todo_create_note`: Create scratch note
    - `todo_get_note`: Get note by ID
    - `todo_update_note`: Update note
    - `todo_delete_note`: Delete note
    - `todo_query_notes`: Query notes
  - Use zod schemas for parameter validation
  - Call TaskService and ScratchNoteService
  - Return structured responses
- [ ] Create `src/index.ts`:
  - Initialize FastMCP server
  - Register all tools
  - Export server instance
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Extract common tool patterns (DRY)
- [ ] Improve error handling in tools
- [ ] Add tool descriptions (FastMCP prompt)
- [ ] Run tests - confirm still passing

### Step 8: CLI Command (TDD)

#### RED: Write Tests First
- [ ] Create `__tests__/cli.test.ts`:
  - Test `promptonomicon mcp` command: starts server with stdio
  - Test `promptonomicon mcp --http` command: starts server with http
  - Test `promptonomicon mcp --port 3000` command: custom port
  - Test `promptonomicon mcp --project-name test` command: project name
  - Test project name resolution priority

#### GREEN: Implement Minimum Code
- [ ] Create `src/cli.ts`:
  - Parse command-line arguments (--http, --port, --project-name)
  - Resolve project name
  - Initialize MCP server
  - Start server with appropriate transport (stdio or http)
- [ ] Update `bin/promptonomicon.js`:
  - Add `promptonomicon mcp` command
  - Call MCP server CLI
- [ ] Run tests - confirm all pass

#### REFACTOR: Improve Quality
- [ ] Improve error handling
- [ ] Add help text
- [ ] Run tests - confirm still passing

### Step 9: FastMCP Prompt

- [ ] Create `src/prompt.md`:
  - Explain what the to-do MCP server does
  - List all available tools
  - Provide examples for each tool
  - Explain project-based filtering
  - Explain hierarchical tasks
  - Explain scratch notes
- [ ] Integrate prompt into MCP server (if FastMCP supports it)

### Step 10: Integration Testing

- [ ] Create `__tests__/integration.test.ts`:
  - Test full workflow: create task, query, update, delete
  - Test sub-task workflow: create parent, create sub-task, query
  - Test scratch notes workflow: create, complete, query
  - Test project isolation: tasks from different projects don't mix
  - Test with actual MCP client calls (if possible)
  - Test both stdio and http transports

### Step 11: CLI Integration

- [ ] Update `bin/promptonomicon.js`:
  - Add `promptonomicon mcp` command to CLI
  - Add MCP server to `MCP_SERVER_TEMPLATES`:
    ```javascript
    promptonomicon: {
      command: 'npx',
      args: ['-y', 'promptonomicon-mcp'],
      description: 'Promptonomicon to-do manager MCP server',
      requiresVars: []
    }
  ```
  - Set as checked by default in `promptForMCPServers()`
- [ ] Test CLI integration

### Step 12: Template Updates

- [ ] Update `.promptonomicon/PROMPTONOMICON.md`:
  - Mention to-do MCP server as alternative to scratch directory
  - Add instructions for using to-do MCP server
- [ ] Update `.promptonomicon/4_DEVELOPMENT_PROCESS.md`:
  - Mention to-do MCP server in MCP server usage section
  - Update scratch directory references
- [ ] Update `.promptonomicon/ai-assistants/cursor-rules.mdc`:
  - Add to-do MCP server to available MCP servers list
- [ ] Update `.promptonomicon/ai-assistants/CLAUDE.md`:
  - Add to-do MCP server to available MCP servers list

## File Structure
```
packages/mcp-server/
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── cli.ts                   # CLI command handler
│   ├── models.ts                # TypeScript interfaces
│   ├── storage.ts                # File-based persistence
│   ├── tools.ts                  # MCP tool definitions
│   ├── services/
│   │   ├── taskService.ts        # Task business logic
│   │   └── scratchNoteService.ts # Scratch note business logic
│   ├── utils/
│   │   ├── projectName.ts        # Project name resolution
│   │   ├── validation.ts         # Input validation
│   │   └── hierarchy.ts          # Hierarchical ID utilities
│   └── prompt.md                 # FastMCP prompt
├── __tests__/
│   ├── models.test.ts
│   ├── validation.test.ts
│   ├── storage.test.ts
│   ├── taskService.test.ts
│   ├── scratchNoteService.test.ts
│   ├── projectName.test.ts
│   ├── mcp-server.test.ts
│   └── integration.test.ts
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Validation

### Plan Completeness
- [x] All design requirements addressed
- [x] All resolved questions from Phase 2.5 incorporated into plan
- [x] File paths verified to exist or will be created
- [x] Dependencies at latest versions (checked with versionator MCP)

### Architecture & Design Principles
- [x] SOLID principles applied in component design
- [x] Separation of concerns maintained (models, storage, services, MCP)
- [x] DRY principle: no planned code duplication
- [x] KISS principle: simplest solution chosen (JSON files, no database)
- [x] YAGNI principle: only necessary features planned

### Testing Strategy
- [x] TDD approach planned (tests before implementation)
- [x] Unit tests planned for all components
- [x] Integration tests planned for component interactions
- [x] Edge cases identified and testable
- [x] Test coverage target >90% planned

### Code Quality
- [x] Fail-hard error handling planned
- [x] Input validation planned at boundaries
- [x] Single responsibility per component
- [x] Dependencies are minimal and explicit
- [x] Clear naming conventions will be followed

### Implementation Approach
- [x] Red-Green-Refactor cycle will be followed
- [x] Small, incremental commits planned
- [x] Code review checklist will be used
- [x] Documentation plan in place

## Checklist
- [x] Steps are specific and actionable
- [x] All paths/commands verified
- [x] Dependencies checked with versionator MCP server
- [x] Tests cover success and failure
- [x] No silent error handling

## MCP Server Usage Guidelines

### promptonomicon (To-Do Manager)
- **When to use**: Managing tasks and scratch notes for Promptonomicon projects
- **How to use**: Configured via `promptonomicon init --with-mcp-servers=promptonomicon`
- **Tools available**:
  - `todo_create_task`: Create a new task
  - `todo_get_task`: Get task by ID
  - `todo_update_task`: Update task
  - `todo_delete_task`: Delete task
  - `todo_query_tasks`: Query tasks by various criteria
  - `todo_create_note`: Create scratch note
  - `todo_get_note`: Get note by ID
  - `todo_update_note`: Update note
  - `todo_delete_note`: Delete note
  - `todo_query_notes`: Query notes by criteria
- **Why**: Structured task management integrated with Promptonomicon workflow


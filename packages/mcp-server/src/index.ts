import { FastMCP } from 'fastmcp';
import { ProjectStorage } from './storage.js';
import { TaskService } from './services/taskService.js';
import { ScratchNoteService } from './services/scratchNoteService.js';
import { registerTools } from './tools.js';

/**
 * Create and configure MCP server
 */
export function createMCPServer(dataDir?: string): FastMCP {
  const server = new FastMCP({
    name: 'Promptonomicon To-Do Manager',
    version: '1.0.0',
  });

  // Initialize services
  const storage = new ProjectStorage(dataDir);
  const taskService = new TaskService(storage);
  const scratchNoteService = new ScratchNoteService(storage);

  // Register all tools
  registerTools(server, taskService, scratchNoteService);

  return server;
}

/**
 * Start MCP server with stdio transport
 */
export function startStdioServer(dataDir?: string): void {
  const server = createMCPServer(dataDir);
  server.start({ transportType: 'stdio' });
}

/**
 * Start MCP server with HTTP transport
 */
export function startHttpServer(port: number = 3000, dataDir?: string): void {
  const server = createMCPServer(dataDir);
  server.start({
    transportType: 'httpStream',
    httpStream: {
      port,
    },
  });
}


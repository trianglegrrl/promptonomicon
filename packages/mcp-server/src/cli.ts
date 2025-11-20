#!/usr/bin/env node

import { Command } from 'commander';
import { startStdioServer, startHttpServer } from './index.js';
import { resolveProjectName } from './utils/projectName.js';

const program = new Command();

program
  .name('promptonomicon-mcp')
  .description('Promptonomicon to-do manager MCP server')
  .version('1.0.0')
  .option('-p, --project-name <name>', 'Project name (overrides auto-detection)')
  .option('--http', 'Start HTTP server instead of stdio')
  .option('--port <port>', 'HTTP server port (default: 3000)', '3000')
  .option('--data-dir <dir>', 'Data directory (default: .promptonomicon)', '.promptonomicon')
  .action((options) => {
    // Resolve project name
    const projectName = resolveProjectName({
      cliArg: options.projectName,
      envVar: process.env.PROMPTONOMICON_PROJECT_NAME,
      autoDetect: true,
    });

    // Set project name in environment for tools to use
    process.env.PROMPTONOMICON_PROJECT_NAME = projectName;

    if (options.http) {
      const port = parseInt(options.port, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        console.error(`Invalid port: ${options.port}`);
        process.exit(1);
      }
      startHttpServer(port, options.dataDir);
      console.error(`MCP server started on http://localhost:${port}`);
    } else {
      startStdioServer(options.dataDir);
    }
  });

program.parse();


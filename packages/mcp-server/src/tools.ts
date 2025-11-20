import { z } from 'zod';
import { TaskService } from './services/taskService.js';
import { ScratchNoteService } from './services/scratchNoteService.js';
import { SummaryService } from './services/summaryService.js';
import type { FastMCP } from 'fastmcp';

/**
 * Register all MCP tools
 */
export function registerTools(
  server: FastMCP,
  taskService: TaskService,
  scratchNoteService: ScratchNoteService,
  summaryService: SummaryService
): void {
  // Task CRUD tools
  server.addTool({
    name: 'todo_create_task',
    description: 'Create a new task with content, description, status, order, and optional parent for sub-tasks',
    parameters: z.object({
      projectName: z.string().describe('Project name (required for all operations)'),
      content: z.string().describe('Task content'),
      description: z.string().optional().describe('Task description'),
      status: z.enum(['pending', 'in-progress', 'completed']).default('pending').describe('Task status'),
      order: z.number().describe('Task order (used for sorting)'),
      parentId: z.string().optional().describe('Parent task ID for creating sub-tasks (e.g., "1" for task 1.1)'),
    }),
    execute: async (args) => {
      const task = await taskService.createTask(args);
      return JSON.stringify({
        success: true,
        task,
        message: `Task "${task.id}" created successfully`,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_get_task',
    description: 'Get a task by ID',
    parameters: z.object({
      projectName: z.string().describe('Project name'),
      taskId: z.string().describe('Task ID (e.g., "1" or "1.1" for sub-tasks)'),
    }),
    execute: async ({ projectName, taskId }) => {
      const task = await taskService.getTask(projectName, taskId);
      if (!task) {
        return JSON.stringify({
          success: false,
          message: `Task "${taskId}" not found in project "${projectName}"`,
        }, null, 2);
      }
      return JSON.stringify({
        success: true,
        task,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_update_task',
    description: 'Update an existing task',
    parameters: z.object({
      id: z.string().describe('Task ID'),
      projectName: z.string().describe('Project name'),
      content: z.string().optional().describe('Task content'),
      description: z.string().optional().describe('Task description'),
      status: z.enum(['pending', 'in-progress', 'completed']).optional().describe('Task status'),
      order: z.number().optional().describe('Task order'),
    }),
    execute: async (args) => {
      const existing = await taskService.getTask(args.projectName, args.id);
      if (!existing) {
        return JSON.stringify({
          success: false,
          message: `Task "${args.id}" not found`,
        }, null, 2);
      }

      const updated = await taskService.updateTask({
        ...existing,
        ...args,
      });

      return JSON.stringify({
        success: true,
        task: updated,
        message: `Task "${args.id}" updated successfully`,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_delete_task',
    description: 'Delete a task by ID',
    parameters: z.object({
      projectName: z.string().describe('Project name'),
      taskId: z.string().describe('Task ID to delete'),
    }),
    execute: async ({ projectName, taskId }) => {
      await taskService.deleteTask(projectName, taskId);
      return JSON.stringify({
        success: true,
        message: `Task "${taskId}" deleted successfully`,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_query_tasks',
    description: 'Query tasks by various criteria (status, order range, content search, parent ID)',
    parameters: z.object({
      projectName: z.string().describe('Project name (required)'),
      status: z.enum(['pending', 'in-progress', 'completed']).optional().describe('Filter by status'),
      minOrder: z.number().optional().describe('Minimum order value'),
      maxOrder: z.number().optional().describe('Maximum order value'),
      contentSearch: z.string().optional().describe('Search in task content and description'),
      parentId: z.string().optional().describe('Filter sub-tasks by parent ID'),
    }),
    execute: async (args) => {
      const { projectName, ...filters } = args;
      const tasks = await taskService.queryTasks(projectName, filters);
      return JSON.stringify({
        success: true,
        tasks,
        count: tasks.length,
      }, null, 2);
    },
  });

  // Scratch note CRUD tools
  server.addTool({
    name: 'todo_create_note',
    description: 'Create a new scratch note',
    parameters: z.object({
      projectName: z.string().describe('Project name'),
      content: z.string().describe('Note content'),
    }),
    execute: async (args) => {
      const note = await scratchNoteService.createNote(args);
      return JSON.stringify({
        success: true,
        note,
        message: `Note "${note.id}" created successfully`,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_get_note',
    description: 'Get a scratch note by ID',
    parameters: z.object({
      projectName: z.string().describe('Project name'),
      noteId: z.string().describe('Note ID'),
    }),
    execute: async ({ projectName, noteId }) => {
      const note = await scratchNoteService.getNote(projectName, noteId);
      if (!note) {
        return JSON.stringify({
          success: false,
          message: `Note "${noteId}" not found in project "${projectName}"`,
        }, null, 2);
      }
      return JSON.stringify({
        success: true,
        note,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_update_note',
    description: 'Update a scratch note (can mark as completed)',
    parameters: z.object({
      id: z.string().describe('Note ID'),
      projectName: z.string().describe('Project name'),
      content: z.string().optional().describe('Note content'),
      completed: z.boolean().optional().describe('Mark note as completed'),
    }),
    execute: async (args) => {
      const existing = await scratchNoteService.getNote(args.projectName, args.id);
      if (!existing) {
        return JSON.stringify({
          success: false,
          message: `Note "${args.id}" not found`,
        }, null, 2);
      }

      const updated = await scratchNoteService.updateNote({
        ...existing,
        ...args,
      });

      return JSON.stringify({
        success: true,
        note: updated,
        message: `Note "${args.id}" updated successfully`,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_delete_note',
    description: 'Delete a scratch note by ID',
    parameters: z.object({
      projectName: z.string().describe('Project name'),
      noteId: z.string().describe('Note ID to delete'),
    }),
    execute: async ({ projectName, noteId }) => {
      await scratchNoteService.deleteNote(projectName, noteId);
      return JSON.stringify({
        success: true,
        message: `Note "${noteId}" deleted successfully`,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_query_notes',
    description: 'Query scratch notes by completion status',
    parameters: z.object({
      projectName: z.string().describe('Project name (required)'),
      completed: z.boolean().optional().describe('Filter by completion status'),
    }),
    execute: async (args) => {
      const { projectName, ...filters } = args;
      const notes = await scratchNoteService.queryNotes(projectName, filters);
      return JSON.stringify({
        success: true,
        notes,
        count: notes.length,
      }, null, 2);
    },
  });

  server.addTool({
    name: 'todo_summary',
    description: 'Generate a markdown summary of tasks and scratch notes with smart filtering options. Use this tool when the user asks for status, progress, or a summary of current work. Returns formatted markdown suitable for user communication.',
    parameters: z.object({
      projectName: z.string().describe('Project name (required)'),
      status: z.enum(['pending', 'in-progress', 'completed']).optional().describe('Filter tasks by status'),
      includeSubtasks: z.boolean().optional().default(true).describe('Include subtasks in summary'),
      onlySubtasks: z.boolean().optional().default(false).describe('Only show subtasks (exclude root tasks)'),
      includeCompleted: z.boolean().optional().default(true).describe('Include completed tasks and notes'),
      collapseCompleted: z.boolean().optional().default(true).describe('Collapse completed sections in markdown'),
      groupBy: z.enum(['status', 'hierarchy']).optional().default('status').describe('Grouping strategy: status or hierarchy'),
    }),
    execute: async (args) => {
      const summary = await summaryService.generateSummary(args.projectName, {
        status: args.status,
        includeSubtasks: args.includeSubtasks,
        onlySubtasks: args.onlySubtasks,
        includeCompleted: args.includeCompleted,
        collapseCompleted: args.collapseCompleted,
        groupBy: args.groupBy,
      });
      return summary;
    },
  });
}


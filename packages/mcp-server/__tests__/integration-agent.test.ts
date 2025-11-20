#!/usr/bin/env node

/**
 * Integration test using OpenAI Agents SDK with Promptonomicon To-Do MCP Server
 * 
 * This test uses an AI agent to:
 * 1. Use the todo/notes MCP server tools to manage tasks and notes
 * 2. Create tasks, query them, update them
 * 3. Create scratch notes and mark them as completed
 * 4. Verify the MCP server tools work correctly
 * 
 * Requires OPENAI_API_KEY environment variable.
 * 
 * Usage:
 *   yarn test:integration              # Normal output
 *   yarn test:integration --verbose    # Verbose output with all MCP tool calls
 */

import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { tool } from '@openai/agents';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProjectStorage } from '../src/storage.js';
import { TaskService } from '../src/services/taskService.js';
import { ScratchNoteService } from '../src/services/scratchNoteService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for verbose flag
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');

// Check for API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  console.error('   Set it with: export OPENAI_API_KEY=sk-...');
  process.exit(1);
}

// Initialize MCP server services (using same code as MCP server)
const testDataDir = path.join(__dirname, '..', 'test-mcp-data');
const storage = new ProjectStorage(testDataDir);
const taskService = new TaskService(storage);
const scratchNoteService = new ScratchNoteService(storage);

const TEST_PROJECT = 'integration-test';

// MCP Tool: Create Task
const todoCreateTask = tool({
  name: 'todo_create_task',
  description: 'Create a new task with content, description, status, order, and optional parent for sub-tasks',
  parameters: z.object({
    projectName: z.string().describe('Project name (required for all operations)'),
    content: z.string().describe('Task content'),
    description: z.string().nullable().optional().describe('Task description'),
    status: z.enum(['pending', 'in-progress', 'completed']).default('pending').describe('Task status'),
    order: z.number().describe('Task order (used for sorting)'),
    parentId: z.string().nullable().optional().describe('Parent task ID for creating sub-tasks (e.g., "1" for task 1.1)'),
  }),
  async execute(args) {
    if (VERBOSE) {
      console.log(`📋 [MCP TOOL] todo_create_task: "${args.content}" (project: ${args.projectName}, order: ${args.order})`);
    }
    const task = await taskService.createTask(args);
    if (VERBOSE) {
      console.log(`   ✅ Created task "${task.id}"`);
    }
    return JSON.stringify({
      success: true,
      task,
      message: `Task "${task.id}" created successfully`,
    }, null, 2);
  },
});

// MCP Tool: Get Task
const todoGetTask = tool({
  name: 'todo_get_task',
  description: 'Get a task by ID',
  parameters: z.object({
    projectName: z.string().describe('Project name'),
    taskId: z.string().describe('Task ID (e.g., "1" or "1.1" for sub-tasks)'),
  }),
  async execute({ projectName, taskId }) {
    if (VERBOSE) {
      console.log(`🔍 [MCP TOOL] todo_get_task: taskId="${taskId}" (project: ${projectName})`);
    }
    const task = await taskService.getTask(projectName, taskId);
    if (!task) {
      if (VERBOSE) {
        console.log(`   ❌ Task not found`);
      }
      return JSON.stringify({
        success: false,
        message: `Task "${taskId}" not found in project "${projectName}"`,
      }, null, 2);
    }
    if (VERBOSE) {
      console.log(`   ✅ Found task: "${task.content}" (status: ${task.status})`);
    }
    return JSON.stringify({
      success: true,
      task,
    }, null, 2);
  },
});

// MCP Tool: Update Task
const todoUpdateTask = tool({
  name: 'todo_update_task',
  description: 'Update an existing task',
  parameters: z.object({
    id: z.string().describe('Task ID'),
    projectName: z.string().describe('Project name'),
    content: z.string().nullable().optional().describe('Task content'),
    description: z.string().nullable().optional().describe('Task description'),
    status: z.enum(['pending', 'in-progress', 'completed']).nullable().optional().describe('Task status'),
    order: z.number().nullable().optional().describe('Task order'),
  }),
  async execute(args) {
    if (VERBOSE) {
      console.log(`✏️  [MCP TOOL] todo_update_task: taskId="${args.id}" (project: ${args.projectName})`);
      if (args.status) {
        console.log(`   Updating status to: ${args.status}`);
        if (args.status === 'completed') {
          console.log(`   ✓ CHECKING OFF task "${args.id}"`);
        }
      }
      if (args.content) console.log(`   Updating content to: "${args.content}"`);
    }
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
    if (VERBOSE) {
      console.log(`   ✅ Task updated`);
    }
    return JSON.stringify({
      success: true,
      task: updated,
      message: `Task "${args.id}" updated successfully`,
    }, null, 2);
  },
});

// MCP Tool: Query Tasks
const todoQueryTasks = tool({
  name: 'todo_query_tasks',
  description: 'Query tasks by various criteria (status, order range, content search, parent ID)',
  parameters: z.object({
    projectName: z.string().describe('Project name (required)'),
    status: z.enum(['pending', 'in-progress', 'completed']).nullable().optional().describe('Filter by status'),
    minOrder: z.number().nullable().optional().describe('Minimum order value'),
    maxOrder: z.number().nullable().optional().describe('Maximum order value'),
    contentSearch: z.string().nullable().optional().describe('Search in task content and description'),
    parentId: z.string().nullable().optional().describe('Filter sub-tasks by parent ID'),
  }),
  async execute(args) {
    if (VERBOSE) {
      console.log(`🔎 [MCP TOOL] todo_query_tasks: project="${args.projectName}"`);
      if (args.status) {
        console.log(`   Filter: status=${args.status}`);
        if (args.status === 'completed') {
          console.log(`   ✓ VERIFYING completed tasks`);
        }
      }
      if (args.contentSearch) console.log(`   Filter: contentSearch="${args.contentSearch}"`);
    }
    const { projectName, ...filters } = args;
    const tasks = await taskService.queryTasks(projectName, filters);
    if (VERBOSE) {
      console.log(`   ✅ Found ${tasks.length} task(s)`);
    }
    return JSON.stringify({
      success: true,
      tasks,
      count: tasks.length,
    }, null, 2);
  },
});

// MCP Tool: Create Note
const todoCreateNote = tool({
  name: 'todo_create_note',
  description: 'Create a new scratch note',
  parameters: z.object({
    projectName: z.string().describe('Project name'),
    content: z.string().describe('Note content'),
  }),
  async execute(args) {
    if (VERBOSE) {
      console.log(`📝 [MCP TOOL] todo_create_note: "${args.content.substring(0, 50)}..." (project: ${args.projectName})`);
    }
    const note = await scratchNoteService.createNote(args);
    if (VERBOSE) {
      console.log(`   ✅ Created note "${note.id}"`);
    }
    return JSON.stringify({
      success: true,
      note,
      message: `Note "${note.id}" created successfully`,
    }, null, 2);
  },
});

// MCP Tool: Query Notes
const todoQueryNotes = tool({
  name: 'todo_query_notes',
  description: 'Query scratch notes by completion status',
  parameters: z.object({
    projectName: z.string().describe('Project name (required)'),
    completed: z.boolean().nullable().optional().describe('Filter by completion status'),
  }),
  async execute(args) {
    if (VERBOSE) {
      console.log(`🔎 [MCP TOOL] todo_query_notes: project="${args.projectName}"`);
      if (args.completed !== undefined) {
        console.log(`   Filter: completed=${args.completed}`);
        if (args.completed === true) {
          console.log(`   ✓ VERIFYING completed notes`);
        }
      }
    }
    const { projectName, ...filters } = args;
    const notes = await scratchNoteService.queryNotes(projectName, filters);
    if (VERBOSE) {
      console.log(`   ✅ Found ${notes.length} note(s)`);
    }
    return JSON.stringify({
      success: true,
      notes,
      count: notes.length,
    }, null, 2);
  },
});

// MCP Tool: Update Note
const todoUpdateNote = tool({
  name: 'todo_update_note',
  description: 'Update a scratch note (can mark as completed)',
  parameters: z.object({
    id: z.string().describe('Note ID'),
    projectName: z.string().describe('Project name'),
    content: z.string().nullable().optional().describe('Note content'),
    completed: z.boolean().nullable().optional().describe('Mark note as completed'),
  }),
  async execute(args) {
    if (VERBOSE) {
      console.log(`✏️  [MCP TOOL] todo_update_note: noteId="${args.id}" (project: ${args.projectName})`);
      if (args.completed !== undefined) {
        console.log(`   Setting completed: ${args.completed}`);
        if (args.completed === true) {
          console.log(`   ✓ CHECKING OFF note "${args.id}"`);
        }
      }
    }
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
    if (VERBOSE) {
      console.log(`   ✅ Note updated`);
    }
    return JSON.stringify({
      success: true,
      note: updated,
      message: `Note "${args.id}" updated successfully`,
    }, null, 2);
  },
});

// Create agent with MCP tools
const agent = new Agent({
  name: 'To-Do Manager Assistant',
  instructions: `You are a task management assistant using the Promptonomicon to-do MCP server.

You have access to these MCP tools:
- todo_create_task: Create tasks with content, description, status, order, and optional parent
- todo_get_task: Get a task by ID
- todo_update_task: Update task properties (content, description, status, order)
- todo_query_tasks: Query tasks by status, order, content search, or parent ID
- todo_create_note: Create scratch notes
- todo_query_notes: Query notes by completion status
- todo_update_note: Update notes (including marking as completed)

All operations require a projectName. Use "${TEST_PROJECT}" as the project name for this test.

CRITICAL: When asked to check off items:
1. Use todo_update_task to set status="completed" for tasks
2. Use todo_update_note to set completed=true for notes
3. ALWAYS verify completion by querying for completed items (todo_query_tasks with status="completed" or todo_query_notes with completed=true)
4. Report the verification results in your response

Be thorough and verify each check-off operation.`,
  model: 'gpt-5-mini', // Use gpt-5-mini for cost efficiency
  tools: [
    todoCreateTask,
    todoGetTask,
    todoUpdateTask,
    todoQueryTasks,
    todoCreateNote,
    todoQueryNotes,
    todoUpdateNote,
  ],
});

async function runIntegrationTest() {
  console.log('🧪 Starting OpenAI Agents SDK + MCP Server integration test...');
  if (VERBOSE) {
    console.log('📊 Verbose mode enabled - showing all MCP tool calls\n');
  } else {
    console.log('💡 Tip: Use --verbose to see detailed MCP tool calls\n');
  }

  // Clean up test data directory
  try {
    await fs.rm(testDataDir, { recursive: true, force: true });
    if (VERBOSE) {
      console.log('🧹 Cleaned up test data directory\n');
    }
  } catch {
    // Ignore if doesn't exist
  }

  const prompt = `Using the todo/notes MCP server tools, help me manage a development project. IMPORTANT: You must check off (mark as completed) items and verify they are completed:

1. Create 3 tasks for a simple feature:
   - "Design API" (order: 1, status: pending)
   - "Implement API" (order: 2, status: pending)
   - "Write tests" (order: 3, status: pending)

2. Create a sub-task under "Design API" called "Create schema" (order: 1)

3. Update "Design API" status to "in-progress"

4. Create a scratch note: "Remember to add error handling"

5. **CHECK OFF**: Mark "Design API" task as completed (status: completed). Then verify it's completed by querying for completed tasks.

6. **CHECK OFF**: Mark "Implement API" task as completed (status: completed). Then verify it's completed.

7. **CHECK OFF**: Mark "Write tests" task as completed (status: completed). Then verify it's completed.

8. **CHECK OFF**: Mark the scratch note as completed. Then verify it's completed by querying for completed notes.

9. Query all completed tasks and show me the count - should be 3 completed tasks

10. Query all completed notes and show me the count - should be 1 completed note

Use project name "${TEST_PROJECT}" for all operations. After each check-off operation, verify the item is actually completed by querying for it.`;

  console.log('🤖 Running agent with MCP tools...\n');
  
  if (VERBOSE) {
    console.log('📝 Initial prompt:');
    console.log('─'.repeat(60));
    console.log(prompt);
    console.log('─'.repeat(60));
    console.log('\n🔄 Agent execution (max 15 turns)...\n');
  }
  
  const startTime = Date.now();
  let result;
  try {
    result = await run(agent, prompt, { maxTurns: 20 });
  } catch (error: any) {
    console.error('\n❌ Agent execution failed:');
    console.error(error.message || String(error));
    if (VERBOSE && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  if (VERBOSE) {
    console.log(`\n⏱️  Agent completed in ${duration}s`);
  }

  console.log('\n📋 Agent Result:');
  console.log('─'.repeat(60));
  console.log(result.finalOutput);
  console.log('─'.repeat(60));

  // Verify data was created
  console.log('\n🔍 Verifying MCP server data...\n');
  
  try {
    // Check tasks
    const tasks = await taskService.queryTasks(TEST_PROJECT, {});
    console.log(`✅ Found ${tasks.length} task(s) in project "${TEST_PROJECT}"`);
    
    if (VERBOSE) {
      console.log('\n📋 Tasks:');
      tasks.forEach(task => {
        console.log(`   - [${task.id}] ${task.content} (${task.status}, order: ${task.order})`);
        if (task.parentId) {
          console.log(`     └─ Sub-task of ${task.parentId}`);
        }
      });
    }

    // Check notes
    const notes = await scratchNoteService.queryNotes(TEST_PROJECT, {});
    console.log(`✅ Found ${notes.length} note(s) in project "${TEST_PROJECT}"`);
    
    if (VERBOSE) {
      console.log('\n📝 Notes:');
      notes.forEach(note => {
        console.log(`   - [${note.id}] ${note.content} (completed: ${note.completed})`);
      });
    }

    // Verify we have the expected data
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const completedNotes = notes.filter(n => n.completed);
    const incompleteNotes = notes.filter(n => !n.completed);

    console.log(`\n📊 Task Status Summary:`);
    console.log(`   - Total tasks: ${tasks.length}`);
    console.log(`   - Pending: ${pendingTasks.length}`);
    console.log(`   - In-progress: ${inProgressTasks.length}`);
    console.log(`   - Completed: ${completedTasks.length}`);
    
    console.log(`\n📊 Note Status Summary:`);
    console.log(`   - Total notes: ${notes.length}`);
    console.log(`   - Completed: ${completedNotes.length}`);
    console.log(`   - Incomplete: ${incompleteNotes.length}`);

    // Verify tasks were checked off
    if (completedTasks.length < 3) {
      console.error(`\n❌ Expected at least 3 completed tasks, got ${completedTasks.length}`);
      if (VERBOSE) {
        console.error(`\n   Tasks that should be completed:`);
        tasks.forEach(task => {
          if (task.status !== 'completed' && !task.parentId) {
            console.error(`     - [${task.id}] ${task.content} (status: ${task.status})`);
          }
        });
      }
      process.exit(1);
    }

    // Verify notes were checked off
    if (completedNotes.length < 1) {
      console.error(`\n❌ Expected at least 1 completed note, got ${completedNotes.length}`);
      if (VERBOSE) {
        console.error(`\n   Notes that should be completed:`);
        notes.forEach(note => {
          if (!note.completed) {
            console.error(`     - [${note.id}] ${note.content} (completed: ${note.completed})`);
          }
        });
      }
      process.exit(1);
    }

    if (tasks.length >= 4 && notes.length >= 1) {
      console.log('\n✅ Integration test passed!');
      console.log(`   ✓ Created ${tasks.length} tasks (${completedTasks.length} completed)`);
      console.log(`   ✓ Created ${notes.length} notes (${completedNotes.length} completed)`);
      console.log(`   ✓ All check-off operations verified`);
    } else {
      console.error(`\n❌ Expected at least 4 tasks and 1 note`);
      console.error(`   Got ${tasks.length} tasks and ${notes.length} notes`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('\n❌ Verification failed:');
    console.error(error.message);
    if (error.stack && VERBOSE) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the test
runIntegrationTest().catch((error) => {
  console.error('❌ Integration test failed:', error);
  if (VERBOSE && error.stack) {
    console.error('\nStack trace:');
    console.error(error.stack);
  }
  process.exit(1);
});

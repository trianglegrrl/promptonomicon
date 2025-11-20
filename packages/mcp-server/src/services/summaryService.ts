import type { TaskService } from './taskService.js';
import type { ScratchNoteService } from './scratchNoteService.js';
import type { Task, Status, ScratchNote } from '../models.js';
import { getTaskDepth } from '../utils/hierarchy.js';

export interface SummaryOptions {
  status?: Status;
  includeSubtasks?: boolean;
  onlySubtasks?: boolean;
  includeCompleted?: boolean;
  collapseCompleted?: boolean;
  groupBy?: 'status' | 'hierarchy';
}

/**
 * Service for generating markdown summaries of tasks and notes
 */
export class SummaryService {
  constructor(
    private taskService: TaskService,
    private noteService: ScratchNoteService
  ) {}

  /**
   * Generate a markdown summary of tasks and scratch notes
   */
  async generateSummary(
    projectName: string,
    options: SummaryOptions = {}
  ): Promise<string> {
    const {
      status,
      includeSubtasks = true,
      onlySubtasks = false,
      includeCompleted = true,
      collapseCompleted = true,
      groupBy = 'status',
    } = options;

    // Fetch all tasks and notes
    const allTasks = await this.taskService.queryTasks(projectName, {});
    const allNotes = await this.noteService.queryNotes(projectName, {});

    // Filter tasks based on options
    let tasks = allTasks;

    // Apply status filter
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    // Apply hierarchy filters
    if (onlySubtasks) {
      tasks = tasks.filter(t => t.parentId !== undefined);
    } else if (!includeSubtasks) {
      tasks = tasks.filter(t => t.parentId === undefined);
    }

    // Filter by completion
    if (!includeCompleted) {
      tasks = tasks.filter(t => t.status !== 'completed');
    }

    // Filter notes by completion
    let notes = allNotes;
    if (!includeCompleted) {
      notes = notes.filter(n => !n.completed);
    }

    // Build markdown
    const lines: string[] = [];

    // Header
    lines.push(`# To-Do Summary: ${projectName}`);
    lines.push('');

    // Statistics
    const taskCount = tasks.length;
    const noteCount = notes.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;

    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Total Tasks**: ${taskCount} (${pendingTasks} pending, ${inProgressTasks} in progress, ${completedTasks} completed)`);
    lines.push(`- **Scratch Notes**: ${noteCount}`);
    lines.push('');

    // Tasks section
    if (tasks.length === 0) {
      lines.push('## Tasks');
      lines.push('');
      lines.push('No tasks found.');
      lines.push('');
    } else {
      if (groupBy === 'status') {
        this.addTasksGroupedByStatus(lines, tasks, collapseCompleted);
      } else {
        this.addTasksGroupedByHierarchy(lines, tasks, collapseCompleted);
      }
    }

    // Notes section
    if (notes.length === 0) {
      lines.push('## Scratch Notes');
      lines.push('');
      lines.push('No scratch notes.');
      lines.push('');
    } else {
      this.addNotesSection(lines, notes, collapseCompleted);
    }

    return lines.join('\n');
  }

  /**
   * Add tasks grouped by status
   */
  private addTasksGroupedByStatus(
    lines: string[],
    tasks: Task[],
    collapseCompleted: boolean
  ): void {
    const pending = tasks.filter(t => t.status === 'pending');
    const inProgress = tasks.filter(t => t.status === 'in-progress');
    const completed = tasks.filter(t => t.status === 'completed');

    lines.push('## Tasks');
    lines.push('');

    // Pending tasks
    if (pending.length > 0) {
      lines.push('### Pending');
      lines.push('');
      this.addTaskList(lines, pending, tasks);
      lines.push('');
    }

    // In Progress tasks
    if (inProgress.length > 0) {
      lines.push('### In Progress');
      lines.push('');
      this.addTaskList(lines, inProgress, tasks);
      lines.push('');
    }

    // Completed tasks
    if (completed.length > 0) {
      if (collapseCompleted) {
        lines.push('<details>');
        lines.push('<summary><strong>Completed</strong> (' + completed.length + ' tasks)</summary>');
        lines.push('');
      } else {
        lines.push('### Completed');
        lines.push('');
      }
      this.addTaskList(lines, completed, tasks);
      if (collapseCompleted) {
        lines.push('');
        lines.push('</details>');
      }
      lines.push('');
    }
  }

  /**
   * Add tasks grouped by hierarchy
   */
  private addTasksGroupedByHierarchy(
    lines: string[],
    tasks: Task[],
    collapseCompleted: boolean
  ): void {
    lines.push('## Tasks');
    lines.push('');

    // Build task tree
    const rootTasks = tasks.filter(t => !t.parentId);
    const taskMap = new Map<string, Task>();
    tasks.forEach(t => taskMap.set(t.id, t));

    if (rootTasks.length === 0) {
      lines.push('No root tasks found.');
      lines.push('');
      return;
    }

    // Sort root tasks by order
    rootTasks.sort((a, b) => a.order - b.order);

    for (const rootTask of rootTasks) {
      this.addTaskWithChildren(lines, rootTask, taskMap, tasks, 0, collapseCompleted);
    }
  }

  /**
   * Add a task and its children recursively
   */
  private addTaskWithChildren(
    lines: string[],
    task: Task,
    taskMap: Map<string, Task>,
    allTasks: Task[],
    depth: number,
    collapseCompleted: boolean
  ): void {
    const indent = '  '.repeat(depth);
    const checkbox = task.status === 'completed' ? '[x]' : '[ ]';
    const taskLine = `${indent}- ${checkbox} **${task.id}**: ${task.content}`;
    
    if (task.description) {
      lines.push(taskLine);
      lines.push(`${indent}  ${task.description}`);
    } else {
      lines.push(taskLine);
    }

    // Add children
    const children = allTasks
      .filter(t => t.parentId === task.id)
      .sort((a, b) => a.order - b.order);

    for (const child of children) {
      this.addTaskWithChildren(lines, child, taskMap, allTasks, depth + 1, collapseCompleted);
    }
  }

  /**
   * Add a list of tasks with their hierarchy
   */
  private addTaskList(lines: string[], taskList: Task[], allTasks: Task[]): void {
    // Build a map for quick lookup
    const taskMap = new Map<string, Task>();
    allTasks.forEach(t => taskMap.set(t.id, t));

    // Sort by order, but maintain hierarchy
    const sortedTasks = this.sortTasksWithHierarchy(taskList, allTasks);

    for (const task of sortedTasks) {
      const depth = getTaskDepth(task.id) - 1;
      const indent = '  '.repeat(depth);
      const checkbox = task.status === 'completed' ? '[x]' : '[ ]';
      const taskLine = `${indent}- ${checkbox} **${task.id}**: ${task.content}`;
      
      if (task.description) {
        lines.push(taskLine);
        lines.push(`${indent}  ${task.description}`);
      } else {
        lines.push(taskLine);
      }
    }
  }

  /**
   * Sort tasks maintaining hierarchy order
   */
  private sortTasksWithHierarchy(tasks: Task[], allTasks: Task[]): Task[] {
    // Separate root and child tasks
    const rootTasks = tasks.filter(t => !t.parentId);
    const childTasks = tasks.filter(t => t.parentId !== undefined);

    // If we only have child tasks (e.g., when onlySubtasks=true), sort and return them directly
    if (rootTasks.length === 0 && childTasks.length > 0) {
      return childTasks.sort((a, b) => {
        // Sort by parent ID first, then by order
        if (a.parentId !== b.parentId) {
          return (a.parentId || '').localeCompare(b.parentId || '');
        }
        return a.order - b.order;
      });
    }

    // Sort root tasks by order
    rootTasks.sort((a, b) => a.order - b.order);

    // Build result with hierarchy
    const result: Task[] = [];
    const taskMap = new Map<string, Task>();
    allTasks.forEach(t => taskMap.set(t.id, t));

    const addTaskAndChildren = (task: Task) => {
      result.push(task);
      // Find and add children
      const children = childTasks
        .filter(t => t.parentId === task.id)
        .sort((a, b) => a.order - b.order);
      children.forEach(child => addTaskAndChildren(child));
    };

    rootTasks.forEach(root => addTaskAndChildren(root));

    return result;
  }

  /**
   * Add notes section
   */
  private addNotesSection(
    lines: string[],
    notes: ScratchNote[],
    collapseCompleted: boolean
  ): void {
    const activeNotes = notes.filter(n => !n.completed);
    const completedNotes = notes.filter(n => n.completed);

    lines.push('## Scratch Notes');
    lines.push('');

    // Active notes
    if (activeNotes.length > 0) {
      lines.push('### Active Notes');
      lines.push('');
      for (const note of activeNotes) {
        lines.push(`- ${note.content || '(empty note)'}`);
      }
      lines.push('');
    }

    // Completed notes
    if (completedNotes.length > 0) {
      if (collapseCompleted) {
        lines.push('<details>');
        lines.push('<summary><strong>Completed Notes</strong> (' + completedNotes.length + ' notes)</summary>');
        lines.push('');
      } else {
        lines.push('### Completed Notes');
        lines.push('');
      }
      for (const note of completedNotes) {
        lines.push(`- ~~${note.content || '(empty note)'}~~`);
      }
      if (collapseCompleted) {
        lines.push('');
        lines.push('</details>');
      }
      lines.push('');
    }
  }
}


import type { Task, Status, ProjectData } from '../models.js';
import type { ProjectStorage } from '../storage.js';
import { generateSubTaskId } from '../utils/hierarchy.js';
import { validateProjectName } from '../utils/validation.js';

export interface CreateTaskParams {
  content: string;
  description?: string;
  status: Status;
  order: number;
  projectName: string;
  parentId?: string;
}

export interface UpdateTaskParams extends Task {}

export interface TaskQueryFilters {
  status?: Status;
  minOrder?: number;
  maxOrder?: number;
  contentSearch?: string;
  parentId?: string;
}

/**
 * Service for managing tasks
 */
export class TaskService {
  constructor(private storage: ProjectStorage) {}

  /**
   * Create a new task
   */
  async createTask(params: CreateTaskParams): Promise<Task> {
    if (!validateProjectName(params.projectName)) {
      throw new Error(`Invalid project name: ${params.projectName}`);
    }

    const projectData = await this.storage.readProjectData(params.projectName);

    // Validate parent if provided
    if (params.parentId) {
      const parent = projectData.tasks.find(t => t.id === params.parentId);
      if (!parent) {
        throw new Error(`Parent task not found: ${params.parentId}`);
      }
    }

    // Generate task ID
    let taskId: string;
    if (params.parentId) {
      // Generate hierarchical ID for sub-task
      const parentSubTasks = projectData.tasks
        .filter(t => t.parentId === params.parentId)
        .map(t => t.order);
      const maxOrder = parentSubTasks.length > 0 ? Math.max(...parentSubTasks) : 0;
      taskId = generateSubTaskId(params.parentId, maxOrder + 1);
    } else {
      // Generate sequential ID for root task
      const rootTasks = projectData.tasks.filter(t => !t.parentId);
      const maxId = rootTasks.length > 0
        ? Math.max(...rootTasks.map(t => parseInt(t.id, 10)))
        : 0;
      taskId = String(maxId + 1);
    }

    // Create task
    const task: Task = {
      id: taskId,
      content: params.content,
      description: params.description,
      status: params.status,
      order: params.order,
      projectName: params.projectName,
      parentId: params.parentId,
      subTasks: [],
    };

    // Update parent's subTasks array if this is a sub-task
    if (params.parentId) {
      const parent = projectData.tasks.find(t => t.id === params.parentId);
      if (parent) {
        parent.subTasks.push(taskId);
      }
    }

    // Add task to project
    projectData.tasks.push(task);

    // Save to storage
    await this.storage.writeProjectData(params.projectName, projectData);

    return task;
  }

  /**
   * Get task by ID
   */
  async getTask(projectName: string, taskId: string): Promise<Task | undefined> {
    if (!validateProjectName(projectName)) {
      throw new Error(`Invalid project name: ${projectName}`);
    }

    const projectData = await this.storage.readProjectData(projectName);
    return projectData.tasks.find(t => t.id === taskId);
  }

  /**
   * Update task
   */
  async updateTask(task: UpdateTaskParams): Promise<Task> {
    if (!validateProjectName(task.projectName)) {
      throw new Error(`Invalid project name: ${task.projectName}`);
    }

    const projectData = await this.storage.readProjectData(task.projectName);
    const index = projectData.tasks.findIndex(t => t.id === task.id);

    if (index === -1) {
      throw new Error(`Task not found: ${task.id}`);
    }

    // Update task
    projectData.tasks[index] = task;

    // Save to storage
    await this.storage.writeProjectData(task.projectName, projectData);

    return task;
  }

  /**
   * Delete task
   */
  async deleteTask(projectName: string, taskId: string): Promise<void> {
    if (!validateProjectName(projectName)) {
      throw new Error(`Invalid project name: ${projectName}`);
    }

    const projectData = await this.storage.readProjectData(projectName);
    const index = projectData.tasks.findIndex(t => t.id === taskId);

    if (index === -1) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const task = projectData.tasks[index];

    // Remove from parent's subTasks if it's a sub-task
    if (task.parentId) {
      const parent = projectData.tasks.find(t => t.id === task.parentId);
      if (parent) {
        parent.subTasks = parent.subTasks.filter(id => id !== taskId);
      }
    }

    // Remove task
    projectData.tasks.splice(index, 1);

    // Save to storage
    await this.storage.writeProjectData(projectName, projectData);
  }

  /**
   * Query tasks with filters
   */
  async queryTasks(projectName: string, filters: TaskQueryFilters): Promise<Task[]> {
    if (!validateProjectName(projectName)) {
      throw new Error(`Invalid project name: ${projectName}`);
    }

    const projectData = await this.storage.readProjectData(projectName);
    let tasks = projectData.tasks;

    // Apply filters
    if (filters.status !== undefined) {
      tasks = tasks.filter(t => t.status === filters.status);
    }

    if (filters.minOrder !== undefined) {
      tasks = tasks.filter(t => t.order >= filters.minOrder!);
    }

    if (filters.maxOrder !== undefined) {
      tasks = tasks.filter(t => t.order <= filters.maxOrder!);
    }

    if (filters.contentSearch) {
      const search = filters.contentSearch.toLowerCase();
      tasks = tasks.filter(t =>
        t.content.toLowerCase().includes(search) ||
        (t.description && t.description.toLowerCase().includes(search))
      );
    }

    if (filters.parentId !== undefined) {
      tasks = tasks.filter(t => t.parentId === filters.parentId);
    }

    return tasks;
  }
}


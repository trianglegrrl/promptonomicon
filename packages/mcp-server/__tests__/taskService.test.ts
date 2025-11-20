import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { TaskService } from '../src/services/taskService.js';
import { ProjectStorage } from '../src/storage.js';
import type { Task } from '../src/models.js';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

describe('TaskService', () => {
  const testDataDir = path.join(process.cwd(), '.test-promptonomicon');
  let storage: ProjectStorage;
  let taskService: TaskService;

  beforeEach(async () => {
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
    await fs.mkdir(testDataDir, { recursive: true });
    storage = new ProjectStorage(testDataDir);
    taskService = new TaskService(storage);
  });

  afterEach(async () => {
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
  });

  describe('createTask', () => {
    test('should create task successfully', async () => {
      const task = await taskService.createTask({
        content: 'Test task',
        description: 'Test description',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      expect(task.id).toBe('1');
      expect(task.content).toBe('Test task');
      expect(task.status).toBe('pending');
    });

    test('should generate sequential IDs', async () => {
      const task1 = await taskService.createTask({
        content: 'Task 1',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      const task2 = await taskService.createTask({
        content: 'Task 2',
        status: 'pending',
        order: 2,
        projectName: 'test-project',
      });

      expect(task1.id).toBe('1');
      expect(task2.id).toBe('2');
    });

    test('should create sub-task with hierarchical ID', async () => {
      const parent = await taskService.createTask({
        content: 'Parent task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      const subTask = await taskService.createTask({
        content: 'Sub task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: parent.id,
      });

      expect(subTask.id).toBe('1.1');
      expect(subTask.parentId).toBe('1');
    });

    test('should throw error if parent task not found', async () => {
      await expect(
        taskService.createTask({
          content: 'Sub task',
          status: 'pending',
          order: 1,
          projectName: 'test-project',
          parentId: '999',
        })
      ).rejects.toThrow('Parent task not found');
    });

    test('should validate project name', async () => {
      await expect(
        taskService.createTask({
          content: 'Test',
          status: 'pending',
          order: 1,
          projectName: '../invalid',
        })
      ).rejects.toThrow();
    });
  });

  describe('getTask', () => {
    test('should get task by ID', async () => {
      const created = await taskService.createTask({
        content: 'Test task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      const task = await taskService.getTask('test-project', created.id);
      expect(task).toBeDefined();
      expect(task?.id).toBe(created.id);
      expect(task?.content).toBe('Test task');
    });

    test('should return undefined if task not found', async () => {
      const task = await taskService.getTask('test-project', '999');
      expect(task).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    test('should update task successfully', async () => {
      const created = await taskService.createTask({
        content: 'Original',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      const updated = await taskService.updateTask({
        ...created,
        content: 'Updated',
        status: 'in-progress',
      });

      expect(updated.content).toBe('Updated');
      expect(updated.status).toBe('in-progress');
    });

    test('should throw error if task not found', async () => {
      const task: Task = {
        id: '999',
        content: 'Test',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        subTasks: [],
      };

      await expect(taskService.updateTask(task)).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    test('should delete task successfully', async () => {
      const created = await taskService.createTask({
        content: 'Test task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.deleteTask('test-project', created.id);
      const task = await taskService.getTask('test-project', created.id);
      expect(task).toBeUndefined();
    });

    test('should throw error if task not found', async () => {
      await expect(taskService.deleteTask('test-project', '999')).rejects.toThrow(
        'Task not found'
      );
    });
  });

  describe('queryTasks', () => {
    beforeEach(async () => {
      // Create test tasks
      await taskService.createTask({
        content: 'Pending task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'In progress task',
        status: 'in-progress',
        order: 2,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'Completed task',
        status: 'completed',
        order: 3,
        projectName: 'test-project',
      });
    });

    test('should query all tasks by project', async () => {
      const tasks = await taskService.queryTasks('test-project', {});
      expect(tasks).toHaveLength(3);
    });

    test('should filter by status', async () => {
      const tasks = await taskService.queryTasks('test-project', { status: 'pending' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].status).toBe('pending');
    });

    test('should filter by order range', async () => {
      const tasks = await taskService.queryTasks('test-project', { minOrder: 2, maxOrder: 3 });
      expect(tasks).toHaveLength(2);
    });

    test('should filter by content search', async () => {
      const tasks = await taskService.queryTasks('test-project', { contentSearch: 'Pending' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].content).toContain('Pending');
    });
  });
});


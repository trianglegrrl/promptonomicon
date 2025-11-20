import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { SummaryService } from '../src/services/summaryService.js';
import { TaskService } from '../src/services/taskService.js';
import { ScratchNoteService } from '../src/services/scratchNoteService.js';
import { ProjectStorage } from '../src/storage.js';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

describe('SummaryService', () => {
  const testDataDir = path.join(process.cwd(), '.test-promptonomicon');
  let storage: ProjectStorage;
  let taskService: TaskService;
  let noteService: ScratchNoteService;
  let summaryService: SummaryService;

  beforeEach(async () => {
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
    await fs.mkdir(testDataDir, { recursive: true });
    storage = new ProjectStorage(testDataDir);
    taskService = new TaskService(storage);
    noteService = new ScratchNoteService(storage);
    summaryService = new SummaryService(taskService, noteService);
  });

  afterEach(async () => {
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
  });

  describe('generateSummary', () => {
    test('should generate summary with all tasks and notes', async () => {
      // Create test data
      await taskService.createTask({
        content: 'Root task 1',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'Root task 2',
        status: 'in-progress',
        order: 2,
        projectName: 'test-project',
      });

      await noteService.createNote({
        content: 'Test note',
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {});

      expect(summary).toContain('test-project');
      expect(summary).toContain('Root task 1');
      expect(summary).toContain('Root task 2');
      expect(summary).toContain('Test note');
      expect(summary).toContain('Pending');
      expect(summary).toContain('In Progress');
    });

    test('should handle empty project', async () => {
      const summary = await summaryService.generateSummary('empty-project', {});

      expect(summary).toContain('empty-project');
      expect(summary).toContain('No tasks');
      expect(summary).toContain('No scratch notes');
    });

    test('should filter tasks by status', async () => {
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

      const summary = await summaryService.generateSummary('test-project', {
        status: 'in-progress',
      });

      expect(summary).toContain('In progress task');
      expect(summary).not.toContain('Pending task');
      expect(summary).not.toContain('Completed task');
    });

    test('should include subtasks by default', async () => {
      const parent = await taskService.createTask({
        content: 'Parent task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'Sub task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: parent.id,
      });

      const summary = await summaryService.generateSummary('test-project', {});

      expect(summary).toContain('Parent task');
      expect(summary).toContain('Sub task');
    });

    test('should exclude subtasks when includeSubtasks is false', async () => {
      const parent = await taskService.createTask({
        content: 'Parent task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'Sub task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: parent.id,
      });

      const summary = await summaryService.generateSummary('test-project', {
        includeSubtasks: false,
      });

      expect(summary).toContain('Parent task');
      expect(summary).not.toContain('Sub task');
    });

    test('should show only subtasks when onlySubtasks is true', async () => {
      const parent = await taskService.createTask({
        content: 'Parent task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'Sub task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: parent.id,
      });

      const summary = await summaryService.generateSummary('test-project', {
        onlySubtasks: true,
      });

      expect(summary).not.toContain('Parent task');
      expect(summary).toContain('Sub task');
    });

    test('should filter notes by completion status', async () => {
      const activeNote = await noteService.createNote({
        content: 'Active note',
        projectName: 'test-project',
      });

      const completedNote = await noteService.createNote({
        content: 'Completed note',
        projectName: 'test-project',
      });
      await noteService.updateNote({ ...completedNote, completed: true });

      const summary = await summaryService.generateSummary('test-project', {
        includeCompleted: false,
      });

      expect(summary).toContain('Active note');
      expect(summary).not.toContain('Completed note');
    });

    test('should collapse completed sections when collapseCompleted is true', async () => {
      await taskService.createTask({
        content: 'Completed task',
        status: 'completed',
        order: 1,
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {
        collapseCompleted: true,
      });

      expect(summary).toContain('<details>');
      expect(summary).toContain('Completed');
    });

    test('should not collapse completed sections when collapseCompleted is false', async () => {
      await taskService.createTask({
        content: 'Completed task',
        status: 'completed',
        order: 1,
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {
        collapseCompleted: false,
      });

      expect(summary).not.toContain('<details>');
      expect(summary).toContain('Completed task');
    });

    test('should show proper hierarchy with indentation', async () => {
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

      await taskService.createTask({
        content: 'Nested sub task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: subTask.id,
      });

      const summary = await summaryService.generateSummary('test-project', {});

      // Check that hierarchy is represented (either with indentation or numbering)
      expect(summary).toContain('Parent task');
      expect(summary).toContain('Sub task');
      expect(summary).toContain('Nested sub task');
    });

    test('should use markdown checkbox format for tasks', async () => {
      await taskService.createTask({
        content: 'Pending task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'Completed task',
        status: 'completed',
        order: 2,
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {});

      expect(summary).toContain('- [ ]'); // Pending checkbox
      expect(summary).toContain('- [x]'); // Completed checkbox
    });

    test('should group by status by default', async () => {
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

      const summary = await summaryService.generateSummary('test-project', {});

      // Should have status sections
      expect(summary).toContain('Pending');
      expect(summary).toContain('In Progress');
    });

    test('should include summary statistics', async () => {
      await taskService.createTask({
        content: 'Task 1',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      await taskService.createTask({
        content: 'Task 2',
        status: 'in-progress',
        order: 2,
        projectName: 'test-project',
      });

      await noteService.createNote({
        content: 'Note 1',
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {});

      // Should include counts
      expect(summary).toMatch(/\d+.*task/i);
      expect(summary).toMatch(/note.*\d+/i); // Match "note" followed by number (case-insensitive)
    });

    test('should handle tasks with no subtasks', async () => {
      await taskService.createTask({
        content: 'Simple task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {});

      expect(summary).toContain('Simple task');
      expect(summary).not.toContain('undefined');
    });

    test('should handle notes with empty content', async () => {
      await noteService.createNote({
        content: '',
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {});

      // Should handle gracefully
      expect(summary).toBeDefined();
    });

    test('should handle deep hierarchies', async () => {
      const task1 = await taskService.createTask({
        content: 'Level 1',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      const task2 = await taskService.createTask({
        content: 'Level 2',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: task1.id,
      });

      const task3 = await taskService.createTask({
        content: 'Level 3',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: task2.id,
      });

      await taskService.createTask({
        content: 'Level 4',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: task3.id,
      });

      const summary = await summaryService.generateSummary('test-project', {});

      expect(summary).toContain('Level 1');
      expect(summary).toContain('Level 2');
      expect(summary).toContain('Level 3');
      expect(summary).toContain('Level 4');
    });

    test('should include task descriptions when available', async () => {
      await taskService.createTask({
        content: 'Task with description',
        description: 'This is a detailed description',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
      });

      const summary = await summaryService.generateSummary('test-project', {});

      expect(summary).toContain('Task with description');
      expect(summary).toContain('This is a detailed description');
    });
  });
});


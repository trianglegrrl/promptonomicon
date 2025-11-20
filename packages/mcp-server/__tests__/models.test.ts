import { describe, test, expect } from '@jest/globals';
import type { Task, ScratchNote, Status, ProjectData } from '../src/models.js';

describe('Models', () => {
  describe('Task', () => {
    test('should have required properties', () => {
      const task: Task = {
        id: '1',
        content: 'Test task',
        description: 'Test description',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: undefined,
        subTasks: [],
      };

      expect(task.id).toBe('1');
      expect(task.content).toBe('Test task');
      expect(task.status).toBe('pending');
      expect(task.order).toBe(1);
      expect(task.projectName).toBe('test-project');
    });

    test('should support hierarchical IDs', () => {
      const parentTask: Task = {
        id: '1',
        content: 'Parent task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        subTasks: ['1.1', '1.2'],
      };

      const subTask: Task = {
        id: '1.1',
        content: 'Sub task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: '1',
        subTasks: [],
      };

      expect(parentTask.subTasks).toContain('1.1');
      expect(subTask.parentId).toBe('1');
    });

    test('should support deep hierarchies', () => {
      const deepTask: Task = {
        id: '2.1.1.1.1',
        content: 'Deep task',
        status: 'pending',
        order: 1,
        projectName: 'test-project',
        parentId: '2.1.1.1',
        subTasks: [],
      };

      expect(deepTask.id).toBe('2.1.1.1.1');
      expect(deepTask.parentId).toBe('2.1.1.1');
    });
  });

  describe('ScratchNote', () => {
    test('should have required properties', () => {
      const note: ScratchNote = {
        id: 'note-1',
        content: 'Test note',
        projectName: 'test-project',
        completed: false,
        createdAt: new Date().toISOString(),
      };

      expect(note.id).toBe('note-1');
      expect(note.content).toBe('Test note');
      expect(note.completed).toBe(false);
      expect(note.projectName).toBe('test-project');
    });

    test('should support completed status', () => {
      const completedNote: ScratchNote = {
        id: 'note-2',
        content: 'Completed note',
        projectName: 'test-project',
        completed: true,
        createdAt: new Date().toISOString(),
      };

      expect(completedNote.completed).toBe(true);
    });
  });

  describe('Status', () => {
    test('should support all status values', () => {
      const statuses: Status[] = ['pending', 'in-progress', 'completed'];
      
      expect(statuses).toContain('pending');
      expect(statuses).toContain('in-progress');
      expect(statuses).toContain('completed');
    });
  });

  describe('ProjectData', () => {
    test('should contain tasks and scratch notes', () => {
      const projectData: ProjectData = {
        tasks: [],
        scratchNotes: [],
      };

      expect(projectData.tasks).toEqual([]);
      expect(projectData.scratchNotes).toEqual([]);
    });

    test('should support multiple tasks and notes', () => {
      const projectData: ProjectData = {
        tasks: [
          {
            id: '1',
            content: 'Task 1',
            status: 'pending',
            order: 1,
            projectName: 'test-project',
            subTasks: [],
          },
        ],
        scratchNotes: [
          {
            id: 'note-1',
            content: 'Note 1',
            projectName: 'test-project',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      expect(projectData.tasks).toHaveLength(1);
      expect(projectData.scratchNotes).toHaveLength(1);
    });
  });
});


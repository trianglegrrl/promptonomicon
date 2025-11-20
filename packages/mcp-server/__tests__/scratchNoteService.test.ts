import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { ScratchNoteService } from '../src/services/scratchNoteService.js';
import { ProjectStorage } from '../src/storage.js';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

describe('ScratchNoteService', () => {
  const testDataDir = path.join(process.cwd(), '.test-promptonomicon');
  let storage: ProjectStorage;
  let noteService: ScratchNoteService;

  beforeEach(async () => {
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
    await fs.mkdir(testDataDir, { recursive: true });
    storage = new ProjectStorage(testDataDir);
    noteService = new ScratchNoteService(storage);
  });

  afterEach(async () => {
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
  });

  describe('createNote', () => {
    test('should create note successfully', async () => {
      const note = await noteService.createNote({
        content: 'Test note',
        projectName: 'test-project',
      });

      expect(note.id).toBeDefined();
      expect(note.content).toBe('Test note');
      expect(note.completed).toBe(false);
      expect(note.createdAt).toBeDefined();
    });

    test('should validate project name', async () => {
      await expect(
        noteService.createNote({
          content: 'Test',
          projectName: '../invalid',
        })
      ).rejects.toThrow();
    });
  });

  describe('getNote', () => {
    test('should get note by ID', async () => {
      const created = await noteService.createNote({
        content: 'Test note',
        projectName: 'test-project',
      });

      const note = await noteService.getNote('test-project', created.id);
      expect(note).toBeDefined();
      expect(note?.id).toBe(created.id);
      expect(note?.content).toBe('Test note');
    });

    test('should return undefined if note not found', async () => {
      const note = await noteService.getNote('test-project', 'non-existent');
      expect(note).toBeUndefined();
    });
  });

  describe('updateNote', () => {
    test('should update note successfully', async () => {
      const created = await noteService.createNote({
        content: 'Original',
        projectName: 'test-project',
      });

      const updated = await noteService.updateNote({
        ...created,
        content: 'Updated',
        completed: true,
      });

      expect(updated.content).toBe('Updated');
      expect(updated.completed).toBe(true);
    });

    test('should throw error if note not found', async () => {
      const note = {
        id: 'non-existent',
        content: 'Test',
        projectName: 'test-project',
        completed: false,
        createdAt: new Date().toISOString(),
      };

      await expect(noteService.updateNote(note)).rejects.toThrow('Note not found');
    });
  });

  describe('deleteNote', () => {
    test('should delete note successfully', async () => {
      const created = await noteService.createNote({
        content: 'Test note',
        projectName: 'test-project',
      });

      await noteService.deleteNote('test-project', created.id);
      const note = await noteService.getNote('test-project', created.id);
      expect(note).toBeUndefined();
    });

    test('should throw error if note not found', async () => {
      await expect(noteService.deleteNote('test-project', 'non-existent')).rejects.toThrow(
        'Note not found'
      );
    });
  });

  describe('queryNotes', () => {
    beforeEach(async () => {
      await noteService.createNote({
        content: 'Pending note',
        projectName: 'test-project',
      });

      const completed = await noteService.createNote({
        content: 'Completed note',
        projectName: 'test-project',
      });
      await noteService.updateNote({ ...completed, completed: true });
    });

    test('should query all notes by project', async () => {
      const notes = await noteService.queryNotes('test-project', {});
      expect(notes).toHaveLength(2);
    });

    test('should filter by completion status', async () => {
      const completed = await noteService.queryNotes('test-project', { completed: true });
      expect(completed).toHaveLength(1);
      expect(completed[0].completed).toBe(true);
    });

    test('should filter by incomplete status', async () => {
      const incomplete = await noteService.queryNotes('test-project', { completed: false });
      expect(incomplete).toHaveLength(1);
      expect(incomplete[0].completed).toBe(false);
    });
  });
});


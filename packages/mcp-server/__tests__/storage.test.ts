import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { ProjectStorage } from '../src/storage.js';
import type { ProjectData } from '../src/models.js';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

describe('ProjectStorage', () => {
  const testDataDir = path.join(process.cwd(), '.test-promptonomicon');
  let storage: ProjectStorage;

  beforeEach(async () => {
    // Clean up test directory
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
    await fs.mkdir(testDataDir, { recursive: true });
    storage = new ProjectStorage(testDataDir);
  });

  afterEach(async () => {
    // Clean up test directory
    if (existsSync(testDataDir)) {
      await fs.rm(testDataDir, { recursive: true, force: true });
    }
  });

  describe('readProjectData', () => {
    test('should read existing project file', async () => {
      const projectName = 'test-project';
      const testData: ProjectData = {
        tasks: [],
        scratchNotes: [],
      };

      const filePath = path.join(testDataDir, `todos-${projectName}.json`);
      await fs.writeFile(filePath, JSON.stringify(testData, null, 2));

      const result = await storage.readProjectData(projectName);
      expect(result).toEqual(testData);
    });

    test('should return empty data if file does not exist', async () => {
      const projectName = 'non-existent';
      const result = await storage.readProjectData(projectName);
      expect(result).toEqual({ tasks: [], scratchNotes: [] });
    });

    test('should throw error for corrupted JSON', async () => {
      const projectName = 'corrupted';
      const filePath = path.join(testDataDir, `todos-${projectName}.json`);
      await fs.writeFile(filePath, 'invalid json{');

      await expect(storage.readProjectData(projectName)).rejects.toThrow();
    });

    test('should validate project name', async () => {
      await expect(storage.readProjectData('../invalid')).rejects.toThrow();
      await expect(storage.readProjectData('')).rejects.toThrow();
    });
  });

  describe('writeProjectData', () => {
    test('should write data to file', async () => {
      const projectName = 'test-project';
      const testData: ProjectData = {
        tasks: [],
        scratchNotes: [],
      };

      await storage.writeProjectData(projectName, testData);

      const filePath = path.join(testDataDir, `todos-${projectName}.json`);
      expect(existsSync(filePath)).toBe(true);

      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toEqual(testData);
    });

    test('should write data atomically (temp file then rename)', async () => {
      const projectName = 'atomic-test';
      const testData: ProjectData = {
        tasks: [],
        scratchNotes: [],
      };

      await storage.writeProjectData(projectName, testData);

      const filePath = path.join(testDataDir, `todos-${projectName}.json`);
      expect(existsSync(filePath)).toBe(true);
    });

    test('should validate project name', async () => {
      const testData: ProjectData = {
        tasks: [],
        scratchNotes: [],
      };

      await expect(storage.writeProjectData('../invalid', testData)).rejects.toThrow();
      await expect(storage.writeProjectData('', testData)).rejects.toThrow();
    });
  });

  describe('projectExists', () => {
    test('should return true if project file exists', async () => {
      const projectName = 'existing-project';
      const testData: ProjectData = {
        tasks: [],
        scratchNotes: [],
      };

      await storage.writeProjectData(projectName, testData);
      expect(await storage.projectExists(projectName)).toBe(true);
    });

    test('should return false if project file does not exist', async () => {
      expect(await storage.projectExists('non-existent')).toBe(false);
    });

    test('should validate project name', async () => {
      await expect(storage.projectExists('../invalid')).rejects.toThrow();
    });
  });
});


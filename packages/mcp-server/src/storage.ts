import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import type { ProjectData } from './models.js';
import { validateProjectName } from './utils/validation.js';

/**
 * File-based storage for project data
 */
export class ProjectStorage {
  private dataDir: string;

  constructor(dataDir: string = '.promptonomicon') {
    this.dataDir = dataDir;
  }

  /**
   * Get file path for a project
   */
  private getProjectFilePath(projectName: string): string {
    if (!validateProjectName(projectName)) {
      throw new Error(`Invalid project name: ${projectName}`);
    }
    return path.join(this.dataDir, `todos-${projectName}.json`);
  }

  /**
   * Read project data from file
   */
  async readProjectData(projectName: string): Promise<ProjectData> {
    const filePath = this.getProjectFilePath(projectName);

    if (!existsSync(filePath)) {
      return { tasks: [], scratchNotes: [] };
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as ProjectData;

      // Validate structure
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error(`Invalid project data structure: tasks must be an array`);
      }
      if (!data.scratchNotes || !Array.isArray(data.scratchNotes)) {
        throw new Error(`Invalid project data structure: scratchNotes must be an array`);
      }

      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse project data file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Write project data to file (atomically)
   */
  async writeProjectData(projectName: string, data: ProjectData): Promise<void> {
    const filePath = this.getProjectFilePath(projectName);
    const tempFilePath = `${filePath}.tmp`;

    // Ensure directory exists
    await fs.mkdir(this.dataDir, { recursive: true });

    try {
      // Write to temp file first
      await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), 'utf-8');

      // Atomic rename
      await fs.rename(tempFilePath, filePath);
    } catch (error) {
      // Clean up temp file on error
      if (existsSync(tempFilePath)) {
        await fs.unlink(tempFilePath).catch(() => {
          // Ignore cleanup errors
        });
      }
      throw error;
    }
  }

  /**
   * Check if project file exists
   */
  async projectExists(projectName: string): Promise<boolean> {
    const filePath = this.getProjectFilePath(projectName);
    return existsSync(filePath);
  }
}


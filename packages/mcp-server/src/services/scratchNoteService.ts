import type { ScratchNote, ProjectData } from '../models.js';
import type { ProjectStorage } from '../storage.js';
import { validateProjectName } from '../utils/validation.js';

export interface CreateNoteParams {
  content: string;
  projectName: string;
}

export interface UpdateNoteParams extends ScratchNote {}

export interface NoteQueryFilters {
  completed?: boolean;
}

/**
 * Service for managing scratch notes
 */
export class ScratchNoteService {
  constructor(private storage: ProjectStorage) {}

  /**
   * Create a new scratch note
   */
  async createNote(params: CreateNoteParams): Promise<ScratchNote> {
    if (!validateProjectName(params.projectName)) {
      throw new Error(`Invalid project name: ${params.projectName}`);
    }

    const projectData = await this.storage.readProjectData(params.projectName);

    // Generate note ID
    const maxId = projectData.scratchNotes.length > 0
      ? Math.max(...projectData.scratchNotes.map(n => {
          const match = n.id.match(/^note-(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        }))
      : 0;
    const noteId = `note-${maxId + 1}`;

    // Create note
    const note: ScratchNote = {
      id: noteId,
      content: params.content,
      projectName: params.projectName,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Add note to project
    projectData.scratchNotes.push(note);

    // Save to storage
    await this.storage.writeProjectData(params.projectName, projectData);

    return note;
  }

  /**
   * Get note by ID
   */
  async getNote(projectName: string, noteId: string): Promise<ScratchNote | undefined> {
    if (!validateProjectName(projectName)) {
      throw new Error(`Invalid project name: ${projectName}`);
    }

    const projectData = await this.storage.readProjectData(projectName);
    return projectData.scratchNotes.find(n => n.id === noteId);
  }

  /**
   * Update note
   */
  async updateNote(note: UpdateNoteParams): Promise<ScratchNote> {
    if (!validateProjectName(note.projectName)) {
      throw new Error(`Invalid project name: ${note.projectName}`);
    }

    const projectData = await this.storage.readProjectData(note.projectName);
    const index = projectData.scratchNotes.findIndex(n => n.id === note.id);

    if (index === -1) {
      throw new Error(`Note not found: ${note.id}`);
    }

    // Update note
    projectData.scratchNotes[index] = note;

    // Save to storage
    await this.storage.writeProjectData(note.projectName, projectData);

    return note;
  }

  /**
   * Delete note
   */
  async deleteNote(projectName: string, noteId: string): Promise<void> {
    if (!validateProjectName(projectName)) {
      throw new Error(`Invalid project name: ${projectName}`);
    }

    const projectData = await this.storage.readProjectData(projectName);
    const index = projectData.scratchNotes.findIndex(n => n.id === noteId);

    if (index === -1) {
      throw new Error(`Note not found: ${noteId}`);
    }

    // Remove note
    projectData.scratchNotes.splice(index, 1);

    // Save to storage
    await this.storage.writeProjectData(projectName, projectData);
  }

  /**
   * Query notes with filters
   */
  async queryNotes(projectName: string, filters: NoteQueryFilters): Promise<ScratchNote[]> {
    if (!validateProjectName(projectName)) {
      throw new Error(`Invalid project name: ${projectName}`);
    }

    const projectData = await this.storage.readProjectData(projectName);
    let notes = projectData.scratchNotes;

    // Apply filters
    if (filters.completed !== undefined) {
      notes = notes.filter(n => n.completed === filters.completed);
    }

    return notes;
  }
}


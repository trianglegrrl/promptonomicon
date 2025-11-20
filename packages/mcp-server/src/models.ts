/**
 * Task status enumeration
 */
export type Status = 'pending' | 'in-progress' | 'completed';

/**
 * Task model
 */
export interface Task {
  id: string;
  content: string;
  description?: string;
  status: Status;
  order: number;
  projectName: string;
  parentId?: string;
  subTasks: string[];
}

/**
 * Scratch note model
 */
export interface ScratchNote {
  id: string;
  content: string;
  projectName: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Project data structure (stored in JSON file)
 */
export interface ProjectData {
  tasks: Task[];
  scratchNotes: ScratchNote[];
}


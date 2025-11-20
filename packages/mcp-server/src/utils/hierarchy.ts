import { validateTaskId } from './validation.js';

/**
 * Generate hierarchical sub-task ID from parent ID and order
 */
export function generateSubTaskId(parentId: string, order: number): string {
  if (!validateTaskId(parentId)) {
    throw new Error(`Invalid parent task ID: ${parentId}`);
  }

  if (order < 1) {
    throw new Error(`Order must be positive, got ${order}`);
  }

  return `${parentId}.${order}`;
}

/**
 * Parse hierarchical task ID into parts
 */
export function parseTaskId(id: string): number[] {
  if (!validateTaskId(id)) {
    throw new Error(`Invalid task ID: ${id}`);
  }

  return id.split('.').map(part => parseInt(part, 10));
}

/**
 * Get parent ID from hierarchical task ID
 */
export function getParentId(id: string): string | undefined {
  if (!validateTaskId(id)) {
    throw new Error(`Invalid task ID: ${id}`);
  }

  const parts = id.split('.');
  if (parts.length <= 1) {
    return undefined; // Root level task
  }

  return parts.slice(0, -1).join('.');
}

/**
 * Get depth of hierarchical task ID
 */
export function getTaskDepth(id: string): number {
  if (!validateTaskId(id)) {
    throw new Error(`Invalid task ID: ${id}`);
  }

  return id.split('.').length;
}


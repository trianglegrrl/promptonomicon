import type { Status } from '../models.js';

/**
 * Validate project name (alphanumeric, hyphens, underscores only)
 */
export function validateProjectName(name: string): boolean {
  if (!name || name.length === 0) {
    return false;
  }

  // Prevent path traversal attempts
  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    return false;
  }

  // Allow alphanumeric, hyphens, and underscores only
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(name);
}

/**
 * Sanitize project name to prevent path traversal and invalid characters
 */
export function sanitizeProjectName(name: string): string {
  if (!name) {
    return '';
  }

  // Remove path traversal attempts
  let sanitized = name.replace(/\.\./g, '').replace(/[\/\\]/g, '');

  // Replace invalid characters with hyphens
  sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '-');

  // Remove consecutive hyphens
  sanitized = sanitized.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  sanitized = sanitized.replace(/^-+|-+$/g, '');

  return sanitized;
}

/**
 * Validate task ID format (numeric or hierarchical like 1.1, 2.1.1)
 */
export function validateTaskId(id: string): boolean {
  if (!id || id.length === 0) {
    return false;
  }

  // Must be numeric segments separated by dots
  // Examples: "1", "1.1", "2.1.1"
  const validPattern = /^\d+(\.\d+)*$/;
  return validPattern.test(id);
}

/**
 * Validate status enum value
 */
export function validateStatus(status: string): status is Status {
  return status === 'pending' || status === 'in-progress' || status === 'completed';
}


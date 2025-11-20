import { describe, test, expect } from '@jest/globals';
import {
  validateProjectName,
  sanitizeProjectName,
  validateTaskId,
  validateStatus,
} from '../src/utils/validation.js';

describe('Validation', () => {
  describe('validateProjectName', () => {
    test('should accept alphanumeric names', () => {
      expect(validateProjectName('testproject')).toBe(true);
      expect(validateProjectName('test123')).toBe(true);
      expect(validateProjectName('TestProject')).toBe(true);
    });

    test('should accept names with hyphens and underscores', () => {
      expect(validateProjectName('test-project')).toBe(true);
      expect(validateProjectName('test_project')).toBe(true);
      expect(validateProjectName('test-project_123')).toBe(true);
    });

    test('should reject names with spaces', () => {
      expect(validateProjectName('test project')).toBe(false);
      expect(validateProjectName('test project 123')).toBe(false);
    });

    test('should reject names with special characters', () => {
      expect(validateProjectName('test@project')).toBe(false);
      expect(validateProjectName('test.project')).toBe(false);
      expect(validateProjectName('test/project')).toBe(false);
      expect(validateProjectName('test..project')).toBe(false);
    });

    test('should reject empty names', () => {
      expect(validateProjectName('')).toBe(false);
    });

    test('should reject names with path traversal attempts', () => {
      expect(validateProjectName('../test')).toBe(false);
      expect(validateProjectName('..\\test')).toBe(false);
      expect(validateProjectName('/etc/passwd')).toBe(false);
    });
  });

  describe('sanitizeProjectName', () => {
    test('should sanitize invalid characters', () => {
      expect(sanitizeProjectName('test-project')).toBe('test-project');
      expect(sanitizeProjectName('test project')).toBe('test-project');
      expect(sanitizeProjectName('test@project')).toBe('test-project'); // @ becomes -
    });

    test('should prevent path traversal', () => {
      expect(sanitizeProjectName('../test')).toBe('test');
      expect(sanitizeProjectName('..\\test')).toBe('test');
      expect(sanitizeProjectName('/etc/passwd')).toBe('etcpasswd');
    });

    test('should handle empty strings', () => {
      expect(sanitizeProjectName('')).toBe('');
    });
  });

  describe('validateTaskId', () => {
    test('should accept simple numeric IDs', () => {
      expect(validateTaskId('1')).toBe(true);
      expect(validateTaskId('123')).toBe(true);
    });

    test('should accept hierarchical IDs', () => {
      expect(validateTaskId('1.1')).toBe(true);
      expect(validateTaskId('2.1.1')).toBe(true);
      expect(validateTaskId('2.1.1.1.1')).toBe(true);
    });

    test('should reject invalid formats', () => {
      expect(validateTaskId('')).toBe(false);
      expect(validateTaskId('1.')).toBe(false);
      expect(validateTaskId('.1')).toBe(false);
      expect(validateTaskId('1..1')).toBe(false);
      expect(validateTaskId('a.1')).toBe(false);
      expect(validateTaskId('1.a')).toBe(false);
    });
  });

  describe('validateStatus', () => {
    test('should accept valid statuses', () => {
      expect(validateStatus('pending')).toBe(true);
      expect(validateStatus('in-progress')).toBe(true);
      expect(validateStatus('completed')).toBe(true);
    });

    test('should reject invalid statuses', () => {
      expect(validateStatus('invalid')).toBe(false);
      expect(validateStatus('')).toBe(false);
      expect(validateStatus('PENDING')).toBe(false);
    });
  });
});


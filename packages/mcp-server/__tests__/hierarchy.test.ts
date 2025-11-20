import { describe, test, expect } from '@jest/globals';
import {
  generateSubTaskId,
  parseTaskId,
  getParentId,
  getTaskDepth,
} from '../src/utils/hierarchy.js';

describe('Hierarchy Utilities', () => {
  describe('generateSubTaskId', () => {
    test('should generate sub-task ID from parent', () => {
      expect(generateSubTaskId('1', 1)).toBe('1.1');
      expect(generateSubTaskId('1', 2)).toBe('1.2');
      expect(generateSubTaskId('2.1', 1)).toBe('2.1.1');
      expect(generateSubTaskId('2.1.1', 3)).toBe('2.1.1.3');
    });

    test('should throw error for invalid parent ID', () => {
      expect(() => generateSubTaskId('invalid', 1)).toThrow('Invalid parent task ID');
      expect(() => generateSubTaskId('1.', 1)).toThrow('Invalid parent task ID');
    });

    test('should throw error for invalid order', () => {
      expect(() => generateSubTaskId('1', 0)).toThrow('Order must be positive');
      expect(() => generateSubTaskId('1', -1)).toThrow('Order must be positive');
    });
  });

  describe('parseTaskId', () => {
    test('should parse simple task ID', () => {
      expect(parseTaskId('1')).toEqual([1]);
      expect(parseTaskId('123')).toEqual([123]);
    });

    test('should parse hierarchical task ID', () => {
      expect(parseTaskId('1.1')).toEqual([1, 1]);
      expect(parseTaskId('2.1.1')).toEqual([2, 1, 1]);
      expect(parseTaskId('2.1.1.1.1')).toEqual([2, 1, 1, 1, 1]);
    });

    test('should throw error for invalid task ID', () => {
      expect(() => parseTaskId('invalid')).toThrow('Invalid task ID');
      expect(() => parseTaskId('1.')).toThrow('Invalid task ID');
    });
  });

  describe('getParentId', () => {
    test('should return parent ID for sub-tasks', () => {
      expect(getParentId('1.1')).toBe('1');
      expect(getParentId('2.1.1')).toBe('2.1');
      expect(getParentId('2.1.1.1.1')).toBe('2.1.1.1');
    });

    test('should return undefined for root level tasks', () => {
      expect(getParentId('1')).toBeUndefined();
      expect(getParentId('123')).toBeUndefined();
    });

    test('should throw error for invalid task ID', () => {
      expect(() => getParentId('invalid')).toThrow('Invalid task ID');
    });
  });

  describe('getTaskDepth', () => {
    test('should return depth for root level tasks', () => {
      expect(getTaskDepth('1')).toBe(1);
      expect(getTaskDepth('123')).toBe(1);
    });

    test('should return depth for hierarchical tasks', () => {
      expect(getTaskDepth('1.1')).toBe(2);
      expect(getTaskDepth('2.1.1')).toBe(3);
      expect(getTaskDepth('2.1.1.1.1')).toBe(5);
    });

    test('should throw error for invalid task ID', () => {
      expect(() => getTaskDepth('invalid')).toThrow('Invalid task ID');
    });
  });
});


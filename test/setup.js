// Test setup file
import { jest } from '@jest/globals';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after tests
afterEach(() => {
  // Reset any file system mocks
  jest.restoreAllMocks();
});

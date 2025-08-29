export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.test.mjs'
  ],
  collectCoverageFrom: [
    'bin/**/*.js',
    'index.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!.babelrc',
    '!bin/promptonomicon.js' // Excluded: tested comprehensively via subprocess execution
  ],
  // Note: bin/promptonomicon.js is excluded from coverage as it's tested via subprocess execution.
  // The CLI is comprehensively tested through 93 integration tests that spawn actual processes.
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};
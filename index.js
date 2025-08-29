// Promptonomicon - Main entry point
// This file is the main module entry point when the package is imported
// The CLI functionality is in bin/promptonomicon.js

export const VERSION = '1.1.0';

export const info = {
  name: 'promptonomicon',
  description: 'Transform how you build software with AI through structured, documentation-driven development',
  repository: 'https://github.com/trianglegrrl/promptonomicon',
  documentation: 'https://github.com/trianglegrrl/promptonomicon#readme'
};

// Export template file list for programmatic access
export const templateFiles = [
  '1_BUILD_DESIGN.md',
  '3_BUILD_PLAN.md',
  '4_DEVELOPMENT_PROCESS.md',
  '5_BUILD_IMPLEMENTATION.md',
  '6_DOCUMENTATION_UPDATE.md',
  'PROMPTONOMICON.md',
  'README.md'
];

// Export directory structure for programmatic access
export const directories = [
  '.promptonomicon',
  'ai-docs',
  'ai-docs/ai-design',
  'ai-docs/ai-plans',
  'ai-docs/ai-implementation',
  'ai-docs/features',
  '.scratch'
];

export default {
  VERSION,
  info,
  templateFiles,
  directories
};

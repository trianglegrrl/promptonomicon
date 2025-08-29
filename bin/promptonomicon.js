#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// GitHub repository info
const GITHUB_OWNER = 'trianglegrrl';
const GITHUB_REPO = 'promptonomicon';
const GITHUB_BRANCH = 'main';

// Template files to manage
const TEMPLATE_FILES = [
  '1_BUILD_DESIGN.md',
  '3_BUILD_PLAN.md',
  '4_DEVELOPMENT_PROCESS.md',
  '5_BUILD_IMPLEMENTATION.md',
  '6_DOCUMENTATION_UPDATE.md',
  'PROMPTONOMICON.md',
  'README.md'
];

// Directories to create
const DIRECTORIES = [
  '.promptonomicon',
  'ai-docs',
  'ai-docs/ai-design',
  'ai-docs/ai-plans',
  'ai-docs/ai-implementation',
  'ai-docs/features',
  '.scratch'
];

async function fetchTemplateFile(filename) {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/.promptonomicon/${filename}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${filename}: ${error.message}`);
  }
}

async function ensureDirectories() {
  for (const dir of DIRECTORIES) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function createScratchReadme() {
  const content = `# .scratch Directory

This directory is for temporary work and experiments. Everything here is git-ignored.

## Purpose
- Temporary scripts and experiments
- Work-in-progress documentation
- Test files and playground code

## Key Files
- \`todo.md\` - Track your progress through the 6 phases

## Note
Nothing in this directory will be committed to git (except this README).
`;

  await fs.writeFile('.scratch/README.md', content);
}

async function createGitignoreEntry() {
  const gitignorePath = '.gitignore';
  const scratchEntry = '.scratch/';

  try {
    let content = '';
    if (existsSync(gitignorePath)) {
      content = await fs.readFile(gitignorePath, 'utf-8');
    }

    if (!content.includes(scratchEntry)) {
      content = content.trimEnd() + '\n\n# Promptonomicon scratch directory\n.scratch/\n';
      await fs.writeFile(gitignorePath, content);
    }
  } catch (error) {
    console.warn(chalk.yellow('Warning: Could not update .gitignore'));
  }
}

// Init command
program
  .command('init')
  .description('Initialize Promptonomicon in the current directory')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (options) => {
    const spinner = ora('Initializing Promptonomicon...').start();

    try {
      // Check if already initialized
      if (!options.force && existsSync('.promptonomicon')) {
        spinner.fail('Promptonomicon already initialized. Use --force to overwrite.');
        process.exit(1);
      }

      // Create directories
      spinner.text = 'Creating directory structure...';
      await ensureDirectories();

      // Fetch and write template files
      for (const file of TEMPLATE_FILES) {
        spinner.text = `Fetching ${file}...`;
        const content = await fetchTemplateFile(file);
        await fs.writeFile(path.join('.promptonomicon', file), content);
      }

      // Create scratch README
      spinner.text = 'Creating scratch directory...';
      await createScratchReadme();

      // Update .gitignore
      await createGitignoreEntry();

      spinner.succeed('Promptonomicon initialized successfully!');

      console.log('\n' + chalk.green('✓') + ' Created directories:');
      DIRECTORIES.forEach(dir => console.log('  - ' + chalk.gray(dir)));

      console.log('\n' + chalk.green('✓') + ' Fetched templates:');
      TEMPLATE_FILES.forEach(file => console.log('  - ' + chalk.gray(`.promptonomicon/${file}`)));

      console.log('\n' + chalk.cyan('Next steps:'));
      console.log('  1. Customize the templates in .promptonomicon/ for your project');
      console.log('  2. Tell your AI assistant: "Follow the Promptonomicon process in .promptonomicon/PROMPTONOMICON.md"');

    } catch (error) {
      spinner.fail(`Initialization failed: ${error.message}`);
      process.exit(1);
    }
  });

// Reset command
program
  .command('reset')
  .description('Reset all Promptonomicon templates to latest version (destructive)')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (options) => {
    if (!options.yes) {
      console.log(chalk.yellow('⚠️  Warning: This will overwrite all customizations in .promptonomicon/'));
      console.log('Are you sure you want to continue? (Use --yes to skip this prompt)');
      process.exit(1);
    }

    const spinner = ora('Resetting Promptonomicon templates...').start();

    try {
      // Ensure directories exist
      await fs.mkdir('.promptonomicon', { recursive: true });

      // Fetch and overwrite all template files
      for (const file of TEMPLATE_FILES) {
        spinner.text = `Resetting ${file}...`;
        const content = await fetchTemplateFile(file);
        await fs.writeFile(path.join('.promptonomicon', file), content);
      }

      spinner.succeed('Templates reset to latest version!');

      console.log('\n' + chalk.green('✓') + ' Reset templates:');
      TEMPLATE_FILES.forEach(file => console.log('  - ' + chalk.gray(`.promptonomicon/${file}`)));

    } catch (error) {
      spinner.fail(`Reset failed: ${error.message}`);
      process.exit(1);
    }
  });

// Doctor command
program
  .command('doctor')
  .description('Check if your Promptonomicon setup is healthy')
  .action(async () => {
    console.log(chalk.cyan('🔍 Running Promptonomicon diagnostics...\n'));

    let hasIssues = false;

    // Check directories
    console.log(chalk.bold('Checking directories:'));
    for (const dir of DIRECTORIES) {
      if (existsSync(dir)) {
        console.log(chalk.green('✓') + ' ' + dir);
      } else {
        console.log(chalk.red('✗') + ' ' + dir + chalk.gray(' (missing)'));
        hasIssues = true;
      }
    }

    // Check template files
    console.log('\n' + chalk.bold('Checking template files:'));
    for (const file of TEMPLATE_FILES) {
      const filePath = path.join('.promptonomicon', file);
      if (existsSync(filePath)) {
        const stats = await fs.stat(filePath);
        const size = (stats.size / 1024).toFixed(1);
        console.log(chalk.green('✓') + ' ' + filePath + chalk.gray(` (${size} KB)`));
      } else {
        console.log(chalk.red('✗') + ' ' + filePath + chalk.gray(' (missing)'));
        hasIssues = true;
      }
    }

    // Check for modifications
    console.log('\n' + chalk.bold('Checking for updates:'));
    const spinner = ora('Comparing with latest templates...').start();

    try {
      let differencesFound = false;

      for (const file of TEMPLATE_FILES) {
        const localPath = path.join('.promptonomicon', file);
        if (existsSync(localPath)) {
          const localContent = await fs.readFile(localPath, 'utf-8');
          const remoteContent = await fetchTemplateFile(file);

          if (localContent !== remoteContent) {
            differencesFound = true;
          }
        }
      }

      spinner.stop();

      if (differencesFound) {
        console.log(chalk.yellow('⚠') + '  Local templates differ from latest version');
        console.log(chalk.gray('  Run "promptonomicon reset" to update (will overwrite customizations)'));
      } else {
        console.log(chalk.green('✓') + ' Templates match latest version');
      }

    } catch (error) {
      spinner.fail('Could not check for updates');
    }

    // Summary
    console.log('\n' + chalk.bold('Summary:'));
    if (hasIssues) {
      console.log(chalk.red('✗') + ' Issues found. Run "promptonomicon init" to fix.');
      process.exit(1);
    } else {
      console.log(chalk.green('✓') + ' Everything looks good!');
    }
  });

// Main program setup
program
  .name('promptonomicon')
  .version('1.0.0')
  .description('Transform how you build software with AI through structured, documentation-driven development');

program.parse();

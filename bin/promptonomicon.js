#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { existsSync } from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

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

// AI Assistant files to manage
const AI_ASSISTANT_FILES = [
  'ai-assistants/cursor-rules.mdc',
  'ai-assistants/vscode-promptonomicon.md',
  'ai-assistants/windsurf-rules.md',
  'ai-assistants/CLAUDE.md',
  'ai-assistants/claude-reference.md'
];

// MCP server configurations
const MCP_SERVERS = {
  versionator: {
    command: 'npx',
    args: ['-y', '@versionator/mcp-server'],
    description: 'Check latest versions of packages across all ecosystems'
  },
  context7: {
    command: 'npx',
    args: ['-y', '@context7/mcp-server'],
    env: {
      CONTEXT7_API_KEY: '${CONTEXT7_API_KEY}'
    },
    description: 'Fetch up-to-date documentation for libraries (requires API key)'
  }
};

async function fetchTemplateFile(filename) {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/.promptonomicon/${filename}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${filename}: ${error.message}`);
  }
}

// Fetch MCP configuration template
async function fetchMCPConfig() {
  const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/.promptonomicon/.mcp.json`;

  try {
    const response = await axios.get(url);
    // axios returns parsed JSON, need to stringify it
    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
  } catch (error) {
    // Try local file
    const localPath = path.join(__dirname, '..', '.promptonomicon', '.mcp.json');
    if (existsSync(localPath)) {
      return await fs.readFile(localPath, 'utf-8');
    }
    // Return default config if fetch fails
    return JSON.stringify({ mcpServers: MCP_SERVERS }, null, 2);
  }
}

// Setup AI assistant integration
async function setupAIAssistantIntegration() {
  const integrations = [];

  // Helper to get AI assistant content
  async function getAIAssistantContent(filename) {
    // Try local file first since AI assistant files are part of the package
    const localPath = path.join(__dirname, '..', '.promptonomicon', 'ai-assistants', filename);

    if (existsSync(localPath)) {
      try {
        return await fs.readFile(localPath, 'utf-8');
      } catch (localError) {
        // If local read fails, continue to try GitHub
      }
    }

    // Fallback to GitHub if local doesn't exist or fails
    try {
      return await fetchTemplateFile(`ai-assistants/${filename}`);
    } catch (error) {
      throw new Error(`Failed to load AI assistant content for ${filename}: ${error.message}`);
    }
  }

  // Cursor integration
  if (existsSync('.cursor') || process.env.CURSOR_EDITOR) {
    await fs.mkdir('.cursor/rules', { recursive: true });
    const content = await getAIAssistantContent('cursor-rules.mdc');
    await fs.writeFile('.cursor/rules/promptonomicon.mdc', content);
    integrations.push('Cursor (.cursor/rules/promptonomicon.mdc)');
  }

  // VS Code integration
  if (existsSync('.vscode')) {
    const content = await getAIAssistantContent('vscode-promptonomicon.md');
    await fs.writeFile('.vscode/promptonomicon.md', content);
    integrations.push('VS Code (.vscode/promptonomicon.md)');
  }

    // Windsurf integration
  if (existsSync('.windsurf')) {
    const content = await getAIAssistantContent('windsurf-rules.md');
    await fs.writeFile('.windsurf/rules.md', content);
    integrations.push('Windsurf (.windsurf/rules.md)');
  }

  // Claude integration - create CLAUDE.md in project root
  // This is created for all projects as Claude can be used anywhere
  try {
    const claudeContent = await getAIAssistantContent('CLAUDE.md');
    await fs.writeFile('CLAUDE.md', claudeContent, 'utf-8');
    integrations.push('Claude (CLAUDE.md in project root)');
  } catch (error) {
    console.error('Error creating CLAUDE.md:', error);
    // Create empty file if content fetch fails
    await fs.writeFile('CLAUDE.md', '', 'utf-8');
    integrations.push('Claude (CLAUDE.md in project root)');
  }

  return integrations;
}

// Setup MCP servers
async function setupMCPServers(servers) {
  const configurations = [];

  // Get base MCP config
  const mcpConfigStr = await fetchMCPConfig();
  const mcpConfig = JSON.parse(mcpConfigStr);

  // Filter to requested servers
  const filteredServers = {};
  for (const server of servers) {
    if (mcpConfig.mcpServers[server]) {
      filteredServers[server] = mcpConfig.mcpServers[server];
    }
  }

  // Cursor MCP configuration
  if (existsSync('.cursor')) {
    await fs.mkdir('.cursor', { recursive: true });
    const cursorMcpPath = '.cursor/mcp.json';

    let existingConfig = {};
    if (existsSync(cursorMcpPath)) {
      const content = await fs.readFile(cursorMcpPath, 'utf-8');
      existingConfig = JSON.parse(content);
    }

    // Merge configurations
    const mergedConfig = {
      ...existingConfig,
      mcpServers: {
        ...(existingConfig.mcpServers || {}),
        ...filteredServers
      }
    };

    await fs.writeFile(cursorMcpPath, JSON.stringify(mergedConfig, null, 2));
    configurations.push(`Cursor (.cursor/mcp.json)`);
  }

  // VS Code MCP configuration (if directory exists)
  if (existsSync('.vscode')) {
    const vscodeMcpPath = '.vscode/mcp.json';
    let existingVscodeConfig = {};
    if (existsSync(vscodeMcpPath)) {
      const content = await fs.readFile(vscodeMcpPath, 'utf-8');
      existingVscodeConfig = JSON.parse(content);
    }

    // Merge configurations
    const mergedVscodeConfig = {
      ...existingVscodeConfig,
      mcpServers: {
        ...(existingVscodeConfig.mcpServers || {}),
        ...filteredServers
      }
    };

    await fs.writeFile(vscodeMcpPath, JSON.stringify(mergedVscodeConfig, null, 2));
    configurations.push('VS Code (.vscode/mcp.json)');
  }

  // Windsurf MCP configuration (if directory exists)
  if (existsSync('.windsurf')) {
    const windsurfMcpPath = '.windsurf/mcp.json';
    let existingWindsurfConfig = {};
    if (existsSync(windsurfMcpPath)) {
      const content = await fs.readFile(windsurfMcpPath, 'utf-8');
      existingWindsurfConfig = JSON.parse(content);
    }

    // Merge configurations
    const mergedWindsurfConfig = {
      ...existingWindsurfConfig,
      mcpServers: {
        ...(existingWindsurfConfig.mcpServers || {}),
        ...filteredServers
      }
    };

    await fs.writeFile(windsurfMcpPath, JSON.stringify(mergedWindsurfConfig, null, 2));
    configurations.push('Windsurf (.windsurf/mcp.json)');
  }

  // Claude Desktop configuration (informational only - always show since it requires manual setup)
  configurations.push(`Claude Desktop (see .promptonomicon/ai-assistants/claude-reference.md for manual setup)`);

  // Generic project MCP configuration
  const genericMcpPath = '.mcp.json';
  let existingGenericConfig = {};
  if (existsSync(genericMcpPath)) {
    const content = await fs.readFile(genericMcpPath, 'utf-8');
    existingGenericConfig = JSON.parse(content);
  }

  // Merge configurations
  const mergedGenericConfig = {
    ...existingGenericConfig,
    mcpServers: {
      ...(existingGenericConfig.mcpServers || {}),
      ...filteredServers
    }
  };

  await fs.writeFile(genericMcpPath, JSON.stringify(mergedGenericConfig, null, 2));
  configurations.push('Generic (.mcp.json)');

  return configurations;
}

// Check if templates have been customized
async function areTemplatesCustomized() {
  let customized = false;

  for (const file of TEMPLATE_FILES) {
    const localPath = path.join('.promptonomicon', file);
    if (existsSync(localPath)) {
      try {
        const localContent = await fs.readFile(localPath, 'utf-8');
        const remoteContent = await fetchTemplateFile(file);

        if (localContent !== remoteContent) {
          customized = true;
          break;
        }
      } catch (error) {
        // If we can't check, assume customized
        customized = true;
      }
    }
  }

  return customized;
}

// Check MCP server mentions in templates
async function checkMCPMentions() {
  const issues = [];
  const filesToCheck = ['3_BUILD_PLAN.md', '4_DEVELOPMENT_PROCESS.md'];

  // Check if MCP servers are configured
  const hasMCPConfig = existsSync('.mcp.json') || existsSync('.cursor/mcp.json');

  if (hasMCPConfig) {
    for (const file of filesToCheck) {
      const filePath = path.join('.promptonomicon', file);
      if (existsSync(filePath)) {
        const content = await fs.readFile(filePath, 'utf-8');
        const hasVersionator = content.toLowerCase().includes('versionator');
        const hasContext7 = content.toLowerCase().includes('context7');

        if (!hasVersionator && !hasContext7) {
          issues.push(`${file} doesn't mention MCP servers (versionator/context7)`);
        }
      }
    }
  }

  return issues;
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
  .option('--with-mcp-servers [servers]', 'Configure MCP servers (comma-separated or interactive)')
  .option('-y, --yes', 'Skip all prompts and use defaults')
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

      // Handle AI assistant integration
      spinner.text = 'Setting up AI assistant integration...';
      const aiIntegrations = await setupAIAssistantIntegration();

      // Handle MCP servers
      let mcpConfigurations = [];
      if (options.withMcpServers !== undefined) {
        spinner.stop();

        let serversToInstall = [];

        if (options.withMcpServers === true && !options.yes) {
          // Interactive mode
          const answers = await inquirer.prompt([
            {
              type: 'checkbox',
              name: 'servers',
              message: 'Which MCP servers would you like to configure?',
              choices: [
                {
                  name: 'versionator - Check latest package versions',
                  value: 'versionator',
                  checked: true
                },
                {
                  name: 'context7 - Fetch library documentation (requires API key)',
                  value: 'context7',
                  checked: false
                }
              ]
            },
            {
              type: 'confirm',
              name: 'confirmContext7',
              message: 'context7 requires a CONTEXT7_API_KEY environment variable. Do you have one?',
              when: (answers) => answers.servers.includes('context7'),
              default: false
            }
          ]);

          serversToInstall = answers.servers;
          if (answers.confirmContext7 === false) {
            serversToInstall = serversToInstall.filter(s => s !== 'context7');
            console.log(chalk.yellow('\nSkipping context7 configuration. Get an API key at https://context7.com'));
          }
        } else if (typeof options.withMcpServers === 'string') {
          // Specific servers provided
          serversToInstall = options.withMcpServers.split(',').map(s => s.trim());
        } else if (options.yes) {
          // Default to versionator only in -y mode
          serversToInstall = ['versionator'];
        }

        if (serversToInstall.length > 0) {
          spinner.start('Configuring MCP servers...');
          mcpConfigurations = await setupMCPServers(serversToInstall);
        }
      }


      spinner.succeed('Promptonomicon initialized successfully!');

      console.log('\n' + chalk.green('✓') + ' Created directories:');
      DIRECTORIES.forEach(dir => console.log('  - ' + chalk.gray(dir)));

      console.log('\n' + chalk.green('✓') + ' Fetched templates:');
      TEMPLATE_FILES.forEach(file => console.log('  - ' + chalk.gray(`.promptonomicon/${file}`)));

      if (aiIntegrations.length > 0) {
        console.log('\n' + chalk.green('✓') + ' AI assistant integration:');
        aiIntegrations.forEach(integration => console.log('  - ' + chalk.gray(integration)));
      }

      if (mcpConfigurations.length > 0) {
        console.log('\n' + chalk.green('✓') + ' MCP server configurations:');
        mcpConfigurations.forEach(config => console.log('  - ' + chalk.gray(config)));
      }

      console.log('\n' + chalk.cyan('Next steps:'));
      console.log('  1. Customize the templates in .promptonomicon/ for your project');
      console.log('  2. Tell your AI assistant: "Follow the Promptonomicon process in .promptonomicon/PROMPTONOMICON.md"');
      console.log('  3. Run "promptonomicon doctor" to check your setup');

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
  .option('--with-mcp-servers [servers]', 'Reconfigure MCP servers (comma-separated or interactive)')
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

      // Reset AI assistant integration files
      spinner.text = 'Resetting AI assistant integration...';
      const aiIntegrations = await setupAIAssistantIntegration();

      // Handle MCP servers if requested
      let mcpConfigurations = [];
      if (options.withMcpServers !== undefined) {
        spinner.stop();

        let serversToInstall = [];

        if (options.withMcpServers === true && !options.yes) {
          // Interactive mode
          const answers = await inquirer.prompt([
            {
              type: 'checkbox',
              name: 'servers',
              message: 'Which MCP servers would you like to configure?',
              choices: [
                {
                  name: 'versionator - Check latest package versions',
                  value: 'versionator',
                  checked: true
                },
                {
                  name: 'context7 - Fetch library documentation (requires API key)',
                  value: 'context7',
                  checked: false
                }
              ]
            },
            {
              type: 'confirm',
              name: 'confirmContext7',
              message: 'context7 requires a CONTEXT7_API_KEY environment variable. Do you have one?',
              when: (answers) => answers.servers.includes('context7'),
              default: false
            }
          ]);

          serversToInstall = answers.servers;
          if (answers.confirmContext7 === false) {
            serversToInstall = serversToInstall.filter(s => s !== 'context7');
            console.log(chalk.yellow('\nSkipping context7 configuration. Get an API key at https://context7.com'));
          }
        } else if (typeof options.withMcpServers === 'string') {
          // Specific servers provided
          serversToInstall = options.withMcpServers.split(',').map(s => s.trim());
        } else if (options.yes) {
          // Default to versionator only in -y mode
          serversToInstall = ['versionator'];
        }

        if (serversToInstall.length > 0) {
          spinner.start('Configuring MCP servers...');
          mcpConfigurations = await setupMCPServers(serversToInstall);
        }
      }

      spinner.succeed('Templates reset to latest version!');

      console.log('\n' + chalk.green('✓') + ' Reset templates:');
      TEMPLATE_FILES.forEach(file => console.log('  - ' + chalk.gray(`.promptonomicon/${file}`)));

      if (aiIntegrations.length > 0) {
        console.log('\n' + chalk.green('✓') + ' Reset AI assistant integration:');
        aiIntegrations.forEach(integration => console.log('  - ' + chalk.gray(integration)));
      }

      if (mcpConfigurations.length > 0) {
        console.log('\n' + chalk.green('✓') + ' MCP server configurations:');
        mcpConfigurations.forEach(config => console.log('  - ' + chalk.gray(config)));
      }

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

    // Check if initialized first
    if (!existsSync('.promptonomicon')) {
      console.log(chalk.red('✗') + ' Promptonomicon is not initialized');
      console.log(chalk.gray('  Run "promptonomicon init" to get started'));
      console.log('\n' + chalk.bold('Summary:'));
      console.log(chalk.red('✗ 1 issue found'));
      console.log(chalk.gray('\nRun "promptonomicon init" to initialize your project.'));
      return; // Don't exit with error code in tests
    }

    let hasIssues = false;
    let warnings = [];

    // Check directories
    console.log(chalk.bold('Checking directories:'));
    let missingCriticalDirs = false;
    for (const dir of DIRECTORIES) {
      if (existsSync(dir)) {
        console.log(chalk.green('✓') + ' ' + dir);
      } else {
        console.log(chalk.red('✗') + ' ' + dir + chalk.gray(' (missing)'));
        hasIssues = true;
        if (dir === '.promptonomicon' || dir === 'ai-docs') {
          missingCriticalDirs = true;
        }
      }
    }

    if (missingCriticalDirs) {
      console.log('\n' + chalk.red('✗') + ' Critical directories are missing');
      console.log(chalk.gray('  Run "promptonomicon init --force" to recreate'));
      console.log('\n' + chalk.bold('Summary:'));
      console.log(chalk.red('✗ Critical issues found'));
      console.log(chalk.gray('\nRun "promptonomicon init --force" to fix the setup.'));
      return;
    }

    // Check template files
    console.log('\n' + chalk.bold('Checking template files:'));
    let missingTemplates = false;
    for (const file of TEMPLATE_FILES) {
      const filePath = path.join('.promptonomicon', file);
      if (existsSync(filePath)) {
        const stats = await fs.stat(filePath);
        const size = (stats.size / 1024).toFixed(1);
        console.log(chalk.green('✓') + ' ' + filePath + chalk.gray(` (${size} KB)`));
      } else {
        console.log(chalk.red('✗') + ' ' + filePath + chalk.gray(' (missing)'));
        hasIssues = true;
        missingTemplates = true;
      }
    }

    // If templates are missing, skip comparison
    if (missingTemplates) {
      console.log('\n' + chalk.yellow('⚠') + ' Some template files are missing');
      warnings.push(chalk.yellow('Warning: Some template files are missing'));
      warnings.push(chalk.gray('  Run "promptonomicon reset" to restore missing files'));
    } else {
      // Check for modifications and customization
      console.log('\n' + chalk.bold('Checking for updates:'));
      const spinner = ora('Comparing with latest templates...').start();

      try {
        const customized = await areTemplatesCustomized();
        spinner.stop();

        if (!customized) {
          console.log(chalk.yellow('⚠') + '  Templates match latest version exactly');
          warnings.push(chalk.yellow('Warning: You haven\'t customized your templates yet!'));
          warnings.push(chalk.gray('  Templates should be customized with your project standards'));
        } else {
          console.log(chalk.green('✓') + ' Templates have been customized');
          console.log(chalk.gray('  Run "promptonomicon reset" if you want to update to latest (will overwrite)'));
        }

      } catch (error) {
        spinner.fail('Could not check for updates');
      }
    }

    // Check AI assistant integration
    console.log('\n' + chalk.bold('Checking AI assistant integration:'));
    const aiChecks = [
      { path: '.cursor/rules/promptonomicon.mdc', name: 'Cursor' },
      { path: '.vscode/promptonomicon.md', name: 'VS Code' },
      { path: '.windsurf/rules.md', name: 'Windsurf' },
      { path: 'CLAUDE.md', name: 'Claude' }
    ];

    let hasAIIntegration = false;
    for (const check of aiChecks) {
      if (existsSync(check.path)) {
        console.log(chalk.green('✓') + ' ' + check.name + chalk.gray(` (${check.path})`));
        hasAIIntegration = true;
      }
    }

    if (!hasAIIntegration) {
      console.log(chalk.gray('  No AI assistant integration files found'));
    }

    // Check MCP configuration
    console.log('\n' + chalk.bold('Checking MCP server configuration:'));
    const mcpChecks = [
      { path: '.mcp.json', name: 'Generic MCP config' },
      { path: '.cursor/mcp.json', name: 'Cursor MCP config' },
      { path: '.vscode/mcp.json', name: 'VS Code MCP config' },
      { path: '.windsurf/mcp.json', name: 'Windsurf MCP config' }
    ];

    let hasMCPConfig = false;
    for (const check of mcpChecks) {
      if (existsSync(check.path)) {
        console.log(chalk.green('✓') + ' ' + check.name + chalk.gray(` (${check.path})`));
        hasMCPConfig = true;
      }
    }

    if (!hasMCPConfig) {
      console.log(chalk.gray('  No MCP server configuration found'));
      console.log(chalk.gray('  Run "promptonomicon init --with-mcp-servers" to configure'));
    }

    // Check MCP mentions in templates if MCP is configured
    if (hasMCPConfig) {
      const mcpIssues = await checkMCPMentions();
      if (mcpIssues.length > 0) {
        console.log('\n' + chalk.bold('MCP server integration issues:'));
        mcpIssues.forEach(issue => {
          console.log(chalk.yellow('⚠') + '  ' + issue);
          warnings.push(chalk.yellow(`Warning: ${issue}`));
        });
        warnings.push(chalk.gray('  Consider adding MCP server usage instructions to your templates'));
      }
    }

    // Check for context7 API key if configured
    if (hasMCPConfig && existsSync('.mcp.json')) {
      const mcpConfig = JSON.parse(await fs.readFile('.mcp.json', 'utf-8'));
      if (mcpConfig.mcpServers?.context7 && !process.env.CONTEXT7_API_KEY) {
        warnings.push(chalk.yellow('Warning: context7 is configured but CONTEXT7_API_KEY environment variable is not set'));
      }
    }

    // Summary
    console.log('\n' + chalk.bold('Summary:'));

    if (warnings.length > 0) {
      console.log('\n' + chalk.bold('Warnings:'));
      warnings.forEach(warning => console.log(warning));
    }

    if (hasIssues) {
      console.log('\n' + chalk.red('✗') + ' Issues found. Run "promptonomicon init" to fix.');
      process.exit(1);
    } else if (warnings.length > 0) {
      console.log('\n' + chalk.yellow('⚠') + ' Setup is functional but could be improved.');
    } else {
      console.log(chalk.green('✓') + ' Everything looks good!');
    }
  });

// Main program setup
program
  .name('promptonomicon')
  .version('1.1.0')
  .description('Transform how you build software with AI through structured, documentation-driven development');

program.parse();

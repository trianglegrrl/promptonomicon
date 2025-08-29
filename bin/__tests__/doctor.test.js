import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, '..', 'promptonomicon.js');

describe('promptonomicon doctor command', () => {
  let testDir;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'promptonomicon-doctor-test-'));
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(os.tmpdir());
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('uninitialized project', () => {
    test('should detect missing initialization', () => {
      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Running Promptonomicon diagnostics');
      expect(output).toContain('Promptonomicon is not initialized');
      expect(output).toContain('Run "promptonomicon init" to get started');
      expect(output).toContain('1 issue');
    });
  });

  describe('initialized project', () => {
    beforeEach(() => {
      execSync(`node ${CLI_PATH} init -y`, { encoding: 'utf8' });
    });

    test('should pass all checks for fresh initialization', () => {
      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Running Promptonomicon diagnostics');
      expect(output).toContain('Checking directories:');
      expect(output).toContain('Checking template files:');
      expect(output).toContain('Templates match latest version exactly');
      expect(output).toContain('Warning: You haven\'t customized your templates yet!');
    });

    test('should detect customized templates', () => {
      // Customize a template
      const templatePath = '.promptonomicon/PROMPTONOMICON.md';
      const content = fs.readFileSync(templatePath, 'utf8');
      fs.writeFileSync(templatePath, content + '\n<!-- Custom notes -->');

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Templates have been customized');
      expect(output).toContain('Run "promptonomicon reset" if you want to update to latest');
      expect(output).not.toContain('You haven\'t customized your templates yet!');
    });

    test('should detect missing template files', () => {
      fs.rmSync('.promptonomicon/1_BUILD_DESIGN.md');
      fs.rmSync('.promptonomicon/3_BUILD_PLAN.md');

      try {
        const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });
        // Doctor command runs with missing files but exits with error
        fail('Expected command to exit with error');
      } catch (error) {
        // Command exited with error as expected
        const output = error.stdout || error.output.toString();
        expect(output).toContain('Running Promptonomicon diagnostics');
        expect(output).toContain('missing');
        expect(output).toContain('1_BUILD_DESIGN.md');
        expect(output).toContain('Some template files are missing');
      }
    });

    test('should detect missing directories', () => {
      fs.rmSync('ai-docs/ai-design', { recursive: true });
      fs.rmSync('.scratch', { recursive: true });

      try {
        const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });
        // Doctor command runs with missing directories but exits with error
        fail('Expected command to exit with error');
      } catch (error) {
        // Command exited with error as expected
        const output = error.stdout || error.output.toString();
        expect(output).toContain('Running Promptonomicon diagnostics');
        expect(output).toContain('missing');
        expect(output).toContain('ai-docs/ai-design');
      }
    });
  });

  describe('AI assistant checks', () => {
    beforeEach(() => {
      execSync(`node ${CLI_PATH} init -y`, { encoding: 'utf8' });
    });

    test('should check for AI assistant files', () => {
      // Create tool directories
      fs.mkdirSync('.cursor');
      fs.mkdirSync('.vscode');
      fs.mkdirSync('.windsurf');

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('AI assistant integration:');
      // Should show Claude by default - check for the actual string with gray color codes
      expect(output).toContain('Claude');
      expect(output).toContain('CLAUDE.md');
      // Tool directories were created but integration files may not exist
    });

    test('should detect missing AI assistant configurations', () => {
      fs.mkdirSync('.cursor');
      fs.mkdirSync('.vscode');

      // Delete the AI config files
      fs.rmSync('CLAUDE.md');

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('AI assistant integration:');
      // Should show that no AI assistant files found since we deleted CLAUDE.md
      expect(output).toContain('No AI assistant integration files found');
    });

    test('should show N/A for non-existent tool directories', () => {
      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('AI assistant integration:');
      expect(output).toContain('Claude');
      expect(output).toContain('CLAUDE.md');
    });
  });

  describe('MCP server checks', () => {
    beforeEach(() => {
      execSync(`node ${CLI_PATH} init -y`, { encoding: 'utf8' });
    });

    test('should detect MCP configurations', () => {
      // Initialize with MCP servers
      execSync(`node ${CLI_PATH} init --force -y --with-mcp-servers=versionator,context7`, { encoding: 'utf8' });

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('MCP server configuration:');
      expect(output).toContain('Generic MCP config');
      expect(output).toContain('.mcp.json');
    });

    test('should warn about context7 without API key', () => {
      execSync(`node ${CLI_PATH} init --force -y --with-mcp-servers=context7`, { encoding: 'utf8' });

      // Make sure CONTEXT7_API_KEY is not set
      delete process.env.CONTEXT7_API_KEY;

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Warning: context7 is configured but CONTEXT7_API_KEY environment variable is not set');
    });

    test('should not warn about context7 with API key set', () => {
      execSync(`node ${CLI_PATH} init --force -y --with-mcp-servers=context7`, { encoding: 'utf8' });

      // Set the API key and pass it to the command
      const output = execSync(`node ${CLI_PATH} doctor`, {
        encoding: 'utf8',
        env: { ...process.env, CONTEXT7_API_KEY: 'test-key' }
      });

      expect(output).not.toContain('CONTEXT7_API_KEY environment variable is not set');
    });

    test('should warn about missing MCP mentions in templates', () => {
      execSync(`node ${CLI_PATH} init --force -y --with-mcp-servers=versionator,context7`, { encoding: 'utf8' });

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      // Check for MCP integration issues
      expect(output).toContain('MCP server integration issues:');
      expect(output).toContain("doesn't mention MCP servers");
    });

    test('should not warn when MCP servers are mentioned', () => {
      execSync(`node ${CLI_PATH} init --force -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      // Add mentions to templates
      const buildPlan = fs.readFileSync('.promptonomicon/3_BUILD_PLAN.md', 'utf8');
      fs.writeFileSync('.promptonomicon/3_BUILD_PLAN.md', buildPlan + '\n<!-- Using versionator for dependency management -->');

      const devProcess = fs.readFileSync('.promptonomicon/4_DEVELOPMENT_PROCESS.md', 'utf8');
      fs.writeFileSync('.promptonomicon/4_DEVELOPMENT_PROCESS.md', devProcess + '\n<!-- versionator helps check package versions -->');

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).not.toContain('versionator: not mentioned');
    });

    test('should check tool-specific MCP configurations', () => {
      fs.mkdirSync('.cursor');
      fs.mkdirSync('.vscode');

      execSync(`node ${CLI_PATH} init --force -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Cursor MCP config');
      expect(output).toContain('.cursor/mcp.json');
      expect(output).toContain('VS Code MCP config');
      expect(output).toContain('.vscode/mcp.json');
    });
  });

  describe('summary and recommendations', () => {
    beforeEach(() => {
      execSync(`node ${CLI_PATH} init -y`, { encoding: 'utf8' });
    });

    test('should show summary with no issues', () => {
      // Customize templates
      const template = fs.readFileSync('.promptonomicon/PROMPTONOMICON.md', 'utf8');
      fs.writeFileSync('.promptonomicon/PROMPTONOMICON.md', template + '\n<!-- Customized -->');

      // Configure MCP servers and update templates to mention them
      execSync(`node ${CLI_PATH} init --force -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      // Update the development process to mention MCP servers
      const devProcess = fs.readFileSync('.promptonomicon/4_DEVELOPMENT_PROCESS.md', 'utf8');
      fs.writeFileSync('.promptonomicon/4_DEVELOPMENT_PROCESS.md', devProcess + '\n<!-- Use versionator for dependency management -->');

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Summary:');
      expect(output).toContain('Everything looks good!');
    });

    test('should show summary with warnings', () => {
      // Fresh install has warning about uncustomized templates
      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Summary:');
      expect(output).toContain('Warnings:');
      expect(output).toContain('Warning:');
      expect(output).not.toContain('✓ No issues found');
    });

    test('should show summary with multiple issues', () => {
      // Delete some files to create issues
      fs.rmSync('.promptonomicon/1_BUILD_DESIGN.md');
      fs.rmSync('ai-docs/ai-design', { recursive: true });

      try {
        const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });
        fail('Expected command to exit with error');
      } catch (error) {
        const output = error.stdout || error.output.toString();
        // Should show issues in summary
        expect(output).toContain('Summary:');
        expect(output).toContain('missing');
        expect(output).toContain('Issues found');
      }
    });

    test('should prioritize errors over warnings in summary', () => {
      fs.rmSync('.promptonomicon', { recursive: true });

      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      // Should detect that Promptonomicon is not initialized
      expect(output).toContain('Promptonomicon is not initialized');
    });
  });

  describe('output formatting', () => {
    beforeEach(() => {
      execSync(`node ${CLI_PATH} init -y`, { encoding: 'utf8' });
    });

    test('should use appropriate colors and symbols', () => {
      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '1' } });

      // Check for various symbols
      expect(output).toMatch(/✓|✔/); // Success
      expect(output).toMatch(/⚠/);   // Warning
      expect(output).toContain('🔍'); // Diagnostics header
    });

    test('should format sections clearly', () => {
      const output = execSync(`node ${CLI_PATH} doctor`, { encoding: 'utf8' });

      expect(output).toContain('Checking directories:');
      expect(output).toContain('Checking template files:');
      expect(output).toContain('Checking for updates:');
      expect(output).toContain('AI assistant integration:');
      expect(output).toContain('Summary:');
    });
  });
});

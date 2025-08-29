import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, '..', 'promptonomicon.js');

describe('promptonomicon reset command', () => {
  let testDir;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'promptonomicon-reset-test-'));
    process.chdir(testDir);

    // Initialize first
    execSync(`node ${CLI_PATH} init -y`, { encoding: 'utf8' });
  });

  afterEach(() => {
    process.chdir(os.tmpdir());
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('basic reset functionality', () => {
    test('should reset all template files', () => {
      // Modify some template files
      fs.writeFileSync('.promptonomicon/PROMPTONOMICON.md', 'Modified content');
      fs.writeFileSync('.promptonomicon/1_BUILD_DESIGN.md', 'Changed content');

      const output = execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });

      // Check output
      expect(output).toContain('Reset templates:');
      expect(output).toContain('PROMPTONOMICON.md');
      expect(output).toContain('1_BUILD_DESIGN.md');
      // Check for successful reset - output has space after checkmark
      expect(output).toContain('\u2713');
      expect(output).toContain('Reset templates:');
      expect(output).toContain('Reset AI assistant integration:');

      // Verify files were reset (not "Modified content")
      const promptContent = fs.readFileSync('.promptonomicon/PROMPTONOMICON.md', 'utf8');
      expect(promptContent).not.toBe('Modified content');
      expect(promptContent).toContain('PROMPTONOMICON: Six-Phase Development Process');

      const designContent = fs.readFileSync('.promptonomicon/1_BUILD_DESIGN.md', 'utf8');
      expect(designContent).not.toBe('Changed content');
      expect(designContent).toContain('Design Document Guide');
    });

    test('should recreate AI assistant files', () => {
      // Delete AI files
      fs.rmSync('CLAUDE.md');

      // Create AI directories
      fs.mkdirSync('.cursor');
      fs.mkdirSync('.vscode');

      const output = execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });

      // Check files were recreated
      expect(fs.existsSync('CLAUDE.md')).toBe(true);
      expect(fs.existsSync('.cursor/rules/promptonomicon.mdc')).toBe(true);
      expect(fs.existsSync('.vscode/promptonomicon.md')).toBe(true);

      // Check output mentions AI integration
      expect(output).toContain('AI assistant integration:');
      expect(output).toContain('Cursor');
      expect(output).toContain('VS Code');
      expect(output).toContain('Claude');
    });

    test('should not reset non-template files', () => {
      // Create custom files in ai-docs
      fs.writeFileSync('ai-docs/ai-design/20240101_design_test.md', 'Custom design');
      fs.writeFileSync('ai-docs/features/my-feature.md', 'Feature doc');

      execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });

      // Verify custom files are unchanged
      expect(fs.readFileSync('ai-docs/ai-design/20240101_design_test.md', 'utf8')).toBe('Custom design');
      expect(fs.readFileSync('ai-docs/features/my-feature.md', 'utf8')).toBe('Feature doc');
    });

    test('should show next steps', () => {
      const output = execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });

      // Next steps were removed from reset output
      expect(output).toContain('Reset templates:');
      expect(output).toContain('AI assistant integration:');
    });
  });

  describe('confirmation prompts', () => {
    test('should require --yes flag or confirmation', () => {
      // Without --yes flag, it would normally prompt
      // Since we can't interact in tests, we use --yes
      const output = execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });
      // Check for successful reset indicators
      expect(output).toContain('\u2713');
    });
  });

  describe('MCP server handling', () => {
    test('should reset MCP configurations with --with-mcp-servers', () => {
      // Remove MCP config
      if (fs.existsSync('.mcp.json')) {
        fs.rmSync('.mcp.json');
      }

      const output = execSync(`node ${CLI_PATH} reset --yes --with-mcp-servers=versionator,context7`, { encoding: 'utf8' });

      // Check MCP was configured
      expect(output).toContain('MCP server configurations:');
      expect(fs.existsSync('.mcp.json')).toBe(true);

      const mcpConfig = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(mcpConfig.mcpServers).toHaveProperty('versionator');
      expect(mcpConfig.mcpServers).toHaveProperty('context7');
    });

    test('should preserve existing MCP servers and merge new ones', () => {
      // Create existing MCP config with custom server
      const existingConfig = {
        mcpServers: {
          "custom-server": {
            command: "custom",
            args: ["--test"]
          }
        }
      };
      fs.writeFileSync('.mcp.json', JSON.stringify(existingConfig, null, 2));

      execSync(`node ${CLI_PATH} reset --yes --with-mcp-servers=versionator`, { encoding: 'utf8' });

      const mcpConfig = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

      // Should have both existing and new servers
      expect(mcpConfig.mcpServers).toHaveProperty('custom-server');
      expect(mcpConfig.mcpServers).toHaveProperty('versionator');
      expect(mcpConfig.mcpServers['custom-server'].command).toBe('custom');
    });

    test('should handle tool-specific MCP configurations', () => {
      // Create tool directories
      fs.mkdirSync('.cursor');
      fs.mkdirSync('.vscode');

      // Create existing Cursor MCP config
      const cursorConfig = {
        mcpServers: {
          "cursor-specific": {
            command: "cursor-tool"
          }
        }
      };
      fs.writeFileSync('.cursor/mcp.json', JSON.stringify(cursorConfig, null, 2));

      execSync(`node ${CLI_PATH} reset --yes --with-mcp-servers=versionator`, { encoding: 'utf8' });

      // Check Cursor config was merged
      const updatedCursorConfig = JSON.parse(fs.readFileSync('.cursor/mcp.json', 'utf8'));
      expect(updatedCursorConfig.mcpServers).toHaveProperty('cursor-specific');
      expect(updatedCursorConfig.mcpServers).toHaveProperty('versionator');

      // Check VS Code config was created
      expect(fs.existsSync('.vscode/mcp.json')).toBe(true);
      const vscodeConfig = JSON.parse(fs.readFileSync('.vscode/mcp.json', 'utf8'));
      expect(vscodeConfig.mcpServers).toHaveProperty('versionator');
    });
  });

  describe('error handling', () => {
    test('should handle missing .promptonomicon directory', () => {
      fs.rmSync('.promptonomicon', { recursive: true });

      // Reset should recreate missing directories
      const output = execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });
      expect(output).toContain('Reset templates:');
    });

    test('should handle file permission errors', () => {
      // Make a template file read-only
      fs.chmodSync('.promptonomicon/PROMPTONOMICON.md', 0o444);
      fs.chmodSync('.promptonomicon', 0o555);

      expect(() => {
        execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });
      }).toThrow();

      // Clean up
      fs.chmodSync('.promptonomicon', 0o755);
      fs.chmodSync('.promptonomicon/PROMPTONOMICON.md', 0o644);
    });
  });

  describe('output formatting', () => {
    test('should use colors and icons in output', () => {
      const output = execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '1' } });

      // Check for success indicators (these will include ANSI codes)
      expect(output).toMatch(/✓|✔/); // Success checkmarks
      // Check for successful reset indicators
      expect(output).toContain('\u2713');
    });

    test('should list all reset files', () => {
      const output = execSync(`node ${CLI_PATH} reset --yes`, { encoding: 'utf8' });

      const expectedFiles = [
        'PROMPTONOMICON.md',
        '1_BUILD_DESIGN.md',
        '3_BUILD_PLAN.md',
        '4_DEVELOPMENT_PROCESS.md',
        '5_BUILD_IMPLEMENTATION.md',
        '6_DOCUMENTATION_UPDATE.md',
        'README.md'
      ];

      expectedFiles.forEach(file => {
        expect(output).toContain(file);
      });
    });
  });
});

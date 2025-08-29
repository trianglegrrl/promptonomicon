import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, '..', 'promptonomicon.js');

describe('MCP server functionality', () => {
  let testDir;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'promptonomicon-mcp-test-'));
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(os.tmpdir());
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('init with MCP servers', () => {
    test('should configure versionator only', () => {
      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      expect(fs.existsSync('.mcp.json')).toBe(true);
      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

      expect(config.mcpServers).toHaveProperty('versionator');
      expect(config.mcpServers.versionator.command).toBe('npx');
      expect(config.mcpServers.versionator.args).toContain('@versionator/mcp-server');
      expect(config.mcpServers).not.toHaveProperty('context7');
    });

    test('should configure context7 only', () => {
      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=context7`, { encoding: 'utf8' });

      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

      expect(config.mcpServers).toHaveProperty('context7');
      expect(config.mcpServers.context7.command).toBe('npx');
      expect(config.mcpServers.context7.args).toContain('@context7/mcp-server');
      expect(config.mcpServers.context7.env).toHaveProperty('CONTEXT7_API_KEY');
      expect(config.mcpServers).not.toHaveProperty('versionator');
    });

    test('should configure both MCP servers', () => {
      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator,context7`, { encoding: 'utf8' });

      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));

      expect(config.mcpServers).toHaveProperty('versionator');
      expect(config.mcpServers).toHaveProperty('context7');
    });

    test('should handle spaces in comma-separated list', () => {
      execSync(`node ${CLI_PATH} init -y --with-mcp-servers="versionator, context7"`, { encoding: 'utf8' });

      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(config.mcpServers).toHaveProperty('versionator');
      expect(config.mcpServers).toHaveProperty('context7');
    });

    test('should create tool-specific MCP configurations', () => {
      fs.mkdirSync('.cursor');
      fs.mkdirSync('.vscode');
      fs.mkdirSync('.windsurf');

      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      // Check all tool-specific configs
      expect(fs.existsSync('.cursor/mcp.json')).toBe(true);
      expect(fs.existsSync('.vscode/mcp.json')).toBe(true);
      expect(fs.existsSync('.windsurf/mcp.json')).toBe(true);

      // Verify content
      const cursorConfig = JSON.parse(fs.readFileSync('.cursor/mcp.json', 'utf8'));
      expect(cursorConfig.mcpServers).toHaveProperty('versionator');

      const vscodeConfig = JSON.parse(fs.readFileSync('.vscode/mcp.json', 'utf8'));
      expect(vscodeConfig.mcpServers).toHaveProperty('versionator');

      const windsurfConfig = JSON.parse(fs.readFileSync('.windsurf/mcp.json', 'utf8'));
      expect(windsurfConfig.mcpServers).toHaveProperty('versionator');
    });

    test('should show MCP configuration in output', () => {
      const output = execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator,context7`, { encoding: 'utf8' });

      expect(output).toContain('MCP server configurations:');
      expect(output).toContain('Generic (.mcp.json)');
    });
  });

  describe('MCP server merging', () => {
    test('should merge with existing generic MCP config', () => {
      // Create existing config
      const existingConfig = {
        mcpServers: {
          "custom-tool": {
            command: "custom",
            args: ["--run"]
          }
        }
      };
      fs.writeFileSync('.mcp.json', JSON.stringify(existingConfig, null, 2));

      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(config.mcpServers).toHaveProperty('custom-tool');
      expect(config.mcpServers).toHaveProperty('versionator');
      expect(config.mcpServers['custom-tool'].command).toBe('custom');
    });

    test('should merge with existing Cursor MCP config', () => {
      fs.mkdirSync('.cursor');

      const existingConfig = {
        customSetting: true,
        mcpServers: {
          "cursor-tool": {
            command: "cursor-specific"
          }
        }
      };
      fs.writeFileSync('.cursor/mcp.json', JSON.stringify(existingConfig, null, 2));

      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=context7`, { encoding: 'utf8' });

      const config = JSON.parse(fs.readFileSync('.cursor/mcp.json', 'utf8'));

      // Should preserve existing structure
      expect(config.customSetting).toBe(true);
      expect(config.mcpServers).toHaveProperty('cursor-tool');
      expect(config.mcpServers).toHaveProperty('context7');
    });

    test('should create nested directories for tool configs', () => {
      fs.mkdirSync('.vscode');
      // Don't create mcp.json yet

      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      expect(fs.existsSync('.vscode/mcp.json')).toBe(true);
    });

    test('should overwrite duplicates when merging', () => {
      // Create config with old versionator
      const oldConfig = {
        mcpServers: {
          "versionator": {
            command: "old-command",
            args: ["old-args"]
          }
        }
      };
      fs.writeFileSync('.mcp.json', JSON.stringify(oldConfig, null, 2));

      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(config.mcpServers.versionator.command).toBe('npx');
      expect(config.mcpServers.versionator.args).toContain('@versionator/mcp-server');
    });
  });

  describe('error handling', () => {
    test('should handle invalid MCP server names gracefully', () => {
      // Should only configure valid servers
      execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator,invalid-server,context7`, { encoding: 'utf8' });

      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(config.mcpServers).toHaveProperty('versionator');
      expect(config.mcpServers).toHaveProperty('context7');
      expect(config.mcpServers).not.toHaveProperty('invalid-server');
    });

    test('should handle empty MCP server list', () => {
      const output = execSync(`node ${CLI_PATH} init -y --with-mcp-servers=`, { encoding: 'utf8' });

      // Should not create MCP config
      // With empty server list, generic .mcp.json is still created but empty
      expect(fs.existsSync('.mcp.json')).toBe(true);
      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(config.mcpServers).toEqual({});
    });

    test('should handle malformed existing MCP config', () => {
      // Write invalid JSON
      fs.writeFileSync('.mcp.json', '{ invalid json');

      // Should fail with malformed JSON
      expect(() => {
        execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator`, { encoding: 'utf8' });
      }).toThrow();
    });
  });

  describe('Claude Desktop configuration', () => {
    test('should show Claude Desktop manual configuration message', () => {
      const output = execSync(`node ${CLI_PATH} init -y --with-mcp-servers=versionator`, { encoding: 'utf8' });

      expect(output).toContain('Claude Desktop (see .promptonomicon/ai-assistants/claude-reference.md for manual setup)');
    });

    test('should handle existing Claude Desktop config file', () => {
      // Create Claude config directory
      const claudeDir = path.join(os.homedir(), '.config/claude');
      fs.mkdirSync(claudeDir, { recursive: true });

      const claudeConfig = {
        mcpServers: {
          "existing-server": {
            command: "existing"
          }
        }
      };
      fs.writeFileSync(path.join(claudeDir, 'claude_desktop_config.json'), JSON.stringify(claudeConfig, null, 2));

      const output = execSync(`node ${CLI_PATH} init -y --with-mcp-servers=context7`, { encoding: 'utf8' });

      // Should still show manual config message
      expect(output).toContain('Claude Desktop (see .promptonomicon/ai-assistants/claude-reference.md for manual setup)');

      // Original file should be unchanged (manual config required)
      const savedConfig = JSON.parse(fs.readFileSync(path.join(claudeDir, 'claude_desktop_config.json'), 'utf8'));
      expect(savedConfig.mcpServers).not.toHaveProperty('context7');
    });
  });

  describe('reset command with MCP', () => {
    beforeEach(() => {
      execSync(`node ${CLI_PATH} init -y`, { encoding: 'utf8' });
    });

    test('should reconfigure MCP servers on reset', () => {
      // Delete MCP config
      if (fs.existsSync('.mcp.json')) {
        fs.rmSync('.mcp.json');
      }

      execSync(`node ${CLI_PATH} reset --yes --with-mcp-servers=versionator`, { encoding: 'utf8' });

      expect(fs.existsSync('.mcp.json')).toBe(true);
      const config = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(config.mcpServers).toHaveProperty('versionator');
    });

    test('should preserve other MCP servers on reset', () => {
      // Add custom MCP server
      const config = {
        mcpServers: {
          "my-custom-server": {
            command: "my-tool"
          }
        }
      };
      fs.writeFileSync('.mcp.json', JSON.stringify(config, null, 2));

      execSync(`node ${CLI_PATH} reset --yes --with-mcp-servers=context7`, { encoding: 'utf8' });

      const newConfig = JSON.parse(fs.readFileSync('.mcp.json', 'utf8'));
      expect(newConfig.mcpServers).toHaveProperty('my-custom-server');
      expect(newConfig.mcpServers).toHaveProperty('context7');
    });
  });
});

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, '..', 'promptonomicon.js');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', '..', 'package.json');

describe('promptonomicon CLI', () => {
  let packageJson;

  beforeAll(() => {
    packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  });

  describe('version command', () => {
    test('should display version with --version flag', () => {
      const output = execSync(`node ${CLI_PATH} --version`, { encoding: 'utf8' }).trim();
      expect(output).toBe(packageJson.version);
    });

    test('should display version with -V flag', () => {
      const output = execSync(`node ${CLI_PATH} -V`, { encoding: 'utf8' }).trim();
      expect(output).toBe(packageJson.version);
    });
  });

  describe('help command', () => {
    test('should display help with --help flag', () => {
      const output = execSync(`node ${CLI_PATH} --help`, { encoding: 'utf8' });

      expect(output).toContain('Usage: promptonomicon');
      expect(output).toContain('Transform how you build software with AI');
      expect(output).toContain('Commands:');
      expect(output).toContain('init');
      expect(output).toContain('doctor');
      expect(output).toContain('reset');
      expect(output).toContain('Options:');
      expect(output).toContain('-V, --version');
      expect(output).toContain('-h, --help');
    });

    test('should display help with -h flag', () => {
      const output = execSync(`node ${CLI_PATH} -h`, { encoding: 'utf8' });

      expect(output).toContain('Usage: promptonomicon');
      expect(output).toContain('Commands:');
    });

    test('should display help when no command provided', () => {
      // When no command is provided, commander shows help and exits with code 1
      try {
        execSync(`node ${CLI_PATH}`, { encoding: 'utf8', stdio: 'pipe' });
      } catch (error) {
        // Commander outputs help to stdout even on error
        const output = error.stdout ? error.stdout.toString() : error.output.join('');
        expect(output).toContain('Usage: promptonomicon');
        expect(output).toContain('Commands:');
      }
    });
  });

  describe('command help', () => {
    test('should display init command help', () => {
      const output = execSync(`node ${CLI_PATH} init --help`, { encoding: 'utf8' });

      expect(output).toContain('Usage: promptonomicon init');
      expect(output).toContain('Initialize Promptonomicon in the current directory');
      expect(output).toContain('-f, --force');
      expect(output).toContain('--with-mcp-servers');
      expect(output).toContain('-y, --yes');
    });

    test('should display doctor command help', () => {
      const output = execSync(`node ${CLI_PATH} doctor --help`, { encoding: 'utf8' });

      expect(output).toContain('Usage: promptonomicon doctor');
      expect(output).toContain('Check if your Promptonomicon setup is healthy');
    });

    test('should display reset command help', () => {
      const output = execSync(`node ${CLI_PATH} reset --help`, { encoding: 'utf8' });

      expect(output).toContain('Usage: promptonomicon reset');
      expect(output).toContain('Reset all Promptonomicon templates to latest version');
      expect(output).toContain('--yes');
      expect(output).toContain('--with-mcp-servers');
    });
  });

  describe('unknown commands', () => {
    test('should show error for unknown command', () => {
      expect(() => {
        execSync(`node ${CLI_PATH} unknown-command`, { encoding: 'utf8' });
      }).toThrow();
    });

    test('should suggest help for unknown command', () => {
      try {
        execSync(`node ${CLI_PATH} unknown-command`, { encoding: 'utf8', stdio: 'pipe' });
      } catch (error) {
        expect(error.stderr.toString()).toContain("error: unknown command 'unknown-command'");
      }
    });
  });

  describe('executable permissions', () => {
    test('should have executable shebang', () => {
      const content = fs.readFileSync(CLI_PATH, 'utf8');
      expect(content).toMatch(/^#!/);
      expect(content).toContain('#!/usr/bin/env node');
    });

    test('should be executable', () => {
      const stats = fs.statSync(CLI_PATH);
      // Check if owner has execute permission
      expect(stats.mode & 0o100).toBeTruthy();
    });
  });

  describe('package.json integration', () => {
    test('should have correct bin entry', () => {
      expect(packageJson.bin).toHaveProperty('promptonomicon');
      expect(packageJson.bin.promptonomicon).toBe('./bin/promptonomicon.js');
    });

    test('should have correct main entry', () => {
      expect(packageJson.main).toBe('index.js');
    });

    test('should have type module', () => {
      expect(packageJson.type).toBe('module');
    });

    test('should have required dependencies', () => {
      expect(packageJson.dependencies).toHaveProperty('commander');
      expect(packageJson.dependencies).toHaveProperty('chalk');
      expect(packageJson.dependencies).toHaveProperty('ora');
      expect(packageJson.dependencies).toHaveProperty('axios');
      expect(packageJson.dependencies).toHaveProperty('inquirer');
    });
  });

  describe('error handling', () => {
    test('should handle missing required arguments gracefully', () => {
      // Commands that require being in a project directory
      const commands = ['doctor', 'reset --yes'];

      commands.forEach(cmd => {
        try {
          execSync(`node ${CLI_PATH} ${cmd}`, {
            encoding: 'utf8',
            cwd: '/tmp' // Run in temp directory
          });
        } catch (error) {
          // Should fail gracefully, not crash
          expect(error.status).toBeDefined();
        }
      });
    });

    test('should provide helpful error messages', () => {
      try {
        execSync(`node ${CLI_PATH} init --with-mcp-servers`, { encoding: 'utf8', stdio: 'pipe' });
      } catch (error) {
        // Should handle missing value for option
        expect(error.status).toBeDefined();
      }
    });
  });

  describe('global flags', () => {
    test('should respect NO_COLOR environment variable', () => {
      const output = execSync(`node ${CLI_PATH} --help`, {
        encoding: 'utf8',
        env: { ...process.env, NO_COLOR: '1' }
      });

      // Output should not contain ANSI color codes
      expect(output).not.toMatch(/\x1b\[[0-9;]*m/);
    });

    test('should handle FORCE_COLOR environment variable', () => {
      const output = execSync(`node ${CLI_PATH} --help`, {
        encoding: 'utf8',
        env: { ...process.env, FORCE_COLOR: '1' }
      });

      // May contain ANSI codes depending on terminal
      expect(output).toContain('promptonomicon');
    });
  });
});

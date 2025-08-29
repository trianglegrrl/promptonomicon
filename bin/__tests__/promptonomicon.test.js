import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, '..', 'promptonomicon.js');

describe('promptonomicon CLI smoke tests', () => {
  test('CLI is executable', () => {
    const output = execSync(`node ${CLI_PATH} --version`, { encoding: 'utf8' }).trim();
    expect(output).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('all commands are available', () => {
    const output = execSync(`node ${CLI_PATH} --help`, { encoding: 'utf8' });
    expect(output).toContain('init');
    expect(output).toContain('doctor');
    expect(output).toContain('reset');
  });
});

// Note: Comprehensive tests for each command are in separate test files:
// - init.test.js - Tests for init command
// - reset.test.js - Tests for reset command
// - doctor.test.js - Tests for doctor command
// - mcp.test.js - Tests for MCP server functionality
// - cli.test.js - Tests for CLI entry point and help/version
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface ProjectNameOptions {
  cliArg?: string;
  envVar?: string;
  autoDetect?: boolean;
}

/**
 * Resolve project name with priority:
 * 1. CLI argument
 * 2. Environment variable
 * 3. Auto-detect from git or package.json
 * 4. Current directory name
 */
export function resolveProjectName(options: ProjectNameOptions = {}): string {
  // Priority 1: CLI argument
  if (options.cliArg) {
    return options.cliArg;
  }

  // Priority 2: Environment variable
  if (options.envVar) {
    return options.envVar;
  }

  // Priority 3: Auto-detect
  if (options.autoDetect !== false) {
    // Try git remote
    try {
      const gitRemote = execSync('git config --get remote.origin.url', { encoding: 'utf-8', stdio: 'pipe' }).trim();
      if (gitRemote) {
        // Extract project name from git URL
        const match = gitRemote.match(/([^\/]+?)(?:\.git)?$/);
        if (match) {
          return match[1];
        }
      }
    } catch {
      // Git not available or not a git repo
    }

    // Try package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.name) {
          return packageJson.name;
        }
      } catch {
        // Invalid package.json
      }
    }
  }

  // Priority 4: Current directory name
  return path.basename(process.cwd());
}


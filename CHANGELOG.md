# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-29

### Added
- Comprehensive test suite with Jest
  - Unit tests for all CLI commands
  - Integration tests for real-world scenarios
  - 80%+ coverage thresholds
  - Coverage reporting (text, lcov, html)
- Cursor rules now use `.mdc` format with frontmatter
  - Modern format with `alwaysApply: true` frontmatter
  - Better integration with Cursor's rule system
- Proper `claude.md` file generation
  - Created in project root for Claude to automatically read
  - Contains instructions for Claude to follow Promptonomicon
- Enhanced MCP server configuration merging
  - Now properly merges with existing configurations
  - Supports VS Code and Windsurf MCP configurations
  - Prevents overwriting of existing MCP servers
- Test coverage in CI/CD pipeline
  - Tests run on Node.js 18.x, 20.x, and 22.x
  - Coverage reports uploaded to Codecov
  - Integration tests for CLI commands

### Changed
- Cursor rules renamed from `.md` to `.mdc` format
- Claude configuration split into two files:
  - `claude.md` - Instructions for Claude (auto-generated)
  - `claude-reference.md` - MCP setup guide for users
- MCP server configuration now merges instead of overwrites
- Doctor command enhanced with better warnings
- CI/CD pipeline updated to run comprehensive tests

### Fixed
- MCP server configuration merging logic
- AI assistant file detection and creation
- Template customization detection
- Error handling in various edge cases

## [1.0.0] - 2024-12-28

### Added
- Initial npm package release
- CLI commands: `init`, `reset`, `doctor`
- MCP server integration (versionator, context7)
- AI assistant auto-configuration
- GitHub Actions CI/CD pipeline
- Comprehensive documentation

[1.1.0]: https://github.com/trianglegrrl/promptonomicon/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/trianglegrrl/promptonomicon/releases/tag/v1.0.0

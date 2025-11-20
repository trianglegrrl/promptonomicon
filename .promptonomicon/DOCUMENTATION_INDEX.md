# Documentation Index

This index maps all documentation locations in this repository, indicating:
- **Purpose**: What each document is for
- **When to Reference**: When developers/AI should read it
- **When to Update**: When the document should be modified

<!-- CUSTOMIZE THIS FILE:
This file should be created during the customization process (see INTEGRATION.md Phase 4).

For each documentation file in your repository, add an entry with:
- Purpose: What the document contains and why it exists
- Location: Path to the document
- When to Reference: Specific scenarios when developers/AI should consult it
- When to Update: Specific scenarios when the document should be modified

Be specific - don't use vague terms like "when needed". Reference specific phases
of development (Phase 1: Understand, Phase 2: Design, etc.) and specific activities.
-->

## Core Documentation

### README.md
- **Purpose**: Project overview, quick start, main entry point for new contributors
- **Location**: Repository root (`README.md`)
- **When to Reference**:
  - Phase 1: Understanding project purpose, features, and scope
  - Setting up development environment for the first time
  - Finding quick start instructions
  - Understanding project dependencies and prerequisites
- **When to Update**:
  - Phase 6: After adding new features (add to features list)
  - Phase 6: After changing setup instructions
  - Phase 6: After major project changes (architecture, stack, etc.)

### CONTRIBUTING.md
- **Purpose**: [Customize: What does your CONTRIBUTING.md contain?]
- **Location**: [Customize: Path to CONTRIBUTING.md]
- **When to Reference**:
  - Phase 1: Understanding development workflow and conventions
  - Phase 1: Understanding git workflow and branch naming
  - Phase 1: Understanding code review process
  - Phase 4: Before submitting code (ensuring compliance)
- **When to Update**:
  - Phase 6: After changing development workflow
  - Phase 6: After updating code review requirements
  - Phase 6: After changing git workflow conventions

### CHANGELOG.md
- **Purpose**: [Customize: What does your CHANGELOG.md contain?]
- **Location**: [Customize: Path to CHANGELOG.md]
- **When to Reference**:
  - Phase 1: Understanding recent changes and project evolution
  - Phase 1: Finding breaking changes or deprecations
  - Phase 2: Understanding why patterns changed
- **When to Update**:
  - Phase 6: After completing a feature (add entry under [Unreleased])
  - Phase 6: After fixing bugs (add to Fixed section)
  - Phase 6: After release (create new version section)

## Architecture Documentation

<!-- Customize: Add your architecture documentation locations -->

### docs/architecture/
- **Purpose**: [Customize: What architecture docs do you have?]
- **Location**: [Customize: Path to architecture docs]
- **When to Reference**:
  - Phase 1: Understanding overall system architecture
  - Phase 2: Designing new features that fit existing architecture
  - Phase 2: Understanding integration points
  - Phase 3: Planning implementation that respects architecture
- **When to Update**:
  - Phase 6: After architectural changes
  - Phase 6: After adding new architectural patterns
  - Phase 6: After major refactoring that changes structure

## API Documentation

<!-- Customize: Add your API documentation locations -->

### docs/api/
- **Purpose**: [Customize: What API docs do you have?]
- **Location**: [Customize: Path to API docs]
- **When to Reference**:
  - Phase 1: Understanding available APIs
  - Phase 2: Designing features that use existing APIs
  - Phase 2: Understanding API patterns and conventions
  - Phase 3: Planning API usage
  - Phase 4: Implementing API calls
- **When to Update**:
  - Phase 6: After adding new API endpoints
  - Phase 6: After changing API contracts
  - Phase 6: After deprecating APIs

## Configuration Documentation

<!-- Customize: Add your configuration documentation locations -->

### docs/configuration/
- **Purpose**: [Customize: What configuration docs do you have?]
- **Location**: [Customize: Path to config docs]
- **When to Reference**:
  - Phase 1: Setting up development environment
  - Phase 1: Understanding configuration options
  - Phase 2: Designing features that require configuration
  - Phase 3: Planning configuration needs
- **When to Update**:
  - Phase 6: After adding new configuration options
  - Phase 6: After changing configuration format
  - Phase 6: After changing environment requirements

## Feature Documentation

<!-- Customize: Add your feature documentation locations -->

### ai-docs/features/
- **Purpose**: User-facing feature documentation generated during development
- **Location**: `ai-docs/features/`
- **When to Reference**:
  - Phase 1: Understanding existing features
  - Phase 2: Finding similar features as reference
  - Phase 6: Creating new feature documentation
- **When to Update**:
  - Phase 6: After completing a feature (create new feature doc)

### ai-docs/ai-design/
- **Purpose**: Design documents from Phase 2 (Design)
- **Location**: `ai-docs/ai-design/`
- **When to Reference**:
  - Phase 1: Understanding past design decisions
  - Phase 2: Finding similar designs as reference
  - Phase 3: Reviewing design decisions during planning
- **When to Update**:
  - Phase 2: When creating new design documents
  - Phase 6: When documenting deviations from design

### ai-docs/ai-plans/
- **Purpose**: Implementation plans from Phase 3 (Plan)
- **Location**: `ai-docs/ai-plans/`
- **When to Reference**:
  - Phase 1: Understanding how similar features were implemented
  - Phase 3: Finding similar plans as reference
  - Phase 4: Following implementation plan
- **When to Update**:
  - Phase 3: When creating new implementation plans

### ai-docs/ai-implementation/
- **Purpose**: Implementation documentation from Phase 5 (Document)
- **Location**: `ai-docs/ai-implementation/`
- **When to Reference**:
  - Phase 1: Understanding what was actually built
  - Phase 2: Understanding deviations and lessons learned
  - Phase 3: Understanding implementation patterns that worked
- **When to Update**:
  - Phase 5: When documenting implementation after development

## Testing Documentation

<!-- Customize: Add your testing documentation locations -->

### docs/testing/
- **Purpose**: [Customize: What testing docs do you have?]
- **Location**: [Customize: Path to testing docs]
- **When to Reference**:
  - Phase 1: Understanding testing approach and conventions
  - Phase 2: Understanding testing requirements
  - Phase 3: Planning test strategy
  - Phase 4: Implementing tests following conventions
- **When to Update**:
  - Phase 6: After changing testing approach
  - Phase 6: After adding new testing patterns
  - Phase 6: After updating testing requirements

## Deployment Documentation

<!-- Customize: Add your deployment documentation locations -->

### docs/deployment/
- **Purpose**: [Customize: What deployment docs do you have?]
- **Location**: [Customize: Path to deployment docs]
- **When to Reference**:
  - Phase 1: Understanding deployment process
  - Phase 2: Understanding deployment constraints
  - Phase 6: Documenting deployment changes
- **When to Update**:
  - Phase 6: After changing deployment process
  - Phase 6: After adding new deployment environments
  - Phase 6: After changing infrastructure

## Troubleshooting Documentation

<!-- Customize: Add your troubleshooting documentation locations -->

### docs/troubleshooting/
- **Purpose**: [Customize: What troubleshooting docs do you have?]
- **Location**: [Customize: Path to troubleshooting docs]
- **When to Reference**:
  - Phase 1: Understanding common issues and solutions
  - Phase 4: Debugging issues during development
- **When to Update**:
  - Phase 6: After encountering new common issues
  - Phase 6: After fixing recurring problems
  - Phase 6: After adding new troubleshooting solutions

## How to Use This Index

### During Phase 1: Understand
1. Review this index to identify relevant documentation
2. Read core documentation (README, CONTRIBUTING, etc.)
3. Read architecture docs if designing major features
4. Read API docs if using existing APIs
5. Read similar feature docs to understand patterns

### During Phase 2: Design
1. Reference architecture docs to ensure alignment
2. Reference API docs to understand integration points
3. Reference similar feature docs for design patterns
4. Note which docs will need updates (for Phase 6)

### During Phase 3: Plan
1. Reference implementation plans for similar features
2. Reference testing docs for test strategy
3. Identify all documentation that will need updates

### During Phase 6: Update
1. Use this index to identify all documentation to update
2. Check "When to Update" for each relevant document
3. Ensure all documentation is synchronized
4. Verify examples and links still work

### For AI Agents
- Always consult this index when starting a new phase
- Reference relevant documentation as specified
- Update documentation index itself when adding new docs
- Use this index to ensure comprehensive updates in Phase 6


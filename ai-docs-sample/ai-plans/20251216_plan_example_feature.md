# Implementation Plan: User Input Validator

## Plan Overview

**Feature Name**: User Input Validator
**Design Document**: [20251216_design_example_feature.md](../ai-design/20251216_design_example_feature.md)
**Date**: 20251216
**Dependencies**: None (Node.js built-ins only)

### Implementation Summary
Build a schema-based validation system with three main components: Schema Builder for defining rules, Validator Engine for executing validation, and Error Reporter for clear failure messages. Implementation follows fail-hard principles throughout.

### Development Process Checklist
Copy this to `.scratch/todo.md` and check off as completed:
- [x] 1. **Understand** - Thoroughly investigate requirements and repository context
- [x] 2. **Design** - Create comprehensive design documentation
- [x] 3. **Plan** - Build detailed implementation plans from designs
- [ ] 4. **Develop** - Follow the plan using test-driven development
- [ ] 5. **Document** - Capture implementation details and decisions
- [ ] 6. **Update** - Synchronize all reference documentation

### Pre-Implementation Checklist
- [x] Design document reviewed and approved
- [x] Repository structure analyzed
- [x] Dependencies researched and versions confirmed (none needed)
- [x] Testing framework understood (Jest)
- [x] Coding standards documented

## Repository Context

### Relevant Files and Patterns
- **Pattern**: Error classes in `src/errors/`
  - Example: `src/errors/ValidationError.js`
  - Usage: Extend Error class with additional context

- **Pattern**: Feature directories under `src/features/`
  - Example: `src/features/auth/`, `src/features/user/`
  - Usage: Self-contained feature modules

- **Pattern**: Test structure mirrors source
  - Example: `src/features/auth/index.js` → `tests/features/auth/index.test.js`
  - Usage: Parallel test structure

### Integration Points
- **Error System**: `src/errors/index.js`
  - Files: [`src/errors/BaseError.js`]
  - Modifications needed: Export new ValidationError

- **Main Entry**: `src/index.js`
  - Files: [`src/index.js`]
  - Modifications needed: Export validator module

### Dependencies Analysis
- **Existing Dependencies**: None required
- **New Dependencies**: None - using Node.js built-ins only

## Implementation Steps

### Phase 1: Foundation

#### Step 1.1: Set up project structure
- [ ] Create directory: `src/features/validator/`
- [ ] Create base files:
  - `src/features/validator/index.js` - Main exports
  - `src/features/validator/schema.js` - Schema builder
  - `src/features/validator/engine.js` - Validation engine
  - `src/features/validator/errors.js` - ValidationError class
- [ ] Create test structure:
  - `tests/features/validator/schema.test.js`
  - `tests/features/validator/engine.test.js`
  - `tests/features/validator/integration.test.js`

#### Step 1.2: Implement ValidationError
- [ ] Create `src/features/validator/errors.js`:
  ```javascript
  class ValidationError extends Error {
    constructor(errors) {
      const message = ValidationError.formatMessage(errors);
      super(message);
      this.name = 'ValidationError';
      this.errors = errors;
      this.isValidationError = true;
    }

    static formatMessage(errors) {
      if (errors.length === 1) {
        return errors[0].message;
      }
      return `Validation failed with ${errors.length} errors:\\n${
        errors.map(e => `  - ${e.path}: ${e.message}`).join('\\n')
      }`;
    }
  }

  module.exports = { ValidationError };
  ```

#### Step 1.3: Create test utilities
- [ ] Create `tests/features/validator/helpers.js`:
  ```javascript
  function expectValidationError(fn, expectedErrors) {
    let error;
    try {
      fn();
      throw new Error('Expected ValidationError but none was thrown');
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.errors).toEqual(expectedErrors);
  }

  module.exports = { expectValidationError };
  ```

### Phase 2: Core Implementation

#### Step 2.1: Implement Schema Builder
- [ ] Create schema types in `src/features/validator/schema.js`:
  ```javascript
  const SchemaTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    OBJECT: 'object',
    ARRAY: 'array'
  };

  class SchemaBuilder {
    constructor(type, config = {}) {
      this.type = type;
      this.config = config;
      this.validators = [];
    }

    required() {
      this.config.required = true;
      return this;
    }

    min(value) {
      if (this.type !== SchemaTypes.STRING && this.type !== SchemaTypes.NUMBER) {
        throw new Error('min() only valid for string and number types');
      }
      this.config.min = value;
      return this;
    }

    // Additional methods: max(), pattern(), etc.
  }

  const Schema = {
    string: () => new SchemaBuilder(SchemaTypes.STRING),
    number: () => new SchemaBuilder(SchemaTypes.NUMBER),
    boolean: () => new SchemaBuilder(SchemaTypes.BOOLEAN),
    object: (shape) => new SchemaBuilder(SchemaTypes.OBJECT, { shape }),
    array: (items) => new SchemaBuilder(SchemaTypes.ARRAY, { items })
  };

  module.exports = { Schema, SchemaBuilder, SchemaTypes };
  ```

#### Step 2.2: Write Schema Builder tests
- [ ] Create comprehensive tests in `tests/features/validator/schema.test.js`:
  ```javascript
  const { Schema } = require('../../../src/features/validator/schema');

  describe('Schema Builder', () => {
    describe('string schema', () => {
      it('creates string schema with required', () => {
        const schema = Schema.string().required();
        expect(schema.type).toBe('string');
        expect(schema.config.required).toBe(true);
      });

      it('creates string schema with min length', () => {
        const schema = Schema.string().min(5);
        expect(schema.config.min).toBe(5);
      });

      it('throws when min() used on non-string/number', () => {
        expect(() => Schema.boolean().min(5))
          .toThrow('min() only valid for string and number types');
      });
    });

    // Tests for number, boolean, object, array schemas
  });
  ```

#### Step 2.3: Implement Validator Engine
- [ ] Create validation logic in `src/features/validator/engine.js`:
  ```javascript
  const { ValidationError } = require('./errors');
  const { SchemaTypes } = require('./schema');

  function validate(data, schema, path = '') {
    const errors = [];

    // Check required
    if (schema.config.required && (data === null || data === undefined)) {
      errors.push({
        path: path || 'root',
        message: 'Field is required',
        expected: schema.type,
        actual: data === null ? 'null' : 'undefined'
      });
      return { errors };
    }

    // Skip validation for optional undefined fields
    if (data === undefined && !schema.config.required) {
      return { errors: [], validated: undefined };
    }

    // Type validation
    const validators = {
      [SchemaTypes.STRING]: validateString,
      [SchemaTypes.NUMBER]: validateNumber,
      [SchemaTypes.BOOLEAN]: validateBoolean,
      [SchemaTypes.OBJECT]: validateObject,
      [SchemaTypes.ARRAY]: validateArray
    };

    const validator = validators[schema.type];
    if (!validator) {
      throw new Error(`Unknown schema type: ${schema.type}`);
    }

    const result = validator(data, schema, path);
    errors.push(...result.errors);

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    return result.validated;
  }

  function validateString(data, schema, path) {
    const errors = [];

    if (typeof data !== 'string') {
      errors.push({
        path,
        message: `Expected string, got ${typeof data}`,
        expected: 'string',
        actual: typeof data
      });
      return { errors };
    }

    if (schema.config.min && data.length < schema.config.min) {
      errors.push({
        path,
        message: `String length ${data.length} is less than minimum ${schema.config.min}`,
        expected: `>= ${schema.config.min}`,
        actual: data.length
      });
    }

    // Additional string validations...

    return { errors, validated: data };
  }

  // Implement validateNumber, validateBoolean, validateObject, validateArray

  module.exports = { validate };
  ```

### Phase 3: Testing and Integration

#### Step 3.1: Write comprehensive unit tests
- [ ] Test each validator type in `tests/features/validator/engine.test.js`:
  ```javascript
  const { validate } = require('../../../src/features/validator/engine');
  const { Schema } = require('../../../src/features/validator/schema');
  const { expectValidationError } = require('./helpers');

  describe('Validator Engine', () => {
    describe('string validation', () => {
      it('validates required strings', () => {
        const schema = Schema.string().required();
        expect(validate('hello', schema)).toBe('hello');
      });

      it('throws on missing required string', () => {
        const schema = Schema.string().required();
        expectValidationError(
          () => validate(undefined, schema),
          [{
            path: 'root',
            message: 'Field is required',
            expected: 'string',
            actual: 'undefined'
          }]
        );
      });

      it('validates string min length', () => {
        const schema = Schema.string().min(5);
        expect(validate('hello', schema)).toBe('hello');

        expectValidationError(
          () => validate('hi', schema),
          [{
            path: 'root',
            message: 'String length 2 is less than minimum 5',
            expected: '>= 5',
            actual: 2
          }]
        );
      });
    });

    // Tests for all other types and edge cases
  });
  ```

#### Step 3.2: Write integration tests
- [ ] Complex schema tests in `tests/features/validator/integration.test.js`:
  ```javascript
  describe('Validator Integration', () => {
    it('validates nested object schemas', () => {
      const schema = Schema.object({
        user: Schema.object({
          name: Schema.string().required().min(2),
          age: Schema.number().min(0).max(120),
          email: Schema.string().pattern(/^[^@]+@[^@]+$/)
        }).required(),
        tags: Schema.array(Schema.string())
      });

      const validData = {
        user: {
          name: 'John Doe',
          age: 30,
          email: 'john@example.com'
        },
        tags: ['customer', 'premium']
      };

      const result = validate(validData, schema);
      expect(result).toEqual(validData);
    });

    it('reports multiple errors at once', () => {
      const schema = Schema.object({
        name: Schema.string().required(),
        age: Schema.number().required()
      });

      expectValidationError(
        () => validate({}, schema),
        [
          {
            path: 'name',
            message: 'Field is required',
            expected: 'string',
            actual: 'undefined'
          },
          {
            path: 'age',
            message: 'Field is required',
            expected: 'number',
            actual: 'undefined'
          }
        ]
      );
    });
  });
  ```

#### Step 3.3: Create main exports
- [ ] Update `src/features/validator/index.js`:
  ```javascript
  const { Schema } = require('./schema');
  const { validate } = require('./engine');
  const { ValidationError } = require('./errors');

  module.exports = {
    Schema,
    validate,
    ValidationError
  };
  ```

- [ ] Update `src/index.js` to export validator:
  ```javascript
  // Existing exports...
  const validator = require('./features/validator');

  module.exports = {
    // Existing exports...
    ...validator
  };
  ```

### Phase 4: Documentation and Examples

#### Step 4.1: Add JSDoc comments
- [ ] Document all public APIs with JSDoc
- [ ] Include parameter types and return values
- [ ] Add usage examples in comments

#### Step 4.2: Create feature documentation
- [ ] Create `ai-docs/features/validator.md` with:
  - Overview and purpose
  - API reference
  - Usage examples
  - Common patterns
  - Troubleshooting guide

#### Step 4.3: Add examples
- [ ] Create `examples/validator-basic.js`
- [ ] Create `examples/validator-advanced.js`
- [ ] Ensure examples run without errors

## File Organization

### New Files to Create
```
src/
├── features/
│   └── validator/
│       ├── index.js          # Main exports
│       ├── schema.js         # Schema builder
│       ├── engine.js         # Validation engine
│       └── errors.js         # ValidationError class
├── tests/
│   └── features/
│       └── validator/
│           ├── schema.test.js
│           ├── engine.test.js
│           ├── integration.test.js
│           └── helpers.js
└── examples/
    ├── validator-basic.js
    └── validator-advanced.js
```

### Files to Modify
- `src/index.js` - Export validator module
- `package.json` - Add test script if needed
- `README.md` - Add validator to feature list

## Validation Criteria

### Code Quality Checks
- [ ] All tests pass with 100% coverage
- [ ] No linting errors
- [ ] Follows repository coding standards
- [ ] Proper error handling (fail-hard)
- [ ] Clear function/variable naming

### Functional Validation
- [ ] All design requirements implemented
- [ ] All success criteria met
- [ ] Edge cases handled appropriately
- [ ] Performance requirements satisfied (<5ms)

### Documentation Complete
- [ ] Code comments explain complex logic
- [ ] API documentation complete
- [ ] Feature documentation created
- [ ] Examples working

## Risk Mitigation

### Identified Risks
1. **Risk**: Complex nested validation performance
   - **Mitigation**: Implement depth limit (10 levels)
   - **Fallback**: Add performance warnings in docs

2. **Risk**: Error message clarity for deep paths
   - **Mitigation**: Use dot notation for paths (user.address.city)
   - **Fallback**: Provide path array alternative

### Rollback Plan
1. Remove validator directory: `rm -rf src/features/validator`
2. Revert changes to `src/index.js`
3. Remove test directory: `rm -rf tests/features/validator`
4. Remove examples and documentation

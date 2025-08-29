# User Input Validator

A robust, zero-dependency validation system for Node.js applications that ensures data integrity through strict schema validation.

## Features

- 🚀 **Fast**: <3ms validation for typical payloads
- 🛡️ **Type-safe**: Comprehensive type checking with clear errors
- 🎯 **Fail-hard**: No silent failures or data corruption
- 📦 **Zero dependencies**: No external packages required
- 🔧 **Flexible**: Support for complex nested structures
- 💡 **Developer-friendly**: Intuitive API with helpful error messages

## Installation

The validator is built into the core package. No additional installation required.

```javascript
const { Schema, validate } = require('your-package');
```

## Quick Start

### Basic Validation

```javascript
// Define a schema
const userSchema = Schema.object({
  name: Schema.string().required().min(2).max(50),
  age: Schema.number().required().min(0).max(120),
  email: Schema.string().required().pattern(/^[^@]+@[^@]+$/),
  isActive: Schema.boolean()
});

// Validate data
try {
  const validatedData = validate(userData, userSchema);
  console.log('Valid data:', validatedData);
} catch (error) {
  if (error.isValidationError) {
    console.error('Validation failed:', error.errors);
  }
}
```

### Error Handling

Validation errors include detailed information for debugging:

```javascript
try {
  validate({ name: 'J' }, userSchema);
} catch (error) {
  console.log(error.message);
  // "Validation failed with 3 errors:
  //   - name: String length 1 is less than minimum 2
  //   - age: Field is required
  //   - email: Field is required"

  console.log(error.errors);
  // [
  //   { path: 'name', message: 'String length 1 is less than minimum 2', ... },
  //   { path: 'age', message: 'Field is required', ... },
  //   { path: 'email', message: 'Field is required', ... }
  // ]
}
```

## API Reference

### Schema Types

#### `Schema.string()`
Creates a string schema.

```javascript
Schema.string()
  .required()           // Field must be present
  .min(length)         // Minimum string length
  .max(length)         // Maximum string length
  .pattern(regex)      // Must match pattern
  .enum(['a', 'b'])    // Must be one of values
```

#### `Schema.number()`
Creates a number schema.

```javascript
Schema.number()
  .required()           // Field must be present
  .min(value)          // Minimum value
  .max(value)          // Maximum value
  .integer()           // Must be integer
  .positive()          // Must be positive
  .negative()          // Must be negative
```

#### `Schema.boolean()`
Creates a boolean schema.

```javascript
Schema.boolean()
  .required()           // Field must be present
```

#### `Schema.object(shape)`
Creates an object schema with nested validation.

```javascript
Schema.object({
  field1: Schema.string(),
  field2: Schema.number(),
  nested: Schema.object({
    deep: Schema.boolean()
  })
})
  .required()           // Entire object required
  .strict()            // No additional properties
```

#### `Schema.array(items)`
Creates an array schema.

```javascript
Schema.array(Schema.string())  // Array of strings
  .required()                   // Array must be present
  .min(length)                 // Minimum items
  .max(length)                 // Maximum items
  .unique()                    // No duplicate items
```

#### `Schema.literal(value)`
Matches an exact value.

```javascript
Schema.literal('active')        // Must be exactly 'active'
Schema.literal(42)             // Must be exactly 42
```

#### `Schema.union(schemas)`
Allows multiple possible types.

```javascript
Schema.union([
  Schema.string(),
  Schema.number()
])  // Can be string OR number
```

### Validation Function

#### `validate(data, schema)`
Validates data against a schema.

**Parameters:**
- `data`: The data to validate
- `schema`: Schema object created with Schema builders

**Returns:** Validated data (with type normalization)

**Throws:** `ValidationError` with detailed error information

```javascript
const validated = validate(inputData, schema);
```

### ValidationError

The error thrown when validation fails.

**Properties:**
- `message`: Human-readable error summary
- `errors`: Array of error details
- `isValidationError`: Always `true` for type checking

**Error Detail Structure:**
```javascript
{
  path: 'user.email',        // Path to failing field
  message: 'Field is required',  // What went wrong
  expected: 'string',        // Expected type/value
  actual: 'undefined'        // Actual type/value
}
```

## Advanced Usage

### Nested Object Validation

```javascript
const orderSchema = Schema.object({
  orderId: Schema.string().required(),
  customer: Schema.object({
    id: Schema.number().required(),
    name: Schema.string().required(),
    contact: Schema.object({
      email: Schema.string().pattern(/^[^@]+@[^@]+$/),
      phone: Schema.string().pattern(/^\+?[\d\s-()]+$/)
    }).required()
  }).required(),
  items: Schema.array(
    Schema.object({
      productId: Schema.string().required(),
      quantity: Schema.number().integer().positive().required(),
      price: Schema.number().positive().required()
    })
  ).min(1).required(),
  status: Schema.literal('pending')
});
```

### Custom Validation Messages

```javascript
const schema = Schema.string()
  .required()
  .pattern(/^[A-Z]/, 'Must start with uppercase letter')
  .custom(
    value => value !== 'FORBIDDEN',
    'This value is not allowed'
  );
```

### Conditional Validation

```javascript
const schema = Schema.object({
  type: Schema.literal('email').required(),
  value: Schema.string()
    .required()
    .pattern(/^[^@]+@[^@]+$/)
}).or(Schema.object({
  type: Schema.literal('phone').required(),
  value: Schema.string()
    .required()
    .pattern(/^\+?[\d\s-()]+$/)
}));
```

### Type Normalization

The validator safely normalizes certain types:

```javascript
// Number normalization
validate('123', Schema.number());  // Returns: 123
validate('abc', Schema.number());  // Throws: ValidationError

// Boolean normalization
validate('true', Schema.boolean());   // Returns: true
validate('false', Schema.boolean());  // Returns: false
validate('yes', Schema.boolean());    // Throws: ValidationError
```

## Best Practices

### 1. Define Schemas Once

```javascript
// Good: Define once, reuse everywhere
const schemas = {
  user: Schema.object({...}),
  product: Schema.object({...})
};

// Bad: Recreating schemas
function validateUser(data) {
  const schema = Schema.object({...}); // Created every time
  return validate(data, schema);
}
```

### 2. Use Specific Error Handling

```javascript
try {
  const result = validate(data, schema);
} catch (error) {
  if (error.isValidationError) {
    // Handle validation errors
    res.status(400).json({
      error: 'Validation failed',
      details: error.errors
    });
  } else {
    // Handle other errors
    throw error;
  }
}
```

### 3. Compose Complex Schemas

```javascript
// Reusable schema parts
const addressSchema = Schema.object({
  street: Schema.string().required(),
  city: Schema.string().required(),
  zipCode: Schema.string().pattern(/^\d{5}$/)
});

// Compose into larger schemas
const userSchema = Schema.object({
  name: Schema.string().required(),
  homeAddress: addressSchema,
  workAddress: addressSchema.optional()
});
```

## Common Patterns

### API Request Validation

```javascript
app.post('/api/users', (req, res) => {
  try {
    const validated = validate(req.body, userCreationSchema);
    const user = await createUser(validated);
    res.json(user);
  } catch (error) {
    if (error.isValidationError) {
      res.status(400).json({
        error: 'Invalid request data',
        details: error.errors
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

### Configuration Validation

```javascript
const configSchema = Schema.object({
  port: Schema.number().integer().min(1).max(65535).required(),
  host: Schema.string().required(),
  database: Schema.object({
    url: Schema.string().required(),
    poolSize: Schema.number().integer().positive()
  }).required()
});

function loadConfig() {
  const config = JSON.parse(fs.readFileSync('config.json'));
  return validate(config, configSchema);
}
```

### Form Validation

```javascript
const registrationSchema = Schema.object({
  username: Schema.string()
    .required()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z0-9_]+$/),
  email: Schema.string()
    .required()
    .pattern(/^[^@]+@[^@]+$/),
  password: Schema.string()
    .required()
    .min(8)
    .pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/),
  confirmPassword: Schema.string().required(),
  acceptTerms: Schema.boolean().literal(true)
});

// Additional validation for password match
function validateRegistration(data) {
  const validated = validate(data, registrationSchema);

  if (validated.password !== validated.confirmPassword) {
    throw new ValidationError([{
      path: 'confirmPassword',
      message: 'Passwords do not match'
    }]);
  }

  return validated;
}
```

## Troubleshooting

### Common Issues

#### "Maximum validation depth exceeded"
**Cause**: Circular schema references or very deep nesting
**Solution**: Check for recursive schemas, increase depth limit if needed

#### Slow validation performance
**Cause**: Large arrays without schema caching
**Solution**: Reuse schema objects instead of recreating them

#### Unexpected type errors
**Cause**: JavaScript type coercion
**Solution**: Use strict type checking, validate inputs early

### Performance Tips

1. **Reuse Schemas**: Create schemas once and reuse them
2. **Validate Early**: Validate at system boundaries
3. **Appropriate Depth**: Set reasonable nesting limits
4. **Batch Validation**: Validate arrays efficiently

## Migration Guide

### From Manual Validation

```javascript
// Before: Manual validation
function validateUser(user) {
  if (!user || typeof user !== 'object') {
    throw new Error('User must be object');
  }
  if (!user.name || typeof user.name !== 'string') {
    throw new Error('Name required');
  }
  if (user.name.length < 2) {
    throw new Error('Name too short');
  }
  // ... many more checks
}

// After: Schema validation
const userSchema = Schema.object({
  name: Schema.string().required().min(2),
  // ... other fields
});

function validateUser(user) {
  return validate(user, userSchema);
}
```

## See Also

- [Design Document](../ai-design/20251216_design_example_feature.md)
- [Implementation Details](../ai-implementation/20251216_implementation_example_feature.md)
- [Development Process](../promptonomicon/4_DEVELOPMENT_PROCESS.md)

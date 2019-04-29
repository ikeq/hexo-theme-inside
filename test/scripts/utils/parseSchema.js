'use strict';

describe('utils/parseSchema()', function () {
  const { parseSchema } = require('../../../lib/utils');

  it('string', function () {
    const schema = { type: 'string' }
    expect(parseSchema(schema, "This is a string")).toBe("This is a string")
    expect(parseSchema(schema, '')).toBe('')
    expect(parseSchema(schema, 1)).toBeUndefined()
  });

  it('string/length', function () {
    const schema = { type: 'string', minLength: 1, maxLength: 3 }
    expect(parseSchema(schema, '')).toBeUndefined()
    expect(parseSchema(schema, '1')).toBe('1')
    expect(parseSchema(schema, '1234')).toBeUndefined()
  })

  it('string/pattern', function () {
    const schema = { type: 'string', pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$" }
    expect(parseSchema(schema, '555-1212')).toBe('555-1212')
    expect(parseSchema(schema, '(888)555-1212')).toBe('(888)555-1212')
    expect(parseSchema(schema, '(800)FLOWERS')).toBeUndefined()
  })

  it('string/format', function () {
    // support date, email, uri, uri-reference, regex
    const date = { type: 'string', format: 'date' }
    const email = { type: 'string', format: 'email' }

    expect(parseSchema(date, '2018-11-13')).toBe('2018-11-13')
    expect(parseSchema(email, 'a@a.a')).toBe('a@a.a')

    expect(parseSchema(date, '2018-11-13-')).toBeUndefined()
    expect(parseSchema(email, 'a@a.a.')).toBeUndefined()
  })

  it('number', function () {
    const schema = { type: 'number' }
    expect(parseSchema(schema, 0)).toBe(0)
    expect(parseSchema(schema, '0')).toBeUndefined()
  });

  it('number/range', function () {
    const schema = { type: 'number', minimum: 1, maximum: 4 }

    expect(parseSchema(schema, 0)).toBeUndefined()
    expect(parseSchema(schema, 1)).toBe(1)
    expect(parseSchema(schema, 5)).toBeUndefined()
  });

  it('boolean', function () {
    const schema = { type: 'boolean' }
    expect(parseSchema(schema, 0)).toBeUndefined()
    expect(parseSchema(schema, false)).toBe(false)
    expect(parseSchema(schema, true)).toBe(true)
  });

  it('enum', function () {
    expect(parseSchema({ enum: [1, 3, 5] }, 0)).toBeUndefined()
    expect(parseSchema({ enum: [1, 3, false] }, false)).toBe(false)
    expect(parseSchema({ enum: ['1', 3, '5'] }, 3)).toBe(3)
    expect(parseSchema({ enum: ['1', '3', '5'] }, '3')).toBe('3')
  });

  it('array', function () {
    const schema = { type: 'array' }
    expect(parseSchema(schema, [1, 2, '3'])).toEqual([1, 2, '3'])
    expect(parseSchema(schema, { "Not": "an array" })).toBeUndefined()
  });

  it('array/contains', function () {
    const schema = { type: 'array', contains: { type: 'string' } }
    expect(parseSchema(schema, [1, 2, 'contains a string'])).toEqual([1, 2, 'contains a string'])
    expect(parseSchema(schema, [1, 2, 3])).toBeUndefined()
  });

  it('array/items', function () {
    const schema = { type: 'array', items: { type: 'string' } }
    expect(parseSchema(schema, [1, 2, 3])).toBeUndefined()
    expect(parseSchema(schema, ['1', '2', '3'])).toEqual(['1', '2', '3'])
  });

  it('array/tuple', function () {
    const schema = { type: 'array', items: [{ type: 'number' }, { type: 'string' }], additionalItems: { type: 'boolean' } }
    expect(parseSchema(schema, [1, 2, 3])).toBeUndefined()
    expect(parseSchema(schema, [1, '2', '3'])).toBeUndefined()
    expect(parseSchema(schema, [1, '2', false])).toEqual([1, '2', false])

    schema.additionalItems = false
    expect(parseSchema(schema, [1, '2', false])).toBeUndefined()

    delete schema.additionalItems
    expect(parseSchema(schema, [1, '2', false])).toEqual([1, '2', false])
  });

  it('array/length', function () {
    const schema = { type: 'array', minItems: 2, maxItems: 2 }
    expect(parseSchema(schema, [1, 2, 3])).toBeUndefined()
    expect(parseSchema(schema, [1, 2])).toEqual([1, 2])
  });

  it('array/uniqueItems', function () {
    const schema = { type: 'array', uniqueItems: true }
    expect(parseSchema(schema, [1, 2, 1])).toBeUndefined()
    expect(parseSchema(schema, [1, { two: 2 }, { two: 2 }])).toBeUndefined()
    expect(parseSchema(schema, [1, { two: 2 }, { three: 3 }])).toEqual([1, { two: 2 }, { three: 3 }])
  });

  it('object', function () {
    const schema = { type: 'object' }
    expect(parseSchema(schema, {})).toEqual({})
    expect(parseSchema(schema, { a: 1 })).toEqual({ a: 1 })
    expect(parseSchema(schema, ["An", "array", "not", "an", "object"])).toEqual({})
  });

  it('object/properties', function () {
    const schema = {
      type: 'object',
      "properties": {
        "number": { "type": "number" },
        "string": { "type": "string" },
        "enum": {
          "type": "string",
          "enum": ["a", "b", "c"]
        }
      }
    }
    expect(parseSchema(schema, { "number": 1, "string": "string", "enum": "a" })).toEqual({ "number": 1, "string": "string", "enum": "a" })
    // a standard implementation should fail
    expect(parseSchema(schema, { "number": "1", "string": "string", "enum": "d" })).toEqual({ "string": "string" })
    expect(parseSchema(schema, {})).toEqual({})
  });


  it('object/additionalProperties', function () {
    const schema = {
      type: 'object',
      "properties": {
        "number": { "type": "number" }
      },
      additionalProperties: false
    }
    expect(parseSchema(schema, { "number": '1', "string": "string" })).toEqual({})
    expect(parseSchema(schema, { "number": 1, "string": "string" })).toEqual({ "number": 1 })

    schema.additionalProperties = { "type": "string" };
    expect(parseSchema(schema, { "number": 1, "string": "string" })).toEqual({ "number": 1, "string": "string" })
    expect(parseSchema(schema, { "number": 1, "string": false })).toEqual({ "number": 1 })
    // a standard implementation should fail
    // expect(parseSchema(schema, { "number": "1", "string": "string", "enum": "d" })).toEqual({ "string": "string" })
    // expect(parseSchema(schema, {})).toEqual({})
  });

  it('object/size', function () {
    const schema = {
      "type": "object",
      "minProperties": 2,
      "maxProperties": 3
    }
    expect(parseSchema(schema, { "a": 0 })).toEqual({})
    expect(parseSchema(schema, { "a": 0, "b": 1 })).toEqual({ "a": 0, "b": 1 })
    expect(parseSchema(schema, { "a": 0, "b": 1, "c": 2, "d": 3 })).toEqual({})
  });

  it('object/patternProperties', function () {
    let schema = {
      "type": "object",
      "patternProperties": {
        "^S_": { "type": "string" },
        "^I_": { "type": "number" }
      },
      "additionalProperties": false
    }
    expect(parseSchema(schema, { "S_25": "This is a string" })).toEqual({ "S_25": "This is a string" })
    expect(parseSchema(schema, { "I_0": 42 })).toEqual({ "I_0": 42 })
    expect(parseSchema(schema, { "S_0": 42 })).toEqual({})
    expect(parseSchema(schema, { "I_42": "This is a string" })).toEqual({})

    schema = Object.assign(schema, {
      properties: {
        builtin: { "type": "number" },
      },
      additionalProperties: { "type": "string" }
    })
    expect(parseSchema(schema, { "builtin": 42 })).toEqual({ "builtin": 42 })
    expect(parseSchema(schema, { "keyword": "value" })).toEqual({ "keyword": "value" })
    expect(parseSchema(schema, { "keyword": 42 })).toEqual({})
  });

  it('object/dependencies', function () {
    //
  });

  it('object/required', function () {
    //
  });
});

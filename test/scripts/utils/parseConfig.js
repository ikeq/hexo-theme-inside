'use strict';

describe('utils/parseConfig()', function () {
  const { parseConfig } = require('../../../lib/utils');

  it('string', function () {
    const schema = { type: 'string' }
    expect(parseConfig(schema, "This is a string")).toBe("This is a string")
    expect(parseConfig(schema, '')).toBe('')
    expect(parseConfig(schema, 1)).toBeUndefined()
  });

  it('string/length', function () {
    const schema = { type: 'string', minLength: 1, maxLength: 3 }
    expect(parseConfig(schema, '')).toBeUndefined()
    expect(parseConfig(schema, '1')).toBe('1')
    expect(parseConfig(schema, '1234')).toBeUndefined()
  })

  it('string/pattern', function () {
    const schema = { type: 'string', pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$" }
    expect(parseConfig(schema, '555-1212')).toBe('555-1212')
    expect(parseConfig(schema, '(888)555-1212')).toBe('(888)555-1212')
    expect(parseConfig(schema, '(800)FLOWERS')).toBeUndefined()
  })

  it('string/format', function () {
    // support date, email, uri, uri-reference, regex
    const date = { type: 'string', format: 'date' }
    const email = { type: 'string', format: 'email' }

    expect(parseConfig(date, '2018-11-13')).toBe('2018-11-13')
    expect(parseConfig(email, 'a@a.a')).toBe('a@a.a')

    expect(parseConfig(date, '2018-11-13-')).toBeUndefined()
    expect(parseConfig(email, 'a@a.a.')).toBeUndefined()
  })

  it('number', function () {
    const schema = { type: 'number' }
    expect(parseConfig(schema, 0)).toBe(0)
    expect(parseConfig(schema, '0')).toBeUndefined()
  });

  it('number/range', function () {
    const schema = { type: 'number', minimum: 1, maximum: 4 }

    expect(parseConfig(schema, 0)).toBeUndefined()
    expect(parseConfig(schema, 1)).toBe(1)
    expect(parseConfig(schema, 5)).toBeUndefined()
  });

  it('boolean', function () {
    const schema = { type: 'boolean' }
    expect(parseConfig(schema, 0)).toBeUndefined()
    expect(parseConfig(schema, false)).toBe(false)
    expect(parseConfig(schema, true)).toBe(true)
  });

  it('enum', function () {
    expect(parseConfig({ enum: [1, 3, 5] }, 0)).toBeUndefined()
    expect(parseConfig({ enum: [1, 3, false] }, false)).toBe(false)
    expect(parseConfig({ enum: ['1', 3, '5'] }, 3)).toBe(3)
    expect(parseConfig({ enum: ['1', '3', '5'] }, '3')).toBe('3')
  });

  it('array', function () {
    const schema = { type: 'array' }
    expect(parseConfig(schema, [1, 2, '3'])).toEqual([1, 2, '3'])
    expect(parseConfig(schema, { "Not": "an array" })).toBeUndefined()
  });

  it('array/contains', function () {
    const schema = { type: 'array', contains: { type: 'string' } }
    expect(parseConfig(schema, [1, 2, 'contains a string'])).toEqual([1, 2, 'contains a string'])
    expect(parseConfig(schema, [1, 2, 3])).toBeUndefined()
  });

  it('array/items', function () {
    const schema = { type: 'array', items: { type: 'string' } }
    expect(parseConfig(schema, [1, 2, 3])).toBeUndefined()
    expect(parseConfig(schema, ['1', '2', '3'])).toEqual(['1', '2', '3'])
  });

  it('array/tuple', function () {
    const schema = { type: 'array', items: [{ type: 'number' }, { type: 'string' }], additionalItems: { type: 'boolean' } }
    expect(parseConfig(schema, [1, 2, 3])).toBeUndefined()
    expect(parseConfig(schema, [1, '2', '3'])).toBeUndefined()
    expect(parseConfig(schema, [1, '2', false])).toEqual([1, '2', false])

    schema.additionalItems = false
    expect(parseConfig(schema, [1, '2', false])).toBeUndefined()

    delete schema.additionalItems
    expect(parseConfig(schema, [1, '2', false])).toEqual([1, '2', false])
  });

  it('array/length', function () {
    const schema = { type: 'array', minItems: 2, maxItems: 2 }
    expect(parseConfig(schema, [1, 2, 3])).toBeUndefined()
    expect(parseConfig(schema, [1, 2])).toEqual([1, 2])
  });

  it('array/uniqueItems', function () {
    const schema = { type: 'array', uniqueItems: true }
    expect(parseConfig(schema, [1, 2, 1])).toBeUndefined()
    expect(parseConfig(schema, [1, { two: 2 }, { two: 2 }])).toBeUndefined()
    expect(parseConfig(schema, [1, { two: 2 }, { three: 3 }])).toEqual([1, { two: 2 }, { three: 3 }])
  });

  it('array/objectItems', function () {
    const schema = { type: 'array', items: { type: 'object', properties: { name: 'string', age: 'number' }, required: ['name', 'age'] } }
    expect(parseConfig(schema, [1, 2, 1])).toBeUndefined()
    expect(parseConfig(schema, [{ name: '1' }, { age: 2 }])).toBeUndefined()
    expect(parseConfig(schema, [{ name: '1', age: 2 }, { name: '1', age: 2 }])).toEqual([{ name: '1', age: 2 }, { name: '1', age: 2 }])
  });

  it('object', function () {
    const schema = { type: 'object' }
    expect(parseConfig(schema, {})).toEqual({})
    expect(parseConfig(schema, { a: 1 })).toEqual({ a: 1 })
    expect(parseConfig(schema, ["An", "array", "not", "an", "object"])).toBe(undefined);
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
    expect(parseConfig(schema, { "number": 1, "string": "string", "enum": "a" })).toEqual({ "number": 1, "string": "string", "enum": "a" })
    // a standard implementation should fail
    expect(parseConfig(schema, { "number": "1", "string": "string", "enum": "d" })).toEqual({ "string": "string" })
    expect(parseConfig(schema, {})).toEqual({})
  });


  it('object/additionalProperties', function () {
    const schema = {
      type: 'object',
      "properties": {
        "number": { "type": "number" }
      },
      additionalProperties: false
    }
    expect(parseConfig(schema, { "number": '1', "string": "string" })).toBe(undefined);
    expect(parseConfig(schema, { "number": 1, "string": "string" })).toEqual({ "number": 1 })

    schema.additionalProperties = { "type": "string" };
    expect(parseConfig(schema, { "number": 1, "string": "string" })).toEqual({ "number": 1, "string": "string" })
    expect(parseConfig(schema, { "number": 1, "string": false })).toEqual({ "number": 1 })
    // a standard implementation should fail
    // expect(parseConfig(schema, { "number": "1", "string": "string", "enum": "d" })).toEqual({ "string": "string" })
    // expect(parseConfig(schema, {})).toEqual({})
  });

  it('object/size', function () {
    const schema = {
      "type": "object",
      "minProperties": 2,
      "maxProperties": 3
    }
    expect(parseConfig(schema, { "a": 0 })).toBe(undefined);
    expect(parseConfig(schema, { "a": 0, "b": 1 })).toEqual({ "a": 0, "b": 1 })
    expect(parseConfig(schema, { "a": 0, "b": 1, "c": 2, "d": 3 })).toBe(undefined);
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
    expect(parseConfig(schema, { "S_25": "This is a string" })).toEqual({ "S_25": "This is a string" })
    expect(parseConfig(schema, { "I_0": 42 })).toEqual({ "I_0": 42 })
    expect(parseConfig(schema, { "S_0": 42 })).toBe(undefined);
    expect(parseConfig(schema, { "I_42": "This is a string" })).toBe(undefined);

    schema = Object.assign(schema, {
      properties: {
        builtin: { "type": "number" },
      },
      additionalProperties: { "type": "string" }
    })
    expect(parseConfig(schema, { "builtin": 42 })).toEqual({ "builtin": 42 })
    expect(parseConfig(schema, { "keyword": "value" })).toEqual({ "keyword": "value" })
    expect(parseConfig(schema, { "keyword": 42 })).toBe(undefined);
  });

  it('object/required', function () {
    const schema = {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "email": { "type": "string" },
        "address": { "type": "string" },
        "telephone": { "type": "string" }
      },
      "required": ["name", "email"]
    };

    expect(parseConfig(schema, {
      "name": "William Shakespeare",
      "email": "bill@stratford-upon-avon.co.uk"
    }))
      .toEqual({
        "name": "William Shakespeare",
        "email": "bill@stratford-upon-avon.co.uk"
      });
    expect(parseConfig(schema, {
      "name": "William Shakespeare",
      "email": "bill@stratford-upon-avon.co.uk",
      "address": "Henley Street, Stratford-upon-Avon, Warwickshire, England",
      "authorship": "in question"
    }))
      .toEqual({
        "name": "William Shakespeare",
        "email": "bill@stratford-upon-avon.co.uk",
        "address": "Henley Street, Stratford-upon-Avon, Warwickshire, England",
        "authorship": "in question"
      });
    expect(parseConfig(schema, {
      "name": "William Shakespeare",
      "address": "Henley Street, Stratford-upon-Avon, Warwickshire, England",
    }))
      .toBe(undefined);

    // fallback to default
    schema.properties.email.default = 'a@a.a';
    expect(parseConfig(schema, {
      "name": "William Shakespeare",
      "address": "Henley Street, Stratford-upon-Avon, Warwickshire, England",
    }))
      .toEqual({
        "name": "William Shakespeare",
        "email": "a@a.a",
        "address": "Henley Street, Stratford-upon-Avon, Warwickshire, England",
      });
  })

  it('object/dependencies', function () {
    const schema = {
      "type": "object",

      "properties": {
        "name": { "type": "string" },
        "credit_card": { "type": "number" },
        "billing_address": { "type": "string" }
      },

      "required": ["name"],

      "dependencies": {
        "credit_card": ["billing_address"]
      }
    };

    // Property dependencies

    expect(parseConfig(schema, {
      "name": "John Doe",
      "credit_card": 5555555555555555,
      "billing_address": "555 Debtor's Lane"
    }))
      .toEqual({
        "name": "John Doe",
        "credit_card": 5555555555555555,
        "billing_address": "555 Debtor's Lane"
      });

    expect(parseConfig(schema, {
      "name": "John Doe",
      "credit_card": 5555555555555555
    }))
      .toBe(undefined);

    expect(parseConfig(schema, {
      "name": "John Doe"
    }))
      .toEqual({
        "name": "John Doe"
      });

    expect(parseConfig(schema, {
      "name": "John Doe",
      "billing_address": "555 Debtor's Lane"
    }))
      .toEqual({
        "name": "John Doe",
        "billing_address": "555 Debtor's Lane"
      });

    // bidirectional
    schema.dependencies = {
      "credit_card": ["billing_address"],
      "billing_address": ["credit_card"]
    };
    expect(parseConfig(schema, {
      "name": "John Doe",
      "credit_card": 5555555555555555
    }))
      .toBe(undefined);
    expect(parseConfig(schema, {
      "name": "John Doe",
      "billing_address": "555 Debtor's Lane"
    }))
      .toBe(undefined);

    // Schema dependencies
    schema.dependencies = {
      "credit_card": {
        "properties": {
          "billing_address": { "type": "string" }
        },
        "required": ["billing_address"]
      }
    };
    expect(parseConfig(schema, {
      "name": "John Doe",
      "credit_card": 5555555555555555,
      "billing_address": "555 Debtor's Lane"
    }))
      .toEqual({
        "name": "John Doe",
        "credit_card": 5555555555555555,
        "billing_address": "555 Debtor's Lane"
      });
    expect(parseConfig(schema, {
      "name": "John Doe",
      "credit_card": 5555555555555555
    }))
      .toBe(undefined);
    expect(parseConfig(schema, {
      "name": "John Doe",
      "billing_address": "555 Debtor's Lane"
    }))
      .toEqual({
        "name": "John Doe",
        "billing_address": "555 Debtor's Lane"
      });

  });

  it('definitions', function () {
    const schema = {
      definitions: {
        age: { type: 'number' },
        gender: { $id: '#gender', enum: ['male', 'female', 'other'] }
      },
      type: 'object',
      properties: {
        age: { $ref: '#/definitions/age' },
        gender: { $ref: '#gender' },
        class: {
          definitions: {
            color: { type: 'string' }
          },
          type: 'object',
          properties: {
            color: { $ref: '#/properties/class/definitions/color' }
          }
        }
      }
    };

    expect(parseConfig(schema, {
      age: 1,
      gender: 'other',
      class: { color: 0 }
    }))
      .toEqual({
        age: 1,
        gender: 'other'
      });

    expect(parseConfig(schema, {
      age: 1,
      gender: 'other',
      class: { color: 'this is a string' }
    }))
      .toEqual({
        age: 1,
        gender: 'other',
        class: { color: 'this is a string' }
      });
  });

  it('anyOf', function () {
    const schema = {
      "anyOf": [
        { "type": "string", "maxLength": 5 },
        { "type": "number", "minimum": 0 }
      ]
    };

    expect(parseConfig(schema, "short")).toBe("short")
    expect(parseConfig(schema, "too long")).toBeUndefined()
    expect(parseConfig(schema, 12)).toBe(12)
    expect(parseConfig(schema, -5)).toBeUndefined()
  });

  it('allOf', function () {
    let schema = {
      "allOf": [
        { "type": "string" },
        { "type": "string", "maxLength": 5 }
      ]
    };

    expect(parseConfig(schema, "short")).toBe("short")
    expect(parseConfig(schema, "too long")).toBeUndefined()

    schema = {
      "definitions": {
        "address": {
          "type": "object",
          "properties": {
            "street_address": { "type": "string" },
            "city": { "type": "string" },
            "state": { "type": "string" }
          },
          "required": ["street_address", "city", "state"]
        }
      },
      "allOf": [
        { "$ref": "#/definitions/address" },
        {
          "properties": {
            "type": { "enum": ["residential", "business"] }
          }
        }
      ]
    };

    expect(parseConfig(schema, {
      "street_address": "1600 Pennsylvania Avenue NW",
      "city": "Washington",
      "state": "DC",
      "type": "business"
    }))
      .toEqual({
        "street_address": "1600 Pennsylvania Avenue NW",
        "city": "Washington",
        "state": "DC",
        "type": "business"
      });

    schema.additionalProperties = false
    expect(parseConfig(schema, {
      "street_address": "1600 Pennsylvania Avenue NW",
      "city": "Washington",
      "state": "DC",
      "type": "business"
    })).toBe(undefined)
  });
});

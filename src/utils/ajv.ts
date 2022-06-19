import { contains4ByteChar, containsComma, onlyContainsEmojis } from '@utils/index.js'
import Ajv, { AnySchema, KeywordDefinition } from 'ajv'

const keywords: KeywordDefinition[] = [
  {
    keyword: 'commaNotAllowed',
    type: 'string',
    validate (_schema: unknown, data: string) {
      return !containsComma(data)
    }
  },
  {
    keyword: '_4ByteCharacterNotAllowed',
    type: 'string',
    validate (_schema: unknown, data: string) {
      return !contains4ByteChar(data)
    }
  },
  {
    keyword: 'notContainsOnlyEmojis',
    type: 'string',
    validate (_schema: unknown, data: string) {
      return !onlyContainsEmojis(data)
    }
  }
]

const arraySchemas: AnySchema[] = [
  {
    $id: '#array-strings',
    type: 'array',
    items: {
      $ref: '#string'
    }
  },
  {
    $id: '#array-strings-not-empty',
    type: 'array',
    minItems: 1,
    items: {
      $ref: '#string-not-empty'
    }
  },
  {
    $id: '#array-strings-nullable',
    type: 'array',
    nullable: true,
    items: {
      $ref: '#string-nullable'
    }
  },
  {
    $id: '#array-strings-not-empty-nullable',
    type: 'array',
    nullable: true,
    minItems: 1,
    items: {
      $ref: '#string-not-empty-nullable'
    }
  }
]
const stringSchemas: AnySchema[] = [
  {
    $id: '#string',
    type: 'string'
  },
  {
    $id: '#string-not-empty',
    type: 'string',
    minLength: 1
  },
  {
    $id: '#string-nullable',
    type: 'string',
    nullable: true
  },
  {
    $id: '#string-not-empty-nullable',
    type: 'string',
    nullable: true,
    minLength: 1
  },
  {
    $id: '#string-or-array',
    type: ['string', 'array'],
    oneOf: [
      {
        $ref: '#string'
      },
      {
        $ref: '#array-strings'
      }
    ]
  },
  {
    $id: '#string-or-array-not-empty',
    type: ['string', 'array'],
    oneOf: [
      {
        $ref: '#string-not-empty'
      },
      {
        $ref: '#array-strings-not-empty'
      }
    ],
    errorMessage: {
      oneOf: 'should be a string not empty or an array of strings not empty'
    }
  },
  {
    $id: '#string-or-array-nullable',
    type: ['string', 'array'],
    nullable: true,
    oneOf: [
      {
        $ref: '#string-nullable'
      },
      {
        $ref: '#array-strings-nullable'
      }
    ],
    errorMessage: {
      oneOf: 'should be a string or an array of strings or null'
    }
  },
  {
    $id: '#string-or-array-not-empty-nullable',
    type: ['string', 'array'],
    nullable: true,
    oneOf: [
      {
        $ref: '#string-not-empty-nullable'
      },
      {
        $ref: '#array-strings-not-empty-nullable'
      }
    ],
    errorMessage: {
      oneOf: 'should be a string not empty or an array of strings not empty or null'
    }
  }
]

const booleanSchemas: AnySchema[] = [
  {
    $id: '#boolean',
    type: 'boolean'
  },
  {
    $id: '#boolean-nullable',
    type: 'boolean',
    nullable: true
  },
  {
    $id: '#boolean-default-true',
    type: 'boolean',
    default: true
  },
  {
    $id: '#boolean-default-false',
    type: 'boolean',
    default: false
  },
  {
    $id: '#boolean-default-true-nullable',
    type: 'boolean',
    nullable: true,
    default: true
  },
  {
    $id: '#boolean-default-false-nullable',
    type: 'boolean',
    nullable: true,
    default: false
  }
]

const schemas: AnySchema[] = [...arraySchemas, ...stringSchemas, ...booleanSchemas]

export function ajvKeywords (ajv: Ajv): void {
  keywords.forEach((keyword) => ajv.addKeyword(keyword))
}

export function ajvUtilsSchemas (ajv: Ajv): void {
  ajv.addSchema(schemas)
}

export default {
  ajvKeywords,
  ajvUtilsSchemas
}

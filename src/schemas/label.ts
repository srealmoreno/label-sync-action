import { Label } from '@interfaces/label'
import { JSONSchemaType } from 'ajv'

export const labelSchema: JSONSchemaType<Label> = {
  type: 'object',
  required: ['name', 'color'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      commaNotAllowed: true,
      notContainsOnlyEmojis: true,
      errorMessage: {
        commaNotAllowed: 'commas are not allowed',
        notContainsOnlyEmojis: 'must contain more than native emoji'
      }
    },
    color: {
      type: 'string',
      pattern: '^[0-9a-fA-F]{6}$',
      errorMessage: {
        pattern: 'must be a valid hex color without #'
      }
    },
    description: {
      type: 'string',
      nullable: true,
      maxLength: 100,
      _4ByteCharacterNotAllowed: true,
      errorMessage: {
        _4ByteCharacterNotAllowed: '4-byte unicode characters are not allowed'
      }
    },
    aliases: {
      type: 'array',
      nullable: true,
      items: {
        type: 'string',
        $ref: '#/properties/name'
      }
    }
  }
}

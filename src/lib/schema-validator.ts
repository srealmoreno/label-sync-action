import { schemaValidatorOptions } from '@interfaces/schema-validator'
import { ajvKeywords, ajvUtilsSchemas } from '@utils/ajv.js'
import { isArray, isArrayEmpty } from '@utils/index.js'
import Ajv, { ErrorObject } from 'ajv'
import ajvErrors from 'ajv-errors'

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true })

ajvErrors(ajv)
ajvKeywords(ajv)
ajvUtilsSchemas(ajv)

export async function schemaValidator<T> ({ data, schema }: schemaValidatorOptions<T>): Promise<boolean> {
  const errors: Array<{ value: T, errors?: null | ErrorObject[] }> = []

  const validator = ajv.compile(schema)

  if (isArray(data)) {
    for (const value of data) {
      if (!validator(value)) {
        errors.push({ value, errors: validator.errors })
      }
    }
  } else {
    if (!validator(data)) {
      errors.push({ value: data, errors: validator.errors })
    }
  }

  if (isArrayEmpty(errors)) {
    return true
  }

  const messages = errors.map(({ value, errors }) => {
    const prettyValue = JSON.stringify(value)

    const msg = errors
      ?.map((error) => `${error.instancePath} ${error.message ?? error.keyword}`)
      .join('\n ')
      // Pretty error message
      .replace(/\/(\d+)/g, ':$1 -')
      .replace(/\//g, ' • ')

    return `
      Invalid value:
        ${prettyValue}
        ${msg ?? 'Unknown error'}
      `.replace(/^\s{7}/gm, '')
    // Remove The first 7 spaces from each line
  })

  throw new Error(messages.join('\n'))
}

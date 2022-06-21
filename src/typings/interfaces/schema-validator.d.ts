import { JSONSchemaType } from 'ajv'

export interface schemaValidatorOptions<T> {
  data: T[] | T
  schema: JSONSchemaType<T>
}

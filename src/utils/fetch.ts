import { isJsonFile, isYamlFile, parseJson, parseYaml } from '@utils/index.js'
import { JSONSchemaType } from 'ajv'
import axios from 'axios'

export async function getObjectFromUrl<T> (url: string, token?: string, _schema?: JSONSchemaType<T>): Promise<T> {
  const authorization: { Authorization: string } | {} = token != null ? { Authorization: `token ${token}` } : {}

  const response = await axios
    .get(url, {
      headers: {
        Accept: 'application/json, application/yaml, text/json, text/yaml, text/plain',
        ...authorization
      },
      transformResponse: (res, headers) => {
        const contentType = headers?.['content-type'] ?? ''

        if (isJsonFile(url) || /jsonc?/.test(contentType)) {
          return parseJson(res)
        }

        if (isYamlFile(url) || /ya?ml/.test(contentType)) {
          return parseYaml(res)
        }

        throw new Error(
          `Failed to get object from url: ${url} content-type: ${contentType} is not a valid json or yaml file`
        )
      }
    })
    .catch((error: Error) => {
      throw new Error(`Failed to fetch url: ${url} error: ${error.message}`)
    })

  return response.data
}

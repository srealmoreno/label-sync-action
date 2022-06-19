import { Label } from '@interfaces/label'
import { schemaValidator } from '@lib/schema-validator.js'
import { labelSchema } from '@schemas/label.js'
import {
  getUniqueByKey,
  isArrayNotEmpty,
  isArrayOfStrings,
  isString,
  normalizeString,
  resolveObject
} from '@utils/index.js'
import log from '@utils/log.js'
import { promiseSettled } from '@utils/promise.js'

function normalizeLabels (labels: Label[]): Label[] {
  const uniqueLabels = getUniqueByKey(labels, 'name')
  const normalizedLabels = uniqueLabels.map((label: Label) => {
    label.name = normalizeString(label.name)

    // Remove '#' from colors
    if (label?.color !== undefined) {
      label.color = label.color.replace(/^#/, '')
    }

    if (label?.description !== undefined) {
      label.description = normalizeString(label.description)
    }

    if (label?.aliases !== undefined) {
      label.aliases = label.aliases.map((alias: string) => normalizeString(alias))
    }

    return label
  })

  return normalizedLabels
}

async function resolveLabels (uris: string | string[]): Promise<Label[]> {
  if (isString(uris)) {
    return await resolveObject(uris)
  }

  if (isArrayOfStrings(uris)) {
    const [labels, errors] = await promiseSettled(uris.map(async (uri: string) => await resolveObject<Label[]>(uri)))

    if (isArrayNotEmpty(errors)) {
      errors.forEach((error: Error) => log.error(error.message))
    }

    if (isArrayNotEmpty(labels)) {
      return labels.flat()
    }
  }

  throw new Error('Failed to resolve labels')
}

export async function validateLabels (labels: Label[]): Promise<boolean> {
  return await schemaValidator({
    data: labels,
    schema: labelSchema
  })
}

export async function getLabels (uris: string | string[]): Promise<Label[]> {
  const labels: Label[] = normalizeLabels(await resolveLabels(uris))

  log.info(`Labels: ${JSON.stringify(labels, null, 2)}`)

  await validateLabels(labels)

  return labels
}

import { endGroup, getBooleanInput, getInput, startGroup } from '@actions/core'
import { Inputs } from '@interfaces/inputs'
import { schemaValidator } from '@lib/schema-validator.js'
import { convertStringToArray, isStringEmpty, isStringNotEmpty, normalizeString } from '@utils/index.js'
import log from '@utils/log.js'
import { inputSchema } from 'src/schemas/inputs.js'

export async function validateInputs (inputs: Inputs): Promise<Boolean> {
  return await schemaValidator({
    data: inputs,
    schema: inputSchema
  })
}

export function normaliceAccountType (str: string): 'org' | 'user' {
  const normalized = normalizeString(str).toLowerCase()

  if (normalized === 'organization') {
    return 'org'
  }

  return normalized as 'user'
}

export async function getInputsOfAction (): Promise<Inputs> {
  startGroup('Getting inputs...')
  const inputs: Inputs = {
    token: normalizeString(getInput('token')),
    configFile: convertStringToArray(getInput('config-file')),
    cleanLabels: getBooleanInput('clean-labels', { required: false })
  }

  const repos = getInput('repository')

  if (isStringNotEmpty(repos)) {
    inputs.repository = convertStringToArray(repos)
  }

  const autoDiscoverRepos = getBooleanInput('auto-discover-repos')

  if (autoDiscoverRepos) {
    inputs.autoDiscoverRepos = {
      autoDiscoverRepos,
      owner: normalizeString(getInput('owner')),
      accountType: normaliceAccountType(getInput('account-type')),
      excludeRepos: convertStringToArray(getInput('exclude-repos')),
      excludeForkedRepos: getBooleanInput('exclude-forked-repos'),
      excludeArchivedRepos: getBooleanInput('exclude-archived-repos'),
      excludeDisabledRepos: getBooleanInput('exclude-disabled-repos'),
      excludePrivateRepos: getBooleanInput('exclude-private-repos')
    }
  } else if (isStringEmpty(repos)) {
    inputs.repository = String(process.env.GITHUB_REPOSITORY)
  }

  log.info(`Inputs: ${JSON.stringify(inputs, null, 2)}`)

  await validateInputs(inputs)

  endGroup()

  return inputs
}

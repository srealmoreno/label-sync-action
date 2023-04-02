import { endGroup, startGroup } from '@actions/core'
import { Label } from '@interfaces/label'
import { getInputsOfAction } from '@services/get-inputs.js'
import { getLabels } from '@services/get-labels.js'
import { getRepos } from '@services/get-repos.js'
import { LabelDiffWithRepo, setLabelsOptions, setLabelsToRepoOptions } from '@typings/interfaces/set-labels'
import { isArrayNotEmpty, isArrayOfStrings, isString } from '@utils/index.js'
import log from '@utils/log.js'
import { promiseSettled } from '@utils/promise.js'
import githubLabelSync from 'github-label-sync'

export async function setLabelsToRepo ({
  labels,
  repo,
  token,
  cleanLabels
}: setLabelsToRepoOptions): Promise<LabelDiffWithRepo> {
  const diff = await githubLabelSync({
    accessToken: token,
    repo,
    labels,
    allowAddedLabels: !cleanLabels
  }).catch((err: Error) => {
    throw new Error(`Failed to set labels to repo: ${repo} GitHub API error: ${err.message}`)
  })

  return {
    repo,
    diff
  }
}

export async function setLabels ({
  inputs,
  repos,
  labels
}: setLabelsOptions): Promise<LabelDiffWithRepo[] | LabelDiffWithRepo> {
  startGroup('Setting labels to repo(s)...')
  if (isString(repos)) {
    endGroup()

    return await setLabelsToRepo({
      labels,
      repo: repos,
      token: inputs.token,
      cleanLabels: inputs.cleanLabels ?? false
    })
  }

  if (isArrayOfStrings(repos)) {
    const [repositories, errors] = await promiseSettled(
      repos.map(
        async (repo: string) =>
          await setLabelsToRepo({
            labels,
            repo,
            token: inputs.token,
            cleanLabels: inputs.cleanLabels ?? false
          })
      )
    )

    if (isArrayNotEmpty(errors)) {
      errors.forEach((error: Error) => log.error(error.message))
    }

    endGroup()

    if (isArrayNotEmpty(repositories)) {
      return repositories
    }
  }

  throw new Error('Failed to set labels to all repo(s)')
}

export async function runAction (): Promise<LabelDiffWithRepo | LabelDiffWithRepo[]> {
  const inputs = await getInputsOfAction()

  let labels: Label[] //= await getLabels(inputs.configFile)

  if (inputs.autoDiscoverRepos?.autoDiscoverRepos === true) {
    startGroup('Getting repos and labels... (async)')
    const data = await Promise.all([getRepos(inputs.token, inputs.autoDiscoverRepos), getLabels(inputs.configFile)])
    endGroup()
    inputs.repositories = data[0]
    labels = data[1]
  } else {
    startGroup('Getting labels...')
    labels = await getLabels(inputs.configFile)
    endGroup()
  }

  return await setLabels({
    inputs,
    repos: inputs.repositories,
    labels
  })
}

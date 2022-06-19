import { AutoDiscoverReposOptions } from '@interfaces/inputs'
import { components } from '@octokit/openapi-types'
import { isArrayNotEmpty, isArrayOfStrings, isRegExp, isString } from '@utils/index.js'
import log from '@utils/log.js'
import { Octokit } from 'octokit'
import regexParser from 'regex-parser'

type repository = components['schemas']['repository']

export async function getRepos (token: string, autoDiscoverRepos: AutoDiscoverReposOptions): Promise<string[]> {
  const {
    owner,
    accountType,
    excludeRepos: exclude,
    excludeForkedRepos: excludeForked,
    excludeArchivedRepos: excludeArchived,
    excludeDisabledRepos: excludeDisabled,
    excludePrivateRepos: excludePrivate
  } = autoDiscoverRepos

  const octokit = new Octokit({
    auth: token
  })

  const { data }: { data: repository[] } = await octokit
    .request(`GET /${accountType}s/{${accountType}}/repos`, { [accountType]: owner })
    .catch((error: Error) => {
      throw new Error(
        `Failed to fetch repos from owner: '${owner}' accountType: '${accountType}' GitHub API error: ${error.message}`
      )
    })

  const repos = data
    .filter((repo) => {
      if (isString(exclude) && isRegExp(exclude)) {
        const regExp = regexParser(exclude)
        if (regExp.test(repo.name)) {
          log.warning(`Excluding repo: '${repo.name}' RegEx match' `)
          return false
        }
      }

      if (isString(exclude)) {
        if (repo.name === exclude) {
          log.warning(`Excluding repo: '${repo.full_name}'`)
          return false
        }
      }

      if (isArrayOfStrings(exclude) && exclude.includes(repo.name)) {
        log.warning(`Excluding repo: '${repo.full_name}', exact match`)
        return false
      }

      if ((excludeForked === undefined || excludeForked) && repo.fork) {
        log.warning(`Excluding forked repo: '${repo.full_name}'`)
      }

      if ((excludeArchived === undefined || excludeArchived) && repo.archived) {
        log.warning(`Excluding archived repo: '${repo.full_name}'`)
      }

      if ((excludeDisabled === undefined || excludeDisabled) && repo.disabled) {
        log.warning(`Excluding disabled repo: '${repo.full_name}'`)
      }

      if ((excludePrivate === undefined || excludePrivate) && repo.private) {
        log.warning(`Excluding private repo: '${repo.full_name}'`)
        return false
      }

      return true
    })
    .map(({ full_name: fullName }) => fullName)

  if (isArrayNotEmpty(repos)) {
    log.info(`Repos: ${repos.join('\n\t   ')}`)
    return repos
  }

  throw new Error(
    `Failed to fetch repos, no repos found for owner: '${owner}' accountType: '${accountType}' or all repos excluded`
  )
}

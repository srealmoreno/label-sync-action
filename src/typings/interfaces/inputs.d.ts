export interface AutoDiscoverReposOptions {
  autoDiscoverRepos?: boolean = true
  accountType: 'org' | 'user'
  owner: string
  excludeRepos?: string | string[]
  excludeForkedRepos?: boolean = true
  excludeArchivedRepos?: boolean = true
  excludeDisabledRepos?: boolean = true
  excludePrivateRepos?: boolean = true
}

export interface Inputs {
  token: string
  configFile: string | string[] = '.github/labels.yml'
  cleanLabels?: boolean = false
  repositories?: string | string[]
  autoDiscoverRepos?: AutoDiscoverReposOptions
}

import { Inputs } from '@interfaces/inputs'
import { LabelDiff } from 'github-label-sync'

export interface setLabelsToRepoOptions {
  labels: Label[]
  repo: string
  token: string
  cleanLabels: boolean
}

export interface setLabelsOptions {
  inputs: Inputs
  repos: string | string[] | undefined
  labels: Label[]
}

export interface LabelDiffWithRepo {
  repo: string
  diff: LabelDiff[]
}

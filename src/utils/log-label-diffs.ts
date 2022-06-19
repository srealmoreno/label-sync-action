import { endGroup, startGroup } from '@actions/core'
import { LabelDiffWithRepo } from '@interfaces/set-labels'
import { isArray, isArrayEmpty } from '@utils/index.js'
import log from '@utils/log.js'
import { LabelDiff } from 'github-label-sync'

function logLabelDiff (diff: LabelDiff[]): void {
  if (isArrayEmpty(diff)) {
    return log.info('Everything is up to date')
  }

  const logDiffs: string[] = []
  for (const { name, type, actual, expected } of diff) {
    logDiffs.push(`${name} [${type}]`)

    if (actual?.name !== expected?.name) {
      logDiffs.push(`Name: ${actual?.name ?? '☀'} ➜ ${expected?.name ?? '☀'}`)
    }

    if (actual?.color !== expected?.color) {
      logDiffs.push(`Color: ${actual?.color ?? '☀'} ➜ ${expected?.color ?? '☀'}`)
    }

    if (actual?.description !== expected?.description) {
      logDiffs.push(`Description: ${actual?.description ?? '☀'} ➜ ${expected?.description ?? '☀'}`)
    }

    logDiffs.push('')
  }

  log.info(`Diffs:\n${logDiffs.join('\n')}`)
}

export function logLabelDiffWithRepo (labelDiffWithRepo: LabelDiffWithRepo[] | LabelDiffWithRepo): void {
  if (!isArray(labelDiffWithRepo)) {
    startGroup(`Labels diff repository ${labelDiffWithRepo.repo}`)
    logLabelDiff(labelDiffWithRepo.diff)
    endGroup()
    return
  }

  for (const { repo, diff } of labelDiffWithRepo) {
    startGroup(`Labels diff repository ${repo}`)
    logLabelDiff(diff)
    endGroup()
  }
}

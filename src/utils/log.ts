import * as core from '@actions/core'
import { colorReset, fgBlue, fgGreen, fgYellow } from '@utils/colors'

export const log = {
  info (str: string): void {
    core.info(`${fgBlue}🛈${colorReset} ${str}`)
  },
  success (str: string): void {
    core.info(`${fgGreen}⚡${colorReset} ${str}`)
  },
  warning (str: string): void {
    core.info(`${fgYellow}⚠️${colorReset} ${str}`)
  },
  error (str: string): void {
    core.error(`${str}`)
  },
  fatal (str: string): void {
    core.setFailed(`${str}`)
  }
}

export default log

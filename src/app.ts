import { runAction } from '@services/set-labels.js'
import { logLabelDiffWithRepo } from '@utils/log-label-diffs.js'
import { log } from '@utils/log.js'

const start = performance.now()

runAction()
  .then(logLabelDiffWithRepo)
  .catch(log.fatal)
  .finally(() => {
    const end = performance.now()
    const time = ((end - start) / 1000).toFixed(4)
    log.success(`Finished in ${time}s`)
  })

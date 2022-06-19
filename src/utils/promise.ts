export function isRejected (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult {
  return input.status === 'rejected'
}

export function isFulfilled<T> (input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> {
  return input.status === 'fulfilled'
}

/**
 * Friendly function of Promise.allSettled
 * Only use if all promises are return the same type
 * and index/order doesn't matter.
 * @param values Array of promises to be resolved
 * @returns Array of 2 elements: [success[], errors[]]
 *          1. success[] of fulfilled promises, second is reasons of rejected promises
 *          2. errors[] of rejected promises
 * A promise must be rejected with an instance of Error https://eslint.org/docs/rules/prefer-promise-reject-errors
 * @example - Success and errors cases:
 * const [success, errors] = await promiseSettled([ Promise.resolve(1), Promise.reject(new Error('hello')) ])
 * console.log(success, errors) // [1] [Error Object]
 * @example - Success only cases:
 * const [success, errors] = await promiseSettled([ Promise.resolve('hello'), Promise.resolve('world') ])
 * console.log(success, errors) // ['hello', 'world'] []
 * @example - Error only cases:
 * const [success, errors] = await promiseSettled([ Promise.reject(new Error('hello'))])
 * console.log(success, errors) // [] [Error Object]
 */
// export async function promiseSettled<T extends readonly unknown[] | []> (values: T): Promise<[Array<Awaited<T>>, Error[]]>
export async function promiseSettled<T> (values: Iterable<T | PromiseLike<T>>): Promise<[Array<Awaited<T>>, Error[]]> {
  const data = await Promise.allSettled<T>(values)

  const success = data.filter(isFulfilled).map((fulfilled) => fulfilled.value)

  const errors = data.filter(isRejected).map((rejected) => rejected.reason)

  return [success, errors]
}

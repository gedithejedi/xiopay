import { useEffect, useState } from 'react'

/**
 * A hook that unwraps a promise and maintains its resolved value in state
 * @template T The type of the resolved value
 * @param promise A promise that resolves to type T
 * @returns The resolved value of type T | undefined
 */
const useUnwrapParams = <T>(promise: Promise<T> | T): T | undefined => {
  const [awaitedParams, setAwaitedParams] = useState<T>()

  useEffect(() => {
    const getParams = async () => {
      // Only await if the param is actually a promise
      const unwrappedParams =
        promise instanceof Promise ? await promise : promise
      setAwaitedParams(unwrappedParams)
    }

    getParams()
  }, [promise])

  return awaitedParams
}

export default useUnwrapParams

import { useAsync } from "@corets/use-async"
import { Action, UseAction } from "./types"

export const useAction: UseAction = <TResult, TActionArgs extends any[]>(
  action: Action<TResult, TActionArgs>
) => {
  const handle = useAsync<TResult | undefined>()

  const run: Action<TResult, TActionArgs> = async (...args) => {
    return handle.reload(() => {
      return action(...args)
    })
  }

  return {
    isRunning: handle.isLoading,
    isErrored: handle.isErrored,
    error: handle.error,
    result: handle.result,
    run,
  }
}

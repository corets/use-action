import { useAsync } from "@corets/use-async"
import { ActionProducer, UseAction } from "./types"

export const useAction: UseAction = <TResult, TActionArgs extends any[]>(
  action: ActionProducer<TResult, TActionArgs>
) => {
  const handle = useAsync<TResult | undefined>()

  const run: ActionProducer<TResult, TActionArgs> = async (...args) => {
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

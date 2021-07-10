export type ActionProducer<TResult, TArgs extends any[]> = (
  ...args: TArgs
) => Promise<TResult | undefined> | TResult | undefined

export type Action<TResult, TActionArgs extends any[] = []> = {
  result: TResult | undefined
  isRunning: boolean
  isErrored: boolean
  error: any | undefined
  run: ActionProducer<TResult, TActionArgs>
}

export type UseAction = <TResult, TActionArgs extends any[] = []>(
  action: ActionProducer<TResult, TActionArgs>
) => Action<TResult, TActionArgs>

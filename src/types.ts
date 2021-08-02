import { AsyncProducer, ObservableAsync } from "@corets/async"

export type UseAction = <TResult, TArgs extends any[]>(
  producer: ObservableAsync<TResult, TArgs> | AsyncProducer<TResult, TArgs>
) => ObservableAsync<TResult, TArgs>

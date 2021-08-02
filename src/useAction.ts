import { useEffect, useMemo, useRef, useState } from "react"
import { Async, AsyncProducer, ObservableAsync } from "@corets/async"
import { UseAction } from "./types"

export const useAction: UseAction = <TResult, TArgs extends any[]>(
  producer
) => {
  const [reference, setReference] = useState(0)
  const producerRef = useRef(producer as AsyncProducer<TResult, TArgs>)

  const action = useMemo<ObservableAsync<TResult, TArgs>>(() => {
    if (producer instanceof Async) {
      return producer
    }

    return new Async<TResult, TArgs>((...args) => producerRef.current(...args))
  }, [])

  useEffect(() => {
    return action.listen(() => setReference((previous) => previous + 1))
  }, [])

  useEffect(() => {
    producerRef.current = producer
  }, [producer])

  return action
}

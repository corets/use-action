import { useAction } from "./useAction"
import { createAsync, createAsyncState } from "@corets/async"
import React from "react"
import { act, render, screen } from "@testing-library/react"
import { createTimeout } from "@corets/promise-helpers"
import { createValue } from "@corets/value"
import { useValue } from "@corets/use-value"

describe("useAction", () => {
  it("uses action with a sync producer instance", () => {
    const globalAction = createAsync((arg: number) => 1 + arg)

    let renders = 0

    const Test = () => {
      renders++

      const action = useAction(globalAction)

      return <h1>{JSON.stringify(action.getState())}</h1>
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(1)
    expect(target).toHaveTextContent(JSON.stringify(createAsyncState()))

    act(() => {
      globalAction.run(2)
    })

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 3 }))
    )
  })

  it("uses action with a sync producer", () => {
    const globalValue = createValue("foo")

    let renders = 0

    const Test = () => {
      renders++

      const [value] = useValue(globalValue).use()
      const action = useAction(() => value)

      return (
        <div>
          <h1>{JSON.stringify(action.getState())}</h1>
          <button onClick={() => action.run()}></button>
        </div>
      )
    }

    render(<Test />)

    const target = screen.getByRole("heading")
    const button = screen.getByRole("button")

    expect(renders).toBe(1)
    expect(target).toHaveTextContent(JSON.stringify(createAsyncState()))

    act(() => {
      button.click()
    })

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: "foo" }))
    )

    act(() => {
      globalValue.set("bar")
    })

    expect(renders).toBe(3)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: "foo" }))
    )

    act(() => {
      button.click()
    })

    expect(renders).toBe(4)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: "bar" }))
    )
  })

  it("uses action with am async producer instance", async () => {
    const globalAction = createAsync(async (arg: number) => 1 + arg)

    let renders = 0

    const Test = () => {
      renders++
      const action = useAction(globalAction)

      return <h1>{JSON.stringify(action.getState())}</h1>
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(1)
    expect(target).toHaveTextContent(JSON.stringify(createAsyncState()))

    act(() => {
      globalAction.run(2)
    })

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ isRunning: true }))
    )

    await act(() => createTimeout(1))

    expect(renders).toBe(3)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: 3 }))
    )
  })

  it("uses action with an async producer", async () => {
    const globalValue = createValue("foo")

    let renders = 0

    const Test = () => {
      renders++

      const [value] = useValue(globalValue).use()
      const action = useAction(async () => value)

      return (
        <div>
          <h1>{JSON.stringify(action.getState())}</h1>
          <button onClick={() => action.run()}></button>
        </div>
      )
    }

    render(<Test />)

    const target = screen.getByRole("heading")
    const button = screen.getByRole("button")

    expect(renders).toBe(1)
    expect(target).toHaveTextContent(JSON.stringify(createAsyncState()))

    act(() => {
      button.click()
    })

    expect(renders).toBe(2)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ isRunning: true }))
    )

    await act(() => createTimeout(1))

    expect(renders).toBe(3)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: "foo" }))
    )

    act(() => {
      globalValue.set("bar")
    })

    expect(renders).toBe(4)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: "foo" }))
    )

    act(() => {
      button.click()
    })

    expect(renders).toBe(5)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: "foo", isRunning: true }))
    )

    await act(() => createTimeout(1))

    expect(renders).toBe(6)
    expect(target).toHaveTextContent(
      JSON.stringify(createAsyncState({ result: "bar" }))
    )
  })
})

import { Action, useAction } from "./"
import { createPromise } from "@corets/promise-helpers"
import { act, render, screen } from "@testing-library/react"
import React from "react"

describe("useAction", () => {
  it("calls action and resolves result", async () => {
    const promiseRef = {
      current: createPromise<string>(),
    }
    let receivedAction: Action<string, [number, string]>
    let renders = 0

    const Test = () => {
      renders++
      receivedAction = useAction(async (a: number, b: string) => {
        const result = await promiseRef.current

        return `${result} ${a} ${b}`
      })

      return <h1>{receivedAction.result}</h1>
    }

    render(<Test />)

    const target = screen.getByRole("heading")

    expect(renders).toBe(1)
    expect(receivedAction!.isRunning).toBe(false)
    expect(receivedAction!.isErrored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe(undefined)
    expect(target).toHaveTextContent("")

    act(() => {
      receivedAction.run(1, "a")
    })

    expect(renders).toBe(2)
    expect(receivedAction!.isRunning).toBe(true)
    expect(receivedAction!.isErrored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe(undefined)
    expect(target).toHaveTextContent("")

    await act(async () => {
      await promiseRef.current.resolve("result")
    })

    expect(renders).toBe(3)
    expect(receivedAction!.isRunning).toBe(false)
    expect(receivedAction!.isErrored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe("result 1 a")
    expect(target).toHaveTextContent("result 1 a")

    act(() => {
      promiseRef.current = createPromise<string>()
      receivedAction.run(2, "b")
    })

    expect(renders).toBe(4)
    expect(receivedAction!.isRunning).toBe(true)
    expect(receivedAction!.isErrored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe(undefined)
    expect(target).toHaveTextContent("")

    await act(async () => {
      await promiseRef.current.reject("reason")
    })

    expect(renders).toBe(5)
    expect(receivedAction!.isRunning).toBe(false)
    expect(receivedAction!.isErrored).toBe(true)
    expect(receivedAction!.error).toBe("reason")
    expect(receivedAction!.result).toBe(undefined)
    expect(target).toHaveTextContent("")
  })
})

import { ActionHandle, useAction } from "./"
import { createPromise } from "@corets/promise-helpers"
import { mount } from "enzyme"
import React from "react"
import { act } from "react-dom/test-utils"

describe("useAction", () => {
  it("calls action and resolves result", async () => {
    const promiseRef = {
      current: createPromise<string>(),
    }
    let receivedAction: ActionHandle<string, [number, string]>
    let renders = 0

    const Test = () => {
      renders++
      receivedAction = useAction(async (a: number, b: string) => {
        const result = await promiseRef.current

        return `${result} ${a} ${b}`
      })

      return <h1>{receivedAction.result}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(renders).toBe(1)
    expect(receivedAction!.running).toBe(false)
    expect(receivedAction!.errored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe(undefined)
    expect(target().text()).toBe("")

    act(() => {
      receivedAction.run(1, "a")
    })

    expect(renders).toBe(2)
    expect(receivedAction!.running).toBe(true)
    expect(receivedAction!.errored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe(undefined)
    expect(target().text()).toBe("")

    await act(async () => {
      await promiseRef.current.resolve("result")
    })

    expect(renders).toBe(3)
    expect(receivedAction!.running).toBe(false)
    expect(receivedAction!.errored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe("result 1 a")
    expect(target().text()).toBe("result 1 a")

    act(() => {
      promiseRef.current = createPromise<string>()
      receivedAction.run(2, "b")
    })

    expect(renders).toBe(4)
    expect(receivedAction!.running).toBe(true)
    expect(receivedAction!.errored).toBe(false)
    expect(receivedAction!.error).toBe(undefined)
    expect(receivedAction!.result).toBe(undefined)
    expect(target().text()).toBe("")

    await act(async () => {
      await promiseRef.current.reject("reason")
    })

    expect(renders).toBe(5)
    expect(receivedAction!.running).toBe(false)
    expect(receivedAction!.errored).toBe(true)
    expect(receivedAction!.error).toBe("reason")
    expect(receivedAction!.result).toBe(undefined)
    expect(target().text()).toBe("")
  })
})

import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WorkExperienceForm } from "@/components/cv-builder/WorkExperienceForm"
import type { WorkExperience } from "@/types/cv"

// Mock use-toast to avoid provider requirement
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}))

// Polyfill crypto.randomUUID
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: () => Math.random().toString(36).substring(2) },
})

const makeExp = (id: string, role = "Dev", company = "Acme"): WorkExperience => ({
  id,
  company,
  role,
  startDate: "2020-01",
  endDate: "",
  current: false,
  description: "",
  bullets: [],
})

describe("WorkExperienceForm", () => {
  it("renders empty state with an add button", () => {
    render(<WorkExperienceForm value={[]} onChange={jest.fn()} />)
    expect(screen.getByRole("button", { name: /add experience/i })).toBeInTheDocument()
  })

  it("adds a new experience entry when Add Experience is clicked", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<WorkExperienceForm value={[]} onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: /add experience/i }))

    expect(onChange).toHaveBeenCalledTimes(1)
    const newList: WorkExperience[] = onChange.mock.calls[0][0]
    expect(newList).toHaveLength(1)
    expect(newList[0].company).toBe("")
  })

  it("renders existing experience entries", () => {
    render(
      <WorkExperienceForm value={[makeExp("w1", "Engineer", "Google")]} onChange={jest.fn()} />
    )
    expect(screen.getByText("Engineer")).toBeInTheDocument()
  })

  it("shows fallback label for empty entry", () => {
    render(
      <WorkExperienceForm value={[makeExp("w1", "", "")]} onChange={jest.fn()} />
    )
    expect(screen.getByText("New Experience")).toBeInTheDocument()
  })

  it("removes an entry when trash button is clicked", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const exp = makeExp("w1", "Dev", "Acme")
    render(<WorkExperienceForm value={[exp]} onChange={onChange} />)

    // Get all buttons; the trash button is a <button> (not the div toggle or Add Experience)
    const allButtons = screen.getAllByRole("button")
    const trashBtn = allButtons.find(
      (b) => b.tagName === "BUTTON" && b !== screen.getByRole("button", { name: /add experience/i })
    )
    expect(trashBtn).toBeDefined()
    await user.click(trashBtn!)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toHaveLength(0)
  })

  it("expands the first entry by default when value is provided", () => {
    render(
      <WorkExperienceForm
        value={[makeExp("w1", "Engineer", "Corp")]}
        onChange={jest.fn()}
      />
    )
    // With expandedId initialized to value[0]?.id, the first entry is expanded by default
    expect(screen.getByPlaceholderText("Software Engineer")).toBeInTheDocument()
  })

  it("collapses entry when header is clicked while expanded", async () => {
    const user = userEvent.setup()
    render(
      <WorkExperienceForm value={[makeExp("w1", "Manager", "Corp")]} onChange={jest.fn()} />
    )
    // First entry is expanded by default
    expect(screen.getByPlaceholderText("Software Engineer")).toBeInTheDocument()

    // Click the expand toggle (div[role=button])
    const expandToggle = screen.getByRole("button", { name: /manager/i })
    await user.click(expandToggle)

    // Should be collapsed now
    expect(screen.queryByPlaceholderText("Software Engineer")).not.toBeInTheDocument()
  })

  it("updates role field when input changes", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const exp = makeExp("w1", "Dev", "Corp")
    render(<WorkExperienceForm value={[exp]} onChange={onChange} />)

    // First entry is expanded by default
    const roleInput = screen.getByPlaceholderText("Software Engineer")
    await user.clear(roleInput)
    await user.type(roleInput, "Senior Dev")

    expect(onChange).toHaveBeenCalled()
  })

  it("renders multiple entries", () => {
    render(
      <WorkExperienceForm
        value={[makeExp("w1", "Dev", "A"), makeExp("w2", "Manager", "B")]}
        onChange={jest.fn()}
      />
    )
    expect(screen.getByText("Dev")).toBeInTheDocument()
    expect(screen.getByText("Manager")).toBeInTheDocument()
  })
})

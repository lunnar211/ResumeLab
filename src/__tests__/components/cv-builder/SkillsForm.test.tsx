import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SkillsForm } from "@/components/cv-builder/SkillsForm"
import type { Skill } from "@/types/cv"

// Polyfill crypto.randomUUID in jsdom
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(36).substring(2),
  },
})

const makeSkill = (id: string, name: string): Skill => ({
  id,
  name,
  level: "intermediate",
})

describe("SkillsForm", () => {
  it("renders empty state with no skills", () => {
    const onChange = jest.fn()
    render(<SkillsForm value={[]} onChange={onChange} />)
    expect(screen.queryByRole("button", { name: /trash/i })).not.toBeInTheDocument()
  })

  it("renders existing skills as chips", () => {
    const skills = [makeSkill("s1", "TypeScript"), makeSkill("s2", "React")]
    render(<SkillsForm value={skills} onChange={jest.fn()} />)
    expect(screen.getByText("TypeScript")).toBeInTheDocument()
    expect(screen.getByText("React")).toBeInTheDocument()
  })

  it("adds a new skill when the add button is clicked", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<SkillsForm value={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText("Skill name"), "Python")
    await user.click(screen.getByRole("button"))

    expect(onChange).toHaveBeenCalledTimes(1)
    const newSkills: Skill[] = onChange.mock.calls[0][0]
    expect(newSkills).toHaveLength(1)
    expect(newSkills[0].name).toBe("Python")
  })

  it("does not add a skill when the input is empty", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<SkillsForm value={[]} onChange={onChange} />)

    await user.click(screen.getByRole("button"))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("adds a skill when Enter is pressed", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<SkillsForm value={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText("Skill name"), "Go{Enter}")
    expect(onChange).toHaveBeenCalledTimes(1)
    const newSkills: Skill[] = onChange.mock.calls[0][0]
    expect(newSkills[0].name).toBe("Go")
  })

  it("removes a skill when the trash button is clicked", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const skills = [makeSkill("s1", "TypeScript")]
    render(<SkillsForm value={skills} onChange={onChange} />)

    const trashButtons = screen.getAllByRole("button")
    // The trash button is the small one inside each skill chip
    const removeBtn = trashButtons.find((b) =>
      b.closest("div.rounded-full") !== null
    )
    await user.click(removeBtn!)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toHaveLength(0)
  })

  it("clears the input after adding a skill", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<SkillsForm value={[]} onChange={onChange} />)

    const input = screen.getByPlaceholderText("Skill name")
    await user.type(input, "CSS")
    await user.click(screen.getByRole("button"))

    expect(input).toHaveValue("")
  })

  it("shows skill level in the chip", () => {
    const skills = [{ id: "s1", name: "TypeScript", level: "expert" as const }]
    render(<SkillsForm value={skills} onChange={jest.fn()} />)
    expect(screen.getByText("· expert")).toBeInTheDocument()
  })
})

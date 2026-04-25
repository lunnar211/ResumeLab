import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CVFormSection } from "@/components/cv-builder/CVFormSection"

describe("CVFormSection", () => {
  it("renders the section title", () => {
    render(
      <CVFormSection title="Work Experience">
        <p>Content</p>
      </CVFormSection>
    )
    expect(screen.getByText("Work Experience")).toBeInTheDocument()
  })

  it("is collapsed by default (defaultOpen=false)", () => {
    render(
      <CVFormSection title="Skills">
        <p>Skills content</p>
      </CVFormSection>
    )
    expect(screen.queryByText("Skills content")).not.toBeInTheDocument()
  })

  it("is expanded when defaultOpen=true", () => {
    render(
      <CVFormSection title="Personal Info" defaultOpen>
        <p>Personal content</p>
      </CVFormSection>
    )
    expect(screen.getByText("Personal content")).toBeInTheDocument()
  })

  it("expands when the header button is clicked", async () => {
    const user = userEvent.setup()
    render(
      <CVFormSection title="Education">
        <p>Education content</p>
      </CVFormSection>
    )
    expect(screen.queryByText("Education content")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button"))
    expect(screen.getByText("Education content")).toBeInTheDocument()
  })

  it("collapses when clicked again after being opened", async () => {
    const user = userEvent.setup()
    render(
      <CVFormSection title="Languages" defaultOpen>
        <p>Language content</p>
      </CVFormSection>
    )
    expect(screen.getByText("Language content")).toBeInTheDocument()
    await user.click(screen.getByRole("button"))
    expect(screen.queryByText("Language content")).not.toBeInTheDocument()
  })

  it("renders an optional icon", () => {
    render(
      <CVFormSection title="Projects" icon={<span data-testid="icon">📁</span>}>
        <p>Projects</p>
      </CVFormSection>
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })
})

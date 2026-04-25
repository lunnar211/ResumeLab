import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button, buttonVariants } from "@/components/ui/button"

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>)
    const btn = screen.getByRole("button", { name: "Click me" })
    expect(btn).toBeInTheDocument()
  })

  it("fires onClick when clicked", async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Button disabled onClick={onClick}>Disabled</Button>)
    await user.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies variant class for destructive", () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("bg-destructive")
  })

  it("applies variant class for outline", () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("border")
  })

  it("applies variant class for secondary", () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("bg-secondary")
  })

  it("applies variant class for ghost", () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("hover:bg-accent")
  })

  it("applies variant class for link", () => {
    render(<Button variant="link">Link</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("underline-offset-4")
  })

  it("applies small size class", () => {
    render(<Button size="sm">Small</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("h-8")
  })

  it("applies large size class", () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("h-10")
  })

  it("applies icon size class", () => {
    render(<Button size="icon">X</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("size-9")
  })

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Link Button" })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe("A")
  })

  it("merges custom className", () => {
    render(<Button className="my-custom-class">Test</Button>)
    const btn = screen.getByRole("button")
    expect(btn.className).toContain("my-custom-class")
  })
})

describe("buttonVariants", () => {
  it("returns class string for default variant", () => {
    const cls = buttonVariants({ variant: "default" })
    expect(typeof cls).toBe("string")
    expect(cls).toContain("bg-primary")
  })

  it("returns class string for destructive variant", () => {
    const cls = buttonVariants({ variant: "destructive" })
    expect(cls).toContain("bg-destructive")
  })
})

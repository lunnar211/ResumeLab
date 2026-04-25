import { cn, generateSlug, formatDate, truncate, handleToggleKeyDown } from "@/lib/utils"
import type { KeyboardEvent } from "react"

describe("cn", () => {
  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("")
  })

  it("joins class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("merges conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "skip", "included")).toBe("base included")
  })

  it("handles undefined and null values", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b")
  })

  it("merges bg-* utilities correctly", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
  })
})

describe("generateSlug", () => {
  it("lowercases the title", () => {
    const slug = generateSlug("My Resume")
    expect(slug.startsWith("my-resume-")).toBe(true)
  })

  it("replaces spaces with hyphens", () => {
    const slug = generateSlug("hello world")
    expect(slug.startsWith("hello-world-")).toBe(true)
  })

  it("removes special characters", () => {
    const slug = generateSlug("My Resume! @2024")
    expect(slug.startsWith("my-resume-2024-")).toBe(true)
  })

  it("appends a random suffix", () => {
    const slug1 = generateSlug("test")
    const slug2 = generateSlug("test")
    expect(slug1).not.toBe(slug2)
  })

  it("collapses multiple hyphens", () => {
    const slug = generateSlug("a  b")
    expect(slug.startsWith("a-b-")).toBe(true)
  })
})

describe("formatDate", () => {
  it("returns empty string for empty input", () => {
    expect(formatDate("")).toBe("")
  })

  it("formats a valid date string", () => {
    const result = formatDate("2024-01-15")
    expect(result).toMatch(/Jan 2024/)
  })

  it("formats with different locales", () => {
    const result = formatDate("2024-03-01", "de-DE")
    expect(result).toBeTruthy()
  })

  it("handles year-month only strings", () => {
    const result = formatDate("2023-06")
    expect(result).toMatch(/Jun 2023/)
  })
})

describe("handleToggleKeyDown", () => {
  const makeEvent = (key: string) =>
    ({ key, preventDefault: jest.fn() } as unknown as KeyboardEvent<Element>)

  it("calls onToggle when Enter is pressed", () => {
    const onToggle = jest.fn()
    const e = makeEvent("Enter")
    handleToggleKeyDown(e, onToggle)
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(e.preventDefault).toHaveBeenCalled()
  })

  it("calls onToggle when Space is pressed", () => {
    const onToggle = jest.fn()
    const e = makeEvent(" ")
    handleToggleKeyDown(e, onToggle)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it("does not call onToggle for other keys", () => {
    const onToggle = jest.fn()
    handleToggleKeyDown(makeEvent("Tab"), onToggle)
    handleToggleKeyDown(makeEvent("Escape"), onToggle)
    expect(onToggle).not.toHaveBeenCalled()
  })
})

describe("truncate", () => {
  it("returns the string unchanged when shorter than limit", () => {
    expect(truncate("hello", 10)).toBe("hello")
  })

  it("returns the string unchanged when equal to limit", () => {
    expect(truncate("hello", 5)).toBe("hello")
  })

  it("truncates and appends ellipsis when longer than limit", () => {
    expect(truncate("hello world", 5)).toBe("hello...")
  })

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("")
  })

  it("handles limit of 0", () => {
    expect(truncate("hello", 0)).toBe("...")
  })
})

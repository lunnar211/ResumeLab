import { templates, getTemplateById, freeTemplates, premiumTemplates } from "@/lib/templates"

describe("templates", () => {
  it("contains at least 10 templates", () => {
    expect(templates.length).toBeGreaterThanOrEqual(10)
  })

  it("each template has required fields", () => {
    for (const t of templates) {
      expect(t.id).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.category).toBeTruthy()
      expect(typeof t.isPremium).toBe("boolean")
    }
  })

  it("template ids are unique", () => {
    const ids = templates.map((t) => t.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })
})

describe("getTemplateById", () => {
  it("returns the template with a matching id", () => {
    const t = getTemplateById("classic-professional")
    expect(t).toBeDefined()
    expect(t?.id).toBe("classic-professional")
  })

  it("returns undefined for an unknown id", () => {
    expect(getTemplateById("does-not-exist")).toBeUndefined()
  })
})

describe("freeTemplates", () => {
  it("contains only non-premium templates", () => {
    for (const t of freeTemplates) {
      expect(t.isPremium).toBe(false)
    }
  })

  it("is a subset of templates", () => {
    expect(freeTemplates.length).toBeGreaterThan(0)
    expect(freeTemplates.length).toBeLessThan(templates.length)
  })
})

describe("premiumTemplates", () => {
  it("contains only premium templates", () => {
    for (const t of premiumTemplates) {
      expect(t.isPremium).toBe(true)
    }
  })

  it("free + premium equals total templates", () => {
    expect(freeTemplates.length + premiumTemplates.length).toBe(templates.length)
  })
})

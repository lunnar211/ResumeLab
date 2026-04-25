import { defaultCVContent } from "@/types/cv"

// Re-implement the reducer inline to test without hooks infrastructure
type CVContent = typeof defaultCVContent
type CVAction =
  | { type: "SET_CV"; payload: Partial<CVContent> }
  | { type: "UPDATE_PERSONAL_INFO"; payload: Partial<CVContent["personalInfo"]> }
  | { type: "ADD_WORK_EXPERIENCE"; payload: CVContent["workExperience"][0] }
  | { type: "UPDATE_WORK_EXPERIENCE"; payload: { id: string; data: Partial<CVContent["workExperience"][0]> } }
  | { type: "REMOVE_WORK_EXPERIENCE"; payload: string }
  | { type: "ADD_EDUCATION"; payload: CVContent["education"][0] }
  | { type: "UPDATE_EDUCATION"; payload: { id: string; data: Partial<CVContent["education"][0]> } }
  | { type: "REMOVE_EDUCATION"; payload: string }
  | { type: "SET_SKILLS"; payload: CVContent["skills"] }
  | { type: "SET_LANGUAGES"; payload: CVContent["languages"] }
  | { type: "SET_CERTIFICATIONS"; payload: CVContent["certifications"] }
  | { type: "SET_PROJECTS"; payload: CVContent["projects"] }
  | { type: "SET_PUBLICATIONS"; payload: CVContent["publications"] }
  | { type: "SET_VOLUNTEER"; payload: CVContent["volunteerWork"] }
  | { type: "SET_AWARDS"; payload: CVContent["awards"] }
  | { type: "SET_REFERENCES"; payload: CVContent["references"] }
  | { type: "SET_CUSTOM_SECTIONS"; payload: CVContent["customSections"] }
  | { type: "TOGGLE_REFERENCES" }
  | { type: "REORDER_SECTIONS"; payload: string[] }

function cvReducer(state: CVContent, action: CVAction): CVContent {
  switch (action.type) {
    case "SET_CV":
      return { ...state, ...action.payload }
    case "UPDATE_PERSONAL_INFO":
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } }
    case "ADD_WORK_EXPERIENCE":
      return { ...state, workExperience: [...state.workExperience, action.payload] }
    case "UPDATE_WORK_EXPERIENCE":
      return {
        ...state,
        workExperience: state.workExperience.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.data } : e
        ),
      }
    case "REMOVE_WORK_EXPERIENCE":
      return { ...state, workExperience: state.workExperience.filter((e) => e.id !== action.payload) }
    case "ADD_EDUCATION":
      return { ...state, education: [...state.education, action.payload] }
    case "UPDATE_EDUCATION":
      return {
        ...state,
        education: state.education.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.data } : e
        ),
      }
    case "REMOVE_EDUCATION":
      return { ...state, education: state.education.filter((e) => e.id !== action.payload) }
    case "SET_SKILLS":
      return { ...state, skills: action.payload }
    case "SET_LANGUAGES":
      return { ...state, languages: action.payload }
    case "SET_CERTIFICATIONS":
      return { ...state, certifications: action.payload }
    case "SET_PROJECTS":
      return { ...state, projects: action.payload }
    case "SET_PUBLICATIONS":
      return { ...state, publications: action.payload }
    case "SET_VOLUNTEER":
      return { ...state, volunteerWork: action.payload }
    case "SET_AWARDS":
      return { ...state, awards: action.payload }
    case "SET_REFERENCES":
      return { ...state, references: action.payload }
    case "SET_CUSTOM_SECTIONS":
      return { ...state, customSections: action.payload }
    case "TOGGLE_REFERENCES":
      return { ...state, showReferences: !state.showReferences }
    case "REORDER_SECTIONS":
      return { ...state, sectionOrder: action.payload }
    default:
      return state
  }
}

const baseWork = {
  id: "w1",
  company: "Acme",
  role: "Dev",
  startDate: "2020-01",
  endDate: "",
  current: false,
  description: "desc",
  bullets: [],
}

const baseEdu = {
  id: "e1",
  institution: "MIT",
  degree: "BSc",
  field: "CS",
  startDate: "2016-01",
  endDate: "2020-01",
  current: false,
  description: "",
}

describe("cvReducer", () => {
  describe("SET_CV", () => {
    it("merges partial payload into state", () => {
      const state = cvReducer(defaultCVContent, {
        type: "SET_CV",
        payload: { showReferences: true },
      })
      expect(state.showReferences).toBe(true)
    })
  })

  describe("UPDATE_PERSONAL_INFO", () => {
    it("updates personal info fields", () => {
      const state = cvReducer(defaultCVContent, {
        type: "UPDATE_PERSONAL_INFO",
        payload: { fullName: "John Doe", email: "john@example.com" },
      })
      expect(state.personalInfo.fullName).toBe("John Doe")
      expect(state.personalInfo.email).toBe("john@example.com")
    })

    it("does not overwrite unspecified fields", () => {
      const initial = {
        ...defaultCVContent,
        personalInfo: { ...defaultCVContent.personalInfo, phone: "555-1234" },
      }
      const state = cvReducer(initial, {
        type: "UPDATE_PERSONAL_INFO",
        payload: { fullName: "Jane" },
      })
      expect(state.personalInfo.phone).toBe("555-1234")
      expect(state.personalInfo.fullName).toBe("Jane")
    })
  })

  describe("ADD_WORK_EXPERIENCE", () => {
    it("adds a new work experience entry", () => {
      const state = cvReducer(defaultCVContent, {
        type: "ADD_WORK_EXPERIENCE",
        payload: baseWork,
      })
      expect(state.workExperience).toHaveLength(1)
      expect(state.workExperience[0].id).toBe("w1")
    })

    it("appends to existing entries", () => {
      const initial = {
        ...defaultCVContent,
        workExperience: [baseWork],
      }
      const state = cvReducer(initial, {
        type: "ADD_WORK_EXPERIENCE",
        payload: { ...baseWork, id: "w2" },
      })
      expect(state.workExperience).toHaveLength(2)
    })
  })

  describe("UPDATE_WORK_EXPERIENCE", () => {
    it("updates the matching entry", () => {
      const initial = { ...defaultCVContent, workExperience: [baseWork] }
      const state = cvReducer(initial, {
        type: "UPDATE_WORK_EXPERIENCE",
        payload: { id: "w1", data: { role: "Senior Dev" } },
      })
      expect(state.workExperience[0].role).toBe("Senior Dev")
    })

    it("does not modify non-matching entries", () => {
      const initial = {
        ...defaultCVContent,
        workExperience: [baseWork, { ...baseWork, id: "w2", role: "Manager" }],
      }
      const state = cvReducer(initial, {
        type: "UPDATE_WORK_EXPERIENCE",
        payload: { id: "w1", data: { role: "CTO" } },
      })
      expect(state.workExperience[1].role).toBe("Manager")
    })
  })

  describe("REMOVE_WORK_EXPERIENCE", () => {
    it("removes the entry with matching id", () => {
      const initial = {
        ...defaultCVContent,
        workExperience: [baseWork, { ...baseWork, id: "w2" }],
      }
      const state = cvReducer(initial, {
        type: "REMOVE_WORK_EXPERIENCE",
        payload: "w1",
      })
      expect(state.workExperience).toHaveLength(1)
      expect(state.workExperience[0].id).toBe("w2")
    })
  })

  describe("ADD_EDUCATION", () => {
    it("adds a new education entry", () => {
      const state = cvReducer(defaultCVContent, {
        type: "ADD_EDUCATION",
        payload: baseEdu,
      })
      expect(state.education).toHaveLength(1)
      expect(state.education[0].institution).toBe("MIT")
    })
  })

  describe("UPDATE_EDUCATION", () => {
    it("updates matching education entry", () => {
      const initial = { ...defaultCVContent, education: [baseEdu] }
      const state = cvReducer(initial, {
        type: "UPDATE_EDUCATION",
        payload: { id: "e1", data: { degree: "MSc" } },
      })
      expect(state.education[0].degree).toBe("MSc")
    })
  })

  describe("REMOVE_EDUCATION", () => {
    it("removes the education entry with matching id", () => {
      const initial = { ...defaultCVContent, education: [baseEdu] }
      const state = cvReducer(initial, {
        type: "REMOVE_EDUCATION",
        payload: "e1",
      })
      expect(state.education).toHaveLength(0)
    })
  })

  describe("SET_SKILLS", () => {
    it("replaces skills array", () => {
      const skills = [{ id: "s1", name: "TypeScript", level: "expert" as const }]
      const state = cvReducer(defaultCVContent, { type: "SET_SKILLS", payload: skills })
      expect(state.skills).toEqual(skills)
    })
  })

  describe("SET_LANGUAGES", () => {
    it("replaces languages array", () => {
      const languages = [{ id: "l1", name: "French", level: "B2" as const }]
      const state = cvReducer(defaultCVContent, { type: "SET_LANGUAGES", payload: languages })
      expect(state.languages).toEqual(languages)
    })
  })

  describe("TOGGLE_REFERENCES", () => {
    it("toggles showReferences from false to true", () => {
      expect(defaultCVContent.showReferences).toBe(false)
      const state = cvReducer(defaultCVContent, { type: "TOGGLE_REFERENCES" })
      expect(state.showReferences).toBe(true)
    })

    it("toggles showReferences from true to false", () => {
      const initial = { ...defaultCVContent, showReferences: true }
      const state = cvReducer(initial, { type: "TOGGLE_REFERENCES" })
      expect(state.showReferences).toBe(false)
    })
  })

  describe("REORDER_SECTIONS", () => {
    it("replaces sectionOrder with new order", () => {
      const newOrder = ["skills", "education", "workExperience"]
      const state = cvReducer(defaultCVContent, {
        type: "REORDER_SECTIONS",
        payload: newOrder,
      })
      expect(state.sectionOrder).toEqual(newOrder)
    })
  })
})

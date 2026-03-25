import { useReducer, useCallback, useRef } from "react"
import { type CVContent, defaultCVContent } from "@/types/cv"
import { createClient } from "@/lib/supabase/client"

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

export function useCV(cvId: string, initialContent: CVContent = defaultCVContent) {
  const [state, dispatch] = useReducer(cvReducer, initialContent)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()

  const save = useCallback(
    async (content: CVContent) => {
      await supabase
        .from("cvs")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", cvId)
    },
    [cvId, supabase]
  )

  const debouncedSave = useCallback(
    (content: CVContent) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => save(content), 2000)
    },
    [save]
  )

  const updateCV = useCallback(
    (action: CVAction) => {
      dispatch(action)
    },
    []
  )

  return { state, dispatch, updateCV, save, debouncedSave }
}

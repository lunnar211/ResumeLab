"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Edit, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import type { CVContent } from "@/types/cv"
import { useCV } from "@/hooks/use-cv"
import { getTemplateComponent } from "@/components/cv-templates"
import { templates } from "@/lib/templates"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CVFormSection } from "@/components/cv-builder/CVFormSection"
import { PersonalInfoForm } from "@/components/cv-builder/PersonalInfoForm"
import { WorkExperienceForm } from "@/components/cv-builder/WorkExperienceForm"
import { EducationForm } from "@/components/cv-builder/EducationForm"
import { SkillsForm } from "@/components/cv-builder/SkillsForm"
import { LanguagesForm } from "@/components/cv-builder/LanguagesForm"
import { CertificationsForm } from "@/components/cv-builder/CertificationsForm"
import { ProjectsForm } from "@/components/cv-builder/ProjectsForm"
import { PublicationsForm } from "@/components/cv-builder/PublicationsForm"
import { AwardsForm } from "@/components/cv-builder/AwardsForm"
import { VolunteerForm } from "@/components/cv-builder/VolunteerForm"
import { ReferencesForm } from "@/components/cv-builder/ReferencesForm"
import { CustomSectionForm } from "@/components/cv-builder/CustomSectionForm"
import { SectionReorder } from "@/components/cv-builder/SectionReorder"
import { ExportMenu } from "@/components/cv-builder/ExportMenu"

interface Props {
  cvId: string
  initialTitle: string
  initialContent: CVContent
  initialTemplateId: string
  isPublic: boolean
  publicSlug?: string
}

const sectionLabels: Record<string, string> = {
  personalInfo: "Personal Info",
  summary: "Summary",
  workExperience: "Experience",
  education: "Education",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  projects: "Projects",
  publications: "Publications",
  volunteerWork: "Volunteer",
  awards: "Awards",
  references: "References",
  customSections: "Custom",
}

export function CVBuilderClient({ cvId, initialTitle, initialContent, initialTemplateId, isPublic: initialIsPublic }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const { state, dispatch, debouncedSave } = useCV(cvId, initialContent)

  const [title, setTitle] = useState(initialTitle)
  const [templateId, setTemplateId] = useState(initialTemplateId)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle")
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")
  const mountedRef = useRef(false)

  const TemplateComponent = getTemplateComponent(templateId)

  const triggerSave = useCallback(
    (content: CVContent) => {
      setSaveStatus("saving")
      debouncedSave(content)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("saved"), 2500)
    },
    [debouncedSave]
  )

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    triggerSave(state)
  }, [state, triggerSave])

  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle)
    await supabase.from("cvs").update({ title: newTitle }).eq("id", cvId)
  }

  const updateTemplate = async (id: string) => {
    setTemplateId(id)
    await supabase.from("cvs").update({ template_id: id }).eq("id", cvId)
  }

  const togglePublic = async () => {
    const next = !isPublic
    setIsPublic(next)
    await supabase.from("cvs").update({ is_public: next }).eq("id", cvId)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b bg-background px-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Input
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="h-7 max-w-44 text-sm font-medium border-0 shadow-none focus-visible:ring-0 px-1"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {saveStatus === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          {saveStatus === "saved" && <Check className="h-3.5 w-3.5 text-green-500" />}
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={togglePublic}>
            {isPublic ? "Public" : "Private"}
          </Button>
          <ExportMenu content={state} cvTitle={title} />
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="flex border-b md:hidden shrink-0">
        <button
          className={cn("flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1.5", mobileTab === "edit" ? "border-b-2 border-primary" : "text-muted-foreground")}
          onClick={() => setMobileTab("edit")}
        >
          <Edit className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          className={cn("flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1.5", mobileTab === "preview" ? "border-b-2 border-primary" : "text-muted-foreground")}
          onClick={() => setMobileTab("preview")}
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Forms */}
        <div className={cn("w-full md:w-[42%] flex flex-col overflow-hidden border-r", mobileTab === "preview" && "hidden md:flex")}>
          {/* Template switcher */}
          <div className="shrink-0 border-b p-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateTemplate(t.id)}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1 rounded-md border p-2 text-xs transition-colors",
                    templateId === t.id ? "border-primary bg-primary/10" : "hover:bg-muted"
                  )}
                >
                  <div className="flex h-10 w-8 items-center justify-center rounded-sm bg-muted">
                    <span className="text-[8px] font-bold">{t.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="max-w-[60px] truncate">{t.name}</span>
                  {t.isPremium && <Badge variant="secondary" className="text-[9px] px-1 py-0">Pro</Badge>}
                </button>
              ))}
            </div>
          </div>

          {/* Form sections */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            <CVFormSection title="Personal Info" defaultOpen>
              <PersonalInfoForm
                value={state.personalInfo}
                onChange={(val) => dispatch({ type: "UPDATE_PERSONAL_INFO", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Work Experience">
              <WorkExperienceForm
                value={state.workExperience}
                onChange={(val) => dispatch({ type: "SET_CV", payload: { workExperience: val } })}
              />
            </CVFormSection>

            <CVFormSection title="Education">
              <EducationForm
                value={state.education}
                onChange={(val) => dispatch({ type: "SET_CV", payload: { education: val } })}
              />
            </CVFormSection>

            <CVFormSection title="Skills">
              <SkillsForm
                value={state.skills}
                onChange={(val) => dispatch({ type: "SET_SKILLS", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Languages">
              <LanguagesForm
                value={state.languages}
                onChange={(val) => dispatch({ type: "SET_LANGUAGES", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Certifications">
              <CertificationsForm
                value={state.certifications}
                onChange={(val) => dispatch({ type: "SET_CERTIFICATIONS", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Projects">
              <ProjectsForm
                value={state.projects}
                onChange={(val) => dispatch({ type: "SET_PROJECTS", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Publications">
              <PublicationsForm
                value={state.publications}
                onChange={(val) => dispatch({ type: "SET_PUBLICATIONS", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Awards">
              <AwardsForm
                value={state.awards}
                onChange={(val) => dispatch({ type: "SET_AWARDS", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Volunteer Work">
              <VolunteerForm
                value={state.volunteerWork}
                onChange={(val) => dispatch({ type: "SET_VOLUNTEER", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="References">
              <ReferencesForm
                value={state.references}
                onChange={(val) => dispatch({ type: "SET_REFERENCES", payload: val })}
                show={state.showReferences}
                onToggle={() => dispatch({ type: "TOGGLE_REFERENCES" })}
              />
            </CVFormSection>

            <CVFormSection title="Custom Sections">
              <CustomSectionForm
                value={state.customSections}
                onChange={(val) => dispatch({ type: "SET_CUSTOM_SECTIONS", payload: val })}
              />
            </CVFormSection>

            <CVFormSection title="Section Order">
              <SectionReorder
                sections={state.sectionOrder}
                onChange={(val) => dispatch({ type: "REORDER_SECTIONS", payload: val })}
                labels={sectionLabels}
              />
            </CVFormSection>
          </div>
        </div>

        {/* Right panel - Preview */}
        <div className={cn("flex-1 overflow-hidden bg-muted/20", mobileTab === "edit" && "hidden md:flex md:flex-col")}>
          <div className="h-full overflow-y-auto">
            <div className="min-h-full p-4">
              <div id="cv-preview" className="mx-auto max-w-[794px] shadow-md">
                <TemplateComponent content={state} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

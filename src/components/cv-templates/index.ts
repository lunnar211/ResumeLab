import type { ReactElement } from "react"
import type { CVContent } from "@/types/cv"
import { ClassicProfessional } from "./ClassicProfessional"
import { ModernMinimal } from "./ModernMinimal"
import { ATSOptimized } from "./ATSOptimized"
import { ExecutiveBlue } from "./ExecutiveBlue"
import { TechnicalDeveloper } from "./TechnicalDeveloper"
import { CreativeColorful } from "./CreativeColorful"

export { ClassicProfessional, ModernMinimal, ATSOptimized, ExecutiveBlue, TechnicalDeveloper, CreativeColorful }

type TemplateComponent = (props: { content: CVContent }) => ReactElement

const templateComponentMap: Record<string, TemplateComponent> = {
  "classic-professional": ClassicProfessional,
  "modern-minimal": ModernMinimal,
  "ats-optimized": ATSOptimized,
  "executive-blue": ExecutiveBlue,
  "technical-developer": TechnicalDeveloper,
  "creative-colorful": CreativeColorful,
  "academic-scholar": ClassicProfessional,
  "europass-eu": ATSOptimized,
  "student-entry": ModernMinimal,
  "international-global": ClassicProfessional,
}

export function getTemplateComponent(templateId: string): TemplateComponent {
  return templateComponentMap[templateId] ?? ClassicProfessional
}

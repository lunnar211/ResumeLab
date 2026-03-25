import type { CVContent } from "@/types/cv"
import { formatDate } from "@/lib/utils"

interface Props {
  content: CVContent
}

export function ATSOptimized({ content }: Props) {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, publications, volunteerWork, awards, references, customSections, showReferences } = content

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#000", background: "#fff", padding: "32px", maxWidth: "794px", margin: "0 auto", lineHeight: 1.5 }}>
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 4px" }}>{personalInfo.fullName}</p>
        {personalInfo.professionalTitle && <p style={{ margin: "0 0 4px" }}>{personalInfo.professionalTitle}</p>}
        <p style={{ margin: "0 0 2px" }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | ")}
        </p>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <p style={{ margin: "0" }}>
            {[personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).join(" | ")}
          </p>
        )}
      </div>

      {personalInfo.summary && (
        <ATSSection title="SUMMARY">
          <p style={{ margin: 0 }}>{personalInfo.summary}</p>
        </ATSSection>
      )}

      {workExperience.length > 0 && (
        <ATSSection title="WORK EXPERIENCE">
          {workExperience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "12px" }}>
              <p style={{ fontWeight: "bold", margin: "0 0 2px" }}>{exp.role} | {exp.company}</p>
              <p style={{ margin: "0 0 4px" }}>{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</p>
              {exp.description && <p style={{ margin: "0 0 4px" }}>{exp.description}</p>}
              {exp.bullets.filter(Boolean).map((b, i) => <p key={i} style={{ margin: "0 0 2px", paddingLeft: "12px" }}>- {b}</p>)}
            </div>
          ))}
        </ATSSection>
      )}

      {education.length > 0 && (
        <ATSSection title="EDUCATION">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "8px" }}>
              <p style={{ fontWeight: "bold", margin: "0 0 2px" }}>
                {edu.degree}{edu.field ? `, ${edu.field}` : ""} | {edu.institution}
              </p>
              <p style={{ margin: "0" }}>{formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}</p>
            </div>
          ))}
        </ATSSection>
      )}

      {skills.length > 0 && (
        <ATSSection title="SKILLS">
          <p style={{ margin: 0 }}>{skills.map((s) => s.name).join(", ")}</p>
        </ATSSection>
      )}

      {languages.length > 0 && (
        <ATSSection title="LANGUAGES">
          <p style={{ margin: 0 }}>{languages.map((l) => `${l.name} (${l.level})`).join(", ")}</p>
        </ATSSection>
      )}

      {certifications.length > 0 && (
        <ATSSection title="CERTIFICATIONS">
          {certifications.map((c) => (
            <p key={c.id} style={{ margin: "0 0 4px" }}>{c.name} | {c.issuer} | {c.date}</p>
          ))}
        </ATSSection>
      )}

      {projects.length > 0 && (
        <ATSSection title="PROJECTS">
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "8px" }}>
              <p style={{ fontWeight: "bold", margin: "0 0 2px" }}>{p.name}</p>
              <p style={{ margin: "0 0 2px" }}>{p.description}</p>
              {p.technologies.length > 0 && <p style={{ margin: "0" }}>Technologies: {p.technologies.join(", ")}</p>}
            </div>
          ))}
        </ATSSection>
      )}

      {publications.length > 0 && (
        <ATSSection title="PUBLICATIONS">
          {publications.map((p) => (
            <p key={p.id} style={{ margin: "0 0 4px" }}>{p.title} | {p.publisher} | {p.date}</p>
          ))}
        </ATSSection>
      )}

      {volunteerWork.length > 0 && (
        <ATSSection title="VOLUNTEER WORK">
          {volunteerWork.map((v) => (
            <div key={v.id} style={{ marginBottom: "8px" }}>
              <p style={{ fontWeight: "bold", margin: "0 0 2px" }}>{v.role} | {v.organization}</p>
              <p style={{ margin: "0 0 2px" }}>{formatDate(v.startDate)} - {formatDate(v.endDate)}</p>
              {v.description && <p style={{ margin: 0 }}>{v.description}</p>}
            </div>
          ))}
        </ATSSection>
      )}

      {awards.length > 0 && (
        <ATSSection title="AWARDS">
          {awards.map((a) => (
            <p key={a.id} style={{ margin: "0 0 4px" }}>{a.title} | {a.issuer} | {a.date}</p>
          ))}
        </ATSSection>
      )}

      {showReferences && references.length > 0 && (
        <ATSSection title="REFERENCES">
          {references.map((r) => (
            <div key={r.id} style={{ marginBottom: "8px" }}>
              <p style={{ fontWeight: "bold", margin: "0 0 2px" }}>{r.name} | {r.title}, {r.company}</p>
              <p style={{ margin: "0" }}>{r.email} | {r.phone}</p>
            </div>
          ))}
        </ATSSection>
      )}

      {customSections.map((s) => (
        <ATSSection key={s.id} title={s.label.toUpperCase()}>
          <p style={{ margin: 0 }}>{s.content}</p>
        </ATSSection>
      ))}
    </div>
  )
}

function ATSSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontWeight: "bold", fontSize: "12px", borderBottom: "1px solid #000", paddingBottom: "2px", margin: "0 0 8px" }}>
        {title}
      </p>
      {children}
    </div>
  )
}

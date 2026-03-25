import type { CVContent } from "@/types/cv"
import { formatDate } from "@/lib/utils"

interface Props {
  content: CVContent
}

export function ModernMinimal({ content }: Props) {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, publications, volunteerWork, awards, references, customSections, showReferences } = content

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "11px", color: "#1a1a1a", background: "#fff", padding: "36px", maxWidth: "794px", margin: "0 auto", lineHeight: 1.6 }}>
      {/* Name */}
      <h1 style={{ fontSize: "28px", fontWeight: "300", margin: "0 0 4px", letterSpacing: "2px", textTransform: "uppercase" }}>
        {personalInfo.fullName}
      </h1>
      {personalInfo.professionalTitle && (
        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#0066cc", fontWeight: "500" }}>
          {personalInfo.professionalTitle}
        </p>
      )}
      <div style={{ display: "flex", gap: "16px", fontSize: "10px", color: "#666", marginBottom: "28px", flexWrap: "wrap" }}>
        {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github, personalInfo.website]
          .filter(Boolean)
          .map((v, i) => <span key={i}>{v}</span>)}
      </div>

      {personalInfo.summary && (
        <MinSection title="Profile" accent="#0066cc">
          <p style={{ margin: 0, fontSize: "11px" }}>{personalInfo.summary}</p>
        </MinSection>
      )}

      {workExperience.length > 0 && (
        <MinSection title="Experience" accent="#0066cc">
          {workExperience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{exp.role}</strong>
                <span style={{ fontSize: "10px", color: "#888" }}>{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
              </div>
              <div style={{ color: "#0066cc", fontSize: "10px" }}>{exp.company}</div>
              {exp.description && <p style={{ fontSize: "10px", marginTop: "4px" }}>{exp.description}</p>}
              {exp.bullets.filter(Boolean).map((b, i) => (
                <div key={i} style={{ fontSize: "10px", paddingLeft: "12px", marginTop: "2px" }}>– {b}</div>
              ))}
            </div>
          ))}
        </MinSection>
      )}

      {education.length > 0 && (
        <MinSection title="Education" accent="#0066cc">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{edu.degree}{edu.field ? ` – ${edu.field}` : ""}</strong>
                <span style={{ fontSize: "10px", color: "#888" }}>{formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}</span>
              </div>
              <div style={{ color: "#0066cc", fontSize: "10px" }}>{edu.institution}</div>
            </div>
          ))}
        </MinSection>
      )}

      {skills.length > 0 && (
        <MinSection title="Skills" accent="#0066cc">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((s) => (
              <span key={s.id} style={{ background: "#f0f4ff", border: "1px solid #ccd8ff", borderRadius: "3px", padding: "2px 8px", fontSize: "10px" }}>
                {s.name}
              </span>
            ))}
          </div>
        </MinSection>
      )}

      {languages.length > 0 && (
        <MinSection title="Languages" accent="#0066cc">
          <div style={{ display: "flex", gap: "16px" }}>
            {languages.map((l) => (
              <span key={l.id} style={{ fontSize: "10px" }}><strong>{l.name}</strong> {l.level}</span>
            ))}
          </div>
        </MinSection>
      )}

      {certifications.length > 0 && (
        <MinSection title="Certifications" accent="#0066cc">
          {certifications.map((c) => (
            <div key={c.id} style={{ fontSize: "10px", marginBottom: "4px" }}>
              <strong>{c.name}</strong> — {c.issuer} · {c.date}
            </div>
          ))}
        </MinSection>
      )}

      {projects.length > 0 && (
        <MinSection title="Projects" accent="#0066cc">
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "10px" }}>
              <strong style={{ fontSize: "11px" }}>{p.name}</strong>
              <p style={{ fontSize: "10px", margin: "2px 0" }}>{p.description}</p>
              {p.technologies.length > 0 && (
                <p style={{ fontSize: "9px", color: "#666" }}>{p.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </MinSection>
      )}

      {volunteerWork.length > 0 && (
        <MinSection title="Volunteer" accent="#0066cc">
          {volunteerWork.map((v) => (
            <div key={v.id} style={{ marginBottom: "8px" }}>
              <strong>{v.role}</strong> — {v.organization}
              <div style={{ fontSize: "9px", color: "#888" }}>{formatDate(v.startDate)} – {formatDate(v.endDate)}</div>
            </div>
          ))}
        </MinSection>
      )}

      {awards.length > 0 && (
        <MinSection title="Awards" accent="#0066cc">
          {awards.map((a) => (
            <div key={a.id} style={{ fontSize: "10px", marginBottom: "6px" }}>
              <strong>{a.title}</strong> — {a.issuer} · {a.date}
            </div>
          ))}
        </MinSection>
      )}

      {publications.length > 0 && (
        <MinSection title="Publications" accent="#0066cc">
          {publications.map((p) => (
            <div key={p.id} style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "11px" }}>{p.title}</strong>
              <div style={{ fontSize: "9px", color: "#666" }}>{p.publisher} · {p.date}</div>
            </div>
          ))}
        </MinSection>
      )}

      {showReferences && references.length > 0 && (
        <MinSection title="References" accent="#0066cc">
          {references.map((r) => (
            <div key={r.id} style={{ marginBottom: "8px" }}>
              <strong>{r.name}</strong> — {r.title}, {r.company}
              <div style={{ fontSize: "9px", color: "#777" }}>{r.email}</div>
            </div>
          ))}
        </MinSection>
      )}

      {customSections.map((s) => (
        <MinSection key={s.id} title={s.label} accent="#0066cc">
          <p style={{ margin: 0, fontSize: "10px" }}>{s.content}</p>
        </MinSection>
      ))}
    </div>
  )
}

function MinSection({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent, margin: "0 0 10px" }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

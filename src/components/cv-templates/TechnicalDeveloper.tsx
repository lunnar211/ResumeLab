import type { CVContent } from "@/types/cv"
import { formatDate } from "@/lib/utils"

interface Props {
  content: CVContent
}

export function TechnicalDeveloper({ content }: Props) {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, publications, volunteerWork, awards, references, customSections, showReferences } = content

  return (
    <div style={{ fontFamily: "'SFMono-Regular', 'Consolas', monospace", fontSize: "10px", color: "#24292e", background: "#fff", padding: "28px", maxWidth: "794px", margin: "0 auto", lineHeight: 1.6 }}>
      {/* Header */}
      <div style={{ borderBottom: "3px solid #24292e", paddingBottom: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 4px" }}>{personalInfo.fullName}</h1>
        {personalInfo.professionalTitle && (
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#586069" }}>{personalInfo.professionalTitle}</p>
        )}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "10px", color: "#586069" }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.github && <span>⌥ {personalInfo.github}</span>}
          {personalInfo.linkedin && <span>in {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <TechSection title="About">
          <p style={{ margin: 0, fontSize: "10px" }}>{personalInfo.summary}</p>
        </TechSection>
      )}

      {/* Skills prominently */}
      {skills.length > 0 && (
        <TechSection title="Technical Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((s) => (
              <span key={s.id} style={{ background: "#f1f8ff", border: "1px solid #c8e1ff", borderRadius: "3px", padding: "2px 8px", fontSize: "10px", color: "#0366d6" }}>
                {s.name}
              </span>
            ))}
          </div>
        </TechSection>
      )}

      {/* Projects prominently */}
      {projects.length > 0 && (
        <TechSection title="Projects">
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "14px", borderLeft: "3px solid #0366d6", paddingLeft: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontSize: "11px" }}>{p.name}</strong>
                <span style={{ fontSize: "9px", color: "#888" }}>
                  {p.startDate && `${formatDate(p.startDate)} – ${p.endDate ? formatDate(p.endDate) : "Present"}`}
                </span>
              </div>
              <p style={{ fontSize: "10px", margin: "3px 0", color: "#586069" }}>{p.description}</p>
              {p.technologies.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {p.technologies.map((t, i) => (
                    <span key={i} style={{ background: "#fafbfc", border: "1px solid #e1e4e8", borderRadius: "2px", padding: "1px 6px", fontSize: "9px" }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {(p.github || p.url) && (
                <div style={{ fontSize: "9px", color: "#0366d6", marginTop: "3px" }}>
                  {p.github && <span>{p.github}</span>}
                  {p.url && <span style={{ marginLeft: "8px" }}>{p.url}</span>}
                </div>
              )}
            </div>
          ))}
        </TechSection>
      )}

      {workExperience.length > 0 && (
        <TechSection title="Experience">
          {workExperience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "11px" }}>{exp.role}</strong>
                <span style={{ fontSize: "9px", color: "#888" }}>
                  {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <div style={{ fontSize: "10px", color: "#0366d6" }}>{exp.company}</div>
              {exp.description && <p style={{ fontSize: "10px", marginTop: "4px" }}>{exp.description}</p>}
              {exp.bullets.filter(Boolean).map((b, i) => (
                <div key={i} style={{ fontSize: "10px", paddingLeft: "10px", marginTop: "2px", color: "#444" }}>→ {b}</div>
              ))}
            </div>
          ))}
        </TechSection>
      )}

      {education.length > 0 && (
        <TechSection title="Education">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "8px" }}>
              <strong style={{ fontSize: "11px" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</strong>
              <div style={{ fontSize: "10px", color: "#586069" }}>
                {edu.institution} · {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
              </div>
            </div>
          ))}
        </TechSection>
      )}

      {certifications.length > 0 && (
        <TechSection title="Certifications">
          {certifications.map((c) => (
            <div key={c.id} style={{ fontSize: "10px", marginBottom: "4px" }}>
              <strong>{c.name}</strong> — {c.issuer} ({c.date})
            </div>
          ))}
        </TechSection>
      )}

      {languages.length > 0 && (
        <TechSection title="Languages">
          <div style={{ display: "flex", gap: "16px" }}>
            {languages.map((l) => (
              <span key={l.id} style={{ fontSize: "10px" }}><strong>{l.name}</strong> {l.level}</span>
            ))}
          </div>
        </TechSection>
      )}

      {publications.length > 0 && (
        <TechSection title="Publications">
          {publications.map((p) => (
            <div key={p.id} style={{ marginBottom: "6px", fontSize: "10px" }}>
              <strong>{p.title}</strong> — {p.publisher} · {p.date}
            </div>
          ))}
        </TechSection>
      )}

      {volunteerWork.length > 0 && (
        <TechSection title="Volunteer Work">
          {volunteerWork.map((v) => (
            <div key={v.id} style={{ marginBottom: "8px", fontSize: "10px" }}>
              <strong>{v.role}</strong> — {v.organization}
              <span style={{ color: "#888", marginLeft: "8px" }}>{formatDate(v.startDate)} – {formatDate(v.endDate)}</span>
            </div>
          ))}
        </TechSection>
      )}

      {awards.length > 0 && (
        <TechSection title="Awards">
          {awards.map((a) => (
            <div key={a.id} style={{ fontSize: "10px", marginBottom: "4px" }}>
              <strong>{a.title}</strong> — {a.issuer} · {a.date}
            </div>
          ))}
        </TechSection>
      )}

      {showReferences && references.length > 0 && (
        <TechSection title="References">
          {references.map((r) => (
            <div key={r.id} style={{ marginBottom: "8px", fontSize: "10px" }}>
              <strong>{r.name}</strong> — {r.title}, {r.company}
              <div style={{ color: "#666" }}>{r.email}</div>
            </div>
          ))}
        </TechSection>
      )}

      {customSections.map((s) => (
        <TechSection key={s.id} title={s.label}>
          <p style={{ margin: 0, fontSize: "10px" }}>{s.content}</p>
        </TechSection>
      ))}
    </div>
  )
}

function TechSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h2 style={{ fontSize: "11px", fontWeight: "bold", background: "#f6f8fa", border: "1px solid #e1e4e8", borderRadius: "3px", padding: "4px 10px", margin: "0 0 10px", display: "inline-block" }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

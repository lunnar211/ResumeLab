import type { CVContent } from "@/types/cv"
import { formatDate } from "@/lib/utils"

interface Props {
  content: CVContent
}

export function ExecutiveBlue({ content }: Props) {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, volunteerWork, awards, references, customSections, showReferences } = content

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11px", color: "#1a1a2e", background: "#fff", maxWidth: "794px", margin: "0 auto", lineHeight: 1.5 }}>
      {/* Navy header */}
      <div style={{ background: "#1a237e", color: "#fff", padding: "32px 36px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: "0 0 6px", letterSpacing: "1px" }}>
          {personalInfo.fullName}
        </h1>
        {personalInfo.professionalTitle && (
          <p style={{ fontSize: "15px", margin: "0 0 14px", color: "#c5cae9", fontStyle: "italic" }}>
            {personalInfo.professionalTitle}
          </p>
        )}
        <div style={{ display: "flex", gap: "20px", fontSize: "10px", color: "#9fa8da", flexWrap: "wrap" }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <div style={{ display: "flex", gap: "20px", fontSize: "10px", color: "#9fa8da", marginTop: "4px", flexWrap: "wrap" }}>
            {[personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "28px 36px" }}>
        {personalInfo.summary && (
          <ExecSection title="Executive Summary">
            <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.7 }}>{personalInfo.summary}</p>
          </ExecSection>
        )}

        {workExperience.length > 0 && (
          <ExecSection title="Professional Experience">
            {workExperience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e8eaf6", paddingBottom: "4px", marginBottom: "6px" }}>
                  <div>
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>{exp.role}</span>
                    <span style={{ color: "#3949ab", marginLeft: "8px", fontSize: "11px" }}>{exp.company}</span>
                  </div>
                  <span style={{ fontSize: "10px", color: "#666" }}>
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p style={{ fontSize: "11px", marginBottom: "4px" }}>{exp.description}</p>}
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} style={{ fontSize: "10px", paddingLeft: "14px", marginTop: "3px" }}>▸ {b}</div>
                ))}
              </div>
            ))}
          </ExecSection>
        )}

        {education.length > 0 && (
          <ExecSection title="Education">
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </span>
                    <span style={{ color: "#3949ab", marginLeft: "8px", fontSize: "10px" }}>{edu.institution}</span>
                  </div>
                  <span style={{ fontSize: "10px", color: "#666" }}>
                    {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </ExecSection>
        )}

        <div style={{ display: "flex", gap: "24px" }}>
          {skills.length > 0 && (
            <div style={{ flex: 1 }}>
              <ExecSection title="Core Competencies">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {skills.map((s) => (
                    <span key={s.id} style={{ background: "#e8eaf6", borderRadius: "3px", padding: "2px 8px", fontSize: "10px", color: "#1a237e" }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </ExecSection>
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ flex: 1 }}>
              <ExecSection title="Languages">
                {languages.map((l) => (
                  <div key={l.id} style={{ fontSize: "10px", marginBottom: "3px" }}>
                    <strong>{l.name}</strong> — {l.level}
                  </div>
                ))}
              </ExecSection>
            </div>
          )}
        </div>

        {certifications.length > 0 && (
          <ExecSection title="Certifications">
            {certifications.map((c) => (
              <div key={c.id} style={{ fontSize: "10px", marginBottom: "4px" }}>
                <strong>{c.name}</strong> — {c.issuer} ({c.date})
              </div>
            ))}
          </ExecSection>
        )}

        {projects.length > 0 && (
          <ExecSection title="Key Projects">
            {projects.map((p) => (
              <div key={p.id} style={{ marginBottom: "10px" }}>
                <strong style={{ fontSize: "11px" }}>{p.name}</strong>
                <p style={{ fontSize: "10px", margin: "3px 0" }}>{p.description}</p>
              </div>
            ))}
          </ExecSection>
        )}

        {awards.length > 0 && (
          <ExecSection title="Awards & Recognition">
            {awards.map((a) => (
              <div key={a.id} style={{ fontSize: "10px", marginBottom: "6px" }}>
                <strong>{a.title}</strong> — {a.issuer} · {a.date}
              </div>
            ))}
          </ExecSection>
        )}

        {showReferences && references.length > 0 && (
          <ExecSection title="References">
            {references.map((r) => (
              <div key={r.id} style={{ marginBottom: "8px" }}>
                <strong>{r.name}</strong> — {r.title}, {r.company}
                <div style={{ fontSize: "9px", color: "#666" }}>{r.email}</div>
              </div>
            ))}
          </ExecSection>
        )}

        {customSections.map((s) => (
          <ExecSection key={s.id} title={s.label}>
            <p style={{ margin: 0, fontSize: "10px" }}>{s.content}</p>
          </ExecSection>
        ))}
      </div>
    </div>
  )
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1.5px", color: "#1a237e", borderBottom: "2px solid #1a237e", paddingBottom: "4px", margin: "0 0 10px" }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

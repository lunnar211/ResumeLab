import type { CVContent } from "@/types/cv"
import { formatDate } from "@/lib/utils"

interface Props {
  content: CVContent
}

export function ClassicProfessional({ content }: Props) {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, publications, volunteerWork, awards, references, customSections, showReferences } = content

  return (
    <div style={{ fontFamily: "Georgia, serif", fontSize: "11px", color: "#222", background: "#fff", padding: "32px", maxWidth: "794px", margin: "0 auto", lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, letterSpacing: "1px" }}>{personalInfo.fullName}</h1>
        {personalInfo.professionalTitle && (
          <p style={{ margin: "4px 0", fontSize: "13px", color: "#555" }}>{personalInfo.professionalTitle}</p>
        )}
        <p style={{ margin: "4px 0", fontSize: "10px", color: "#666" }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join("  ·  ")}
        </p>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <p style={{ margin: "4px 0", fontSize: "10px", color: "#666" }}>
            {[personalInfo.linkedin, personalInfo.github, personalInfo.website].filter(Boolean).join("  ·  ")}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        {/* Left sidebar */}
        <div style={{ width: "220px", flexShrink: 0 }}>
          {skills.length > 0 && (
            <Section title="Skills">
              {skills.map((s) => (
                <div key={s.id} style={{ marginBottom: "4px" }}>
                  <span style={{ fontSize: "10px" }}>{s.name}</span>
                  {s.level && <span style={{ fontSize: "9px", color: "#888", marginLeft: "4px" }}>({s.level})</span>}
                </div>
              ))}
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages">
              {languages.map((l) => (
                <div key={l.id} style={{ fontSize: "10px", marginBottom: "4px" }}>
                  {l.name} <span style={{ color: "#888" }}>{l.level}</span>
                </div>
              ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications">
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: "8px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "bold" }}>{c.name}</div>
                  <div style={{ fontSize: "9px", color: "#666" }}>{c.issuer}, {c.date}</div>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          {personalInfo.summary && (
            <Section title="Summary">
              <p style={{ fontSize: "10px", margin: 0 }}>{personalInfo.summary}</p>
            </Section>
          )}

          {workExperience.length > 0 && (
            <Section title="Experience">
              {workExperience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: "bold", fontSize: "11px" }}>{exp.role}</span>
                    <span style={{ fontSize: "9px", color: "#666" }}>
                      {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", color: "#555", fontStyle: "italic" }}>{exp.company}</div>
                  {exp.description && <p style={{ fontSize: "10px", marginTop: "4px", marginBottom: "4px" }}>{exp.description}</p>}
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <div key={i} style={{ fontSize: "10px", paddingLeft: "12px", marginTop: "2px" }}>• {b}</div>
                  ))}
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </span>
                    <span style={{ fontSize: "9px", color: "#666" }}>
                      {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div style={{ fontSize: "10px", color: "#555", fontStyle: "italic" }}>{edu.institution}</div>
                  {edu.description && <p style={{ fontSize: "10px", marginTop: "4px" }}>{edu.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: "12px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "11px" }}>{proj.name}</div>
                  <p style={{ fontSize: "10px", margin: "2px 0" }}>{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <p style={{ fontSize: "9px", color: "#666", margin: "2px 0" }}>
                      Tech: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {volunteerWork.length > 0 && (
            <Section title="Volunteer Work">
              {volunteerWork.map((vol) => (
                <div key={vol.id} style={{ marginBottom: "10px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "11px" }}>{vol.role} — {vol.organization}</div>
                  <div style={{ fontSize: "9px", color: "#666" }}>{formatDate(vol.startDate)} – {formatDate(vol.endDate)}</div>
                  {vol.description && <p style={{ fontSize: "10px", marginTop: "3px" }}>{vol.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {awards.length > 0 && (
            <Section title="Awards">
              {awards.map((a) => (
                <div key={a.id} style={{ marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "11px" }}>{a.title}</span>
                  <span style={{ fontSize: "9px", color: "#666", marginLeft: "8px" }}>{a.issuer} · {a.date}</span>
                  {a.description && <p style={{ fontSize: "10px", margin: "2px 0" }}>{a.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {publications.length > 0 && (
            <Section title="Publications">
              {publications.map((pub) => (
                <div key={pub.id} style={{ marginBottom: "10px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "11px" }}>{pub.title}</div>
                  <div style={{ fontSize: "9px", color: "#666" }}>{pub.publisher} · {pub.date}</div>
                  {pub.description && <p style={{ fontSize: "10px", marginTop: "3px" }}>{pub.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {showReferences && references.length > 0 && (
            <Section title="References">
              {references.map((ref) => (
                <div key={ref.id} style={{ marginBottom: "10px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "11px" }}>{ref.name}</div>
                  <div style={{ fontSize: "10px", color: "#555" }}>{ref.title}, {ref.company}</div>
                  <div style={{ fontSize: "9px", color: "#777" }}>{ref.email} · {ref.phone}</div>
                </div>
              ))}
            </Section>
          )}

          {customSections.map((sec) => (
            <Section key={sec.id} title={sec.label}>
              <p style={{ fontSize: "10px", margin: 0 }}>{sec.content}</p>
            </Section>
          ))}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #ccc", paddingBottom: "3px", margin: "0 0 8px" }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

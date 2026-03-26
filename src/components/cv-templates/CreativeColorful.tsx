import type { CVContent } from "@/types/cv"
import { formatDate } from "@/lib/utils"

interface Props {
  content: CVContent
}

export function CreativeColorful({ content }: Props) {
  const {
    personalInfo,
    workExperience,
    education,
    skills,
    languages,
    certifications,
    projects,
    awards,
  } = content

  const accentColor = "#6C3FC5"
  const lightAccent = "#F3EEFF"
  const darkBg = "#1E0A3C"

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "11px",
        color: "#222",
        background: "#fff",
        maxWidth: "794px",
        margin: "0 auto",
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: darkBg,
          color: "#fff",
          padding: "32px 36px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: accentColor,
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: 200,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#FF6B6B",
            opacity: 0.25,
          }}
        />
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.5px",
            color: "#fff",
          }}
        >
          {personalInfo.fullName}
        </h1>
        {personalInfo.professionalTitle && (
          <p
            style={{
              margin: "6px 0",
              fontSize: "14px",
              color: "#C9A8FF",
              fontWeight: 500,
            }}
          >
            {personalInfo.professionalTitle}
          </p>
        )}
        <p style={{ margin: "8px 0 0", fontSize: "10px", color: "#bbb" }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#bbb" }}>
            {[personalInfo.linkedin, personalInfo.github, personalInfo.website]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        )}
      </div>

      <div style={{ display: "flex" }}>
        {/* Left sidebar */}
        <div
          style={{
            width: "33%",
            background: lightAccent,
            padding: "24px 20px",
            flexShrink: 0,
          }}
        >
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Skills
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    style={{
                      background: accentColor,
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "9px",
                      fontWeight: 600,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "12px" }}>
                  <p style={{ fontWeight: 700, margin: 0, color: "#1E0A3C" }}>{edu.institution}</p>
                  <p style={{ margin: "2px 0", color: "#555" }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  <p style={{ margin: 0, color: "#888", fontSize: "9px" }}>
                    {formatDate(edu.startDate)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Languages
              </h2>
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{lang.name}</span>
                  <span style={{ color: "#666", fontSize: "9px" }}>{lang.level}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: "8px" }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>{cert.name}</p>
                  <p style={{ margin: "1px 0", color: "#555" }}>{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "24px 28px" }}>
          {/* Summary */}
          {personalInfo.summary && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                About Me
              </h2>
              <p style={{ margin: 0, color: "#444", lineHeight: 1.6 }}>
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Experience
              </h2>
              {workExperience.map((job) => (
                <div key={job.id} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "12px",
                        color: darkBg,
                      }}
                    >
                      {job.role}
                    </span>
                    <span style={{ color: "#888", fontSize: "9px", whiteSpace: "nowrap" }}>
                      {formatDate(job.startDate)} –{" "}
                      {job.current ? "Present" : formatDate(job.endDate)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "2px 0 4px",
                      fontWeight: 600,
                      color: accentColor,
                      fontSize: "10px",
                    }}
                  >
                    {job.company}
                  </p>
                  {job.description && (
                    <p style={{ margin: "4px 0", color: "#555" }}>{job.description}</p>
                  )}
                  {job.bullets.length > 0 && (
                    <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
                      {job.bullets.map((bullet, i) => (
                        <li key={i} style={{ marginBottom: "2px", color: "#444" }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Projects
              </h2>
              {projects.map((project) => (
                <div key={project.id} style={{ marginBottom: "12px" }}>
                  <p style={{ fontWeight: 700, margin: 0, color: darkBg }}>{project.name}</p>
                  {project.description && (
                    <p style={{ margin: "3px 0", color: "#555" }}>{project.description}</p>
                  )}
                  {project.url && (
                    <p style={{ margin: "2px 0", color: accentColor, fontSize: "9px" }}>
                      {project.url}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Awards
              </h2>
              {awards.map((award) => (
                <div key={award.id} style={{ marginBottom: "8px" }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>{award.title}</p>
                  <p style={{ margin: "2px 0", color: "#555" }}>{award.issuer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

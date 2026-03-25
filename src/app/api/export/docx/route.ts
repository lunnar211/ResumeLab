import { NextRequest, NextResponse } from "next/server"
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx"
import type { CVContent } from "@/types/cv"

function separator() {
  return new Paragraph({
    border: {
      bottom: { color: "999999", space: 1, style: BorderStyle.SINGLE, size: 6 },
    },
    spacing: { after: 100 },
  })
}

function sectionHeading(text: string) {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 100 },
    border: {
      bottom: { color: "333333", space: 1, style: BorderStyle.SINGLE, size: 6 },
    },
  })
}

function bullet(text: string) {
  return new Paragraph({
    text: `• ${text}`,
    spacing: { after: 80 },
    indent: { left: 360 },
  })
}

export async function POST(request: NextRequest) {
  const { content }: { content: CVContent } = await request.json()
  const { personalInfo, workExperience, education, skills, languages, certifications, projects, publications, volunteerWork, awards, references, customSections } = content

  const children: (Paragraph | Table)[] = []

  // Header
  children.push(
    new Paragraph({
      children: [new TextRun({ text: personalInfo.fullName, bold: true, size: 48 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: personalInfo.professionalTitle, size: 28, color: "444444" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: [personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join("  |  "),
          size: 20,
          color: "666666",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  )

  const links = [
    personalInfo.linkedin && `LinkedIn: ${personalInfo.linkedin}`,
    personalInfo.github && `GitHub: ${personalInfo.github}`,
    personalInfo.website && `Website: ${personalInfo.website}`,
  ].filter(Boolean)

  if (links.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: links.join("  |  "), size: 20, color: "666666" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
      })
    )
  }

  // Summary
  if (personalInfo.summary) {
    children.push(
      sectionHeading("Professional Summary"),
      new Paragraph({ text: personalInfo.summary, spacing: { after: 200 } })
    )
  }

  // Work Experience
  if (workExperience.length) {
    children.push(sectionHeading("Work Experience"))
    for (const exp of workExperience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.role, bold: true, size: 24 }),
            new TextRun({ text: `  —  ${exp.company}`, size: 24, color: "444444" }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`,
              size: 20,
              color: "777777",
              italics: true,
            }),
          ],
          spacing: { after: 80 },
        })
      )
      if (exp.description) {
        children.push(new Paragraph({ text: exp.description, spacing: { after: 80 } }))
      }
      for (const b of exp.bullets) {
        if (b.trim()) children.push(bullet(b))
      }
      children.push(new Paragraph({ text: "", spacing: { after: 120 } }))
    }
  }

  // Education
  if (education.length) {
    children.push(sectionHeading("Education"))
    for (const edu of education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, bold: true, size: 24 }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [new TextRun({ text: edu.institution, size: 22, color: "444444" })],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.startDate} – ${edu.current ? "Present" : edu.endDate}`,
              size: 20,
              color: "777777",
              italics: true,
            }),
          ],
          spacing: { after: 120 },
        })
      )
      if (edu.description) {
        children.push(new Paragraph({ text: edu.description, spacing: { after: 120 } }))
      }
    }
  }

  // Skills
  if (skills.length) {
    children.push(
      sectionHeading("Skills"),
      new Paragraph({
        children: [
          new TextRun({ text: skills.map((s) => `${s.name}${s.level ? ` (${s.level})` : ""}`).join("  •  "), size: 22 }),
        ],
        spacing: { after: 200 },
      })
    )
  }

  // Languages
  if (languages.length) {
    children.push(
      sectionHeading("Languages"),
      new Paragraph({
        children: [
          new TextRun({ text: languages.map((l) => `${l.name} (${l.level})`).join("  •  "), size: 22 }),
        ],
        spacing: { after: 200 },
      })
    )
  }

  // Certifications
  if (certifications.length) {
    children.push(sectionHeading("Certifications"))
    for (const cert of certifications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 22 }),
            new TextRun({ text: `  —  ${cert.issuer}`, size: 20, color: "555555" }),
            new TextRun({ text: `  (${cert.date})`, size: 20, color: "777777" }),
          ],
          spacing: { after: 100 },
        })
      )
    }
  }

  // Projects
  if (projects.length) {
    children.push(sectionHeading("Projects"))
    for (const proj of projects) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.name, bold: true, size: 24 })],
          spacing: { after: 60 },
        }),
        new Paragraph({ text: proj.description, spacing: { after: 80 } })
      )
      if (proj.technologies.length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Technologies: ", bold: true, size: 20 }),
              new TextRun({ text: proj.technologies.join(", "), size: 20, color: "555555" }),
            ],
            spacing: { after: 120 },
          })
        )
      }
    }
  }

  // Publications
  if (publications.length) {
    children.push(sectionHeading("Publications"))
    for (const pub of publications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: pub.title, bold: true, size: 22 }),
            new TextRun({ text: `  —  ${pub.publisher} (${pub.date})`, size: 20, color: "555555" }),
          ],
          spacing: { after: 80 },
        })
      )
      if (pub.description) {
        children.push(new Paragraph({ text: pub.description, spacing: { after: 120 } }))
      }
    }
  }

  // Volunteer Work
  if (volunteerWork.length) {
    children.push(sectionHeading("Volunteer Work"))
    for (const vol of volunteerWork) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: vol.role, bold: true, size: 22 }),
            new TextRun({ text: `  —  ${vol.organization}`, size: 20, color: "444444" }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${vol.startDate} – ${vol.endDate}`, size: 20, color: "777777", italics: true }),
          ],
          spacing: { after: 80 },
        })
      )
      if (vol.description) {
        children.push(new Paragraph({ text: vol.description, spacing: { after: 120 } }))
      }
    }
  }

  // Awards
  if (awards.length) {
    children.push(sectionHeading("Awards"))
    for (const award of awards) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: award.title, bold: true, size: 22 }),
            new TextRun({ text: `  —  ${award.issuer} (${award.date})`, size: 20, color: "555555" }),
          ],
          spacing: { after: 80 },
        })
      )
      if (award.description) {
        children.push(new Paragraph({ text: award.description, spacing: { after: 120 } }))
      }
    }
  }

  // References
  if (content.showReferences && references.length) {
    children.push(sectionHeading("References"))
    for (const ref of references) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: ref.name, bold: true, size: 22 }),
            new TextRun({ text: `  —  ${ref.title}, ${ref.company}`, size: 20, color: "444444" }),
          ],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${ref.email}  |  ${ref.phone}`, size: 20, color: "666666" }),
          ],
          spacing: { after: 120 },
        })
      )
    }
  }

  // Custom Sections
  for (const section of customSections) {
    children.push(
      sectionHeading(section.label),
      new Paragraph({ text: section.content, spacing: { after: 200 } })
    )
  }

  const doc = new Document({
    sections: [{ children }],
    styles: {
      default: {
        document: {
          run: { size: 22, font: "Calibri" },
        },
      },
    },
  })

  const buffer = await Packer.toBuffer(doc)
  const uint8Array = new Uint8Array(buffer)

  return new NextResponse(uint8Array, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="cv.docx"`,
    },
  })
}

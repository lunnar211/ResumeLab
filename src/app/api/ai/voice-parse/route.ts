import { NextRequest, NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";

const sectionPrompts: Record<string, string> = {
  personalInfo: `Extract personal information from this text and return a JSON object with these fields (use null for missing fields):
{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "location": string | null,
  "website": string | null,
  "linkedin": string | null,
  "github": string | null,
  "jobTitle": string | null
}`,
  workExperience: `Extract work experience from this text and return a JSON object:
{
  "company": string | null,
  "position": string | null,
  "startDate": string | null,
  "endDate": string | null,
  "current": boolean,
  "description": string | null,
  "location": string | null
}`,
  education: `Extract education information from this text and return a JSON object:
{
  "institution": string | null,
  "degree": string | null,
  "fieldOfStudy": string | null,
  "startDate": string | null,
  "endDate": string | null,
  "current": boolean,
  "gpa": string | null,
  "description": string | null
}`,
  skills: `Extract skills from this text and return a JSON array of skill names: ["skill1", "skill2", ...]`,
  summary: `Rewrite this as a professional resume summary paragraph. Return just the summary text, no JSON wrapper.`,
};

export async function POST(request: NextRequest) {
  try {
    const { transcript, section } = await request.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "transcript is required" }, { status: 400 });
    }
    if (!section || typeof section !== "string") {
      return NextResponse.json({ error: "section is required" }, { status: 400 });
    }

    const systemPrompt =
      sectionPrompts[section] ||
      `Extract relevant resume information from this text and return it as a JSON object with appropriate fields.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a resume data extraction assistant. ${systemPrompt}\n\nRespond ONLY with valid JSON (or a plain string for summary). Do not include any explanation or markdown code blocks.`,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      max_tokens: 600,
    });

    const raw = completion.choices[0]?.message.content?.trim() ?? "";

    // For summary section, return as text field directly
    if (section === "summary") {
      return NextResponse.json({ fields: { summary: raw } });
    }

    // For skills, parse array
    if (section === "skills") {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return NextResponse.json({ fields: { skills: arr } });
        }
      } catch {
        return NextResponse.json({ fields: { skills: raw.split(/,\s*/) } });
      }
    }

    // For other sections, parse as object and filter nulls
    try {
      const parsed = JSON.parse(raw);
      const fields: Record<string, string | boolean> = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value !== null && value !== undefined && value !== "") {
          fields[key] = value as string | boolean;
        }
      }
      return NextResponse.json({ fields });
    } catch {
      return NextResponse.json({ fields: { raw } });
    }
  } catch (error) {
    console.error("voice-parse error:", error);
    return NextResponse.json({ error: "Failed to parse voice input" }, { status: 500 });
  }
}

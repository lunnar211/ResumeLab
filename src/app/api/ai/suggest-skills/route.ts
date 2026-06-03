import { NextRequest, NextResponse } from "next/server";
import { getGroq } from "@/lib/groq";

const MODEL = "llama-3.3-70b-versatile";

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const withStatus = error as { status?: number; response?: { status?: number } };
  return withStatus.status === 429 || withStatus.response?.status === 429;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(request: NextRequest) {
  try {
    const groq = getGroq();
    const { prompt } = await request.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
    });
    const result = completion.choices[0]?.message.content;
    if (typeof result !== "string") {
      throw new Error("Unexpected response format from Groq API");
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("suggest-skills error:", error);
    if (isRateLimitError(error)) {
      return NextResponse.json({ error: "AI busy, try again" }, { status: 429 });
    }
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

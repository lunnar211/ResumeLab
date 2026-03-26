import { NextRequest, NextResponse } from "next/server";
import { getGroq, GROQ_MODEL } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const completion = await getGroq().chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });
    const result = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("improve-bullet error:", error);
    return NextResponse.json({ error: "Failed to improve bullet" }, { status: 500 });
  }
}

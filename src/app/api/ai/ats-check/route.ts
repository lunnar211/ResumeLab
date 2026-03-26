import { NextRequest, NextResponse } from "next/server";
import { askAI } from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const result = await askAI(prompt, 600);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("ats-check error:", error);
    return NextResponse.json({ error: "Failed to run ATS check" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const SYSTEM_PROMPTS: Record<string, string> = {
  enhance:
    "You are a professional CV writer. Enhance the given text to be more impactful, professional, and achievement-focused. Use strong action verbs and quantify achievements where possible.",
  grammar:
    "You are a grammar expert. Fix any grammar, spelling, or punctuation errors in the given text while preserving the original meaning.",
  ats: "You are an ATS optimization expert. Analyze the given CV content and suggest improvements to pass ATS scanners. Include relevant keywords.",
  summary:
    "You are a professional CV writer. Write a compelling professional summary based on the given information.",
  voice:
    "You are a voice-to-text transcription assistant for CV building. Convert the spoken text into professional CV content.",
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString())

  if ((count ?? 0) >= 20) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Upgrade to Pro for more AI credits." },
      { status: 429 }
    )
  }

  const { messages, feature } = await request.json()
  const systemPrompt = SYSTEM_PROMPTS[feature] ?? SYSTEM_PROMPTS.enhance

  const makeRequest = async (apiUrl: string, apiKey: string, model: string) => {
    return fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
        max_tokens: 1024,
      }),
    })
  }

  let response: Response | null = null
  try {
    response = await makeRequest(
      "https://api.groq.com/openai/v1/chat/completions",
      process.env.GROQ_API_KEY!,
      "llama-3.3-70b-versatile"
    )
    if (!response.ok) throw new Error("Groq failed")
  } catch {
    try {
      response = await makeRequest(
        "https://openrouter.ai/api/v1/chat/completions",
        process.env.OPENROUTER_API_KEY!,
        "meta-llama/llama-3.3-70b-instruct"
      )
    } catch {
      return NextResponse.json({ error: "AI service unavailable. Please try again later." }, { status: 503 })
    }
  }

  if (!response || !response.ok || !response.body) {
    return NextResponse.json({ error: "AI service returned an invalid response." }, { status: 502 })
  }

  // Log usage asynchronously (best-effort, non-blocking)
  supabase.from("usage_logs").insert({ user_id: user.id, feature, tokens_used: 1 }).then(() => {})

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  })
}

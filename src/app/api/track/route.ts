import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { event } = await req.json()
    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "event is required" }, { status: 400 })
    }

    // Log to usage_logs table (feature = event name, metadata in user context)
    const { error } = await supabase.from("usage_logs").insert({
      user_id: user.id,
      feature: event,
      tokens_used: 0,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Track error:", error)
      // Non-critical, don't fail the request
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Track route error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}

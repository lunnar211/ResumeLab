import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || !adminEmail || user.email !== adminEmail) return null
  return user
}

export async function POST(req: NextRequest) {
  const admin_user = await checkAdmin()
  if (!admin_user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const { userId, plan } = await req.json()
    if (!userId || !plan) return NextResponse.json({ error: "userId and plan required" }, { status: 400 })

    const validPlans = ["free", "pro", "enterprise"]
    if (!validPlans.includes(plan)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 })

    const admin = createAdminClient()
    const { error } = await admin.from("profiles").update({ plan }).eq("id", userId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update plan error:", error)
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
  }
}

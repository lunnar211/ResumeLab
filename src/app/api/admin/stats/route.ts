import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || !adminEmail || user.email !== adminEmail) return null
  return user
}

export async function GET() {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const admin = createAdminClient()
    const [usersRes, cvsRes] = await Promise.all([
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("cvs").select("*", { count: "exact", head: true }),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const activeRes = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("updated_at", today.toISOString())

    const aiRes = await admin
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())

    return NextResponse.json({
      totalUsers: usersRes.count ?? 0,
      totalCVs: cvsRes.count ?? 0,
      activeToday: activeRes.count ?? 0,
      aiRequestsToday: aiRes.count ?? 0,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

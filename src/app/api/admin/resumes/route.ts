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

export async function GET(req: NextRequest) {
  const admin_user = await checkAdmin()
  if (!admin_user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") ?? "1")
  const perPage = 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  try {
    const admin = createAdminClient()
    const { data, count, error } = await admin
      .from("cvs")
      .select("id, title, template_id, created_at, updated_at, user_id, is_public", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw error

    return NextResponse.json({ resumes: data ?? [], total: count ?? 0, page, perPage })
  } catch (error) {
    console.error("Admin resumes error:", error)
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 })
  }
}

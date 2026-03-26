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
  const search = searchParams.get("search") ?? ""
  const perPage = 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  try {
    const admin = createAdminClient()
    let query = admin
      .from("profiles")
      .select("id, full_name, email, plan, created_at, updated_at, ai_requests_today", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ users: data ?? [], total: count ?? 0, page, perPage })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

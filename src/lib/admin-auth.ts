import { createClient } from "@/lib/supabase/server"

export async function requireAdmin(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || !adminEmail || user.email !== adminEmail) {
    const { redirect } = await import("next/navigation")
    redirect("/dashboard")
  }
}

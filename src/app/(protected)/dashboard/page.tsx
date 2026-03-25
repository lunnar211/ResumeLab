import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: cvs }, { count: usageCount }] = await Promise.all([
    supabase
      .from("cvs")
      .select("*")
      .eq("user_id", user!.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user!.id),
  ])

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user!.id)
    .single()

  return (
    <DashboardClient
      cvs={cvs ?? []}
      usageCount={usageCount ?? 0}
      plan={profile?.plan ?? "free"}
      userId={user!.id}
    />
  )
}

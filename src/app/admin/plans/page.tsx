import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"

async function getPlansData() {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("profiles")
      .select("id, full_name, email, plan, created_at, ai_requests_today")
      .order("created_at", { ascending: false })
    
    const plans: Record<string, number> = { free: 0, pro: 0, enterprise: 0 }
    ;(data ?? []).forEach((u: { plan: string }) => {
      const p = u.plan ?? "free"
      plans[p] = (plans[p] ?? 0) + 1
    })
    
    return { users: data ?? [], plans }
  } catch {
    return { users: [], plans: { free: 0, pro: 0, enterprise: 0 } }
  }
}

export default async function AdminPlansPage() {
  const { users, plans } = await getPlansData()
  const total = users.length || 1

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Plans</h1>

      {/* Distribution */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(plans).map(([plan, count]) => (
          <div key={plan} className="rounded-xl border bg-background p-5 shadow-sm">
            <p className="text-sm text-muted-foreground capitalize mb-1">{plan}</p>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((count / total) * 100)}% of users</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="rounded-xl border bg-background shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">AI Used Today</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: { id: string; full_name: string; email: string; plan: string; ai_requests_today: number }) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{user.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.plan === "pro" ? "default" : user.plan === "enterprise" ? "secondary" : "outline"} className="capitalize">
                    {user.plan ?? "free"}
                  </Badge>
                </td>
                <td className="px-4 py-3">{user.ai_requests_today ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

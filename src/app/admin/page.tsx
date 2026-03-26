import { createAdminClient } from "@/lib/supabase/admin"
import { Users, FileText, Zap, TrendingUp } from "lucide-react"

async function getStats() {
  try {
    const admin = createAdminClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [usersRes, cvsRes, activeRes, aiRes] = await Promise.all([
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("cvs").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }).gte("updated_at", today.toISOString()),
      admin.from("usage_logs").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    ])

    return {
      totalUsers: usersRes.count ?? 0,
      totalCVs: cvsRes.count ?? 0,
      activeToday: activeRes.count ?? 0,
      aiRequestsToday: aiRes.count ?? 0,
    }
  } catch {
    return { totalUsers: 0, totalCVs: 0, activeToday: 0, aiRequestsToday: 0 }
  }
}

async function getRecentActivity() {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("usage_logs")
      .select("user_id, feature, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()])

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Total CVs", value: stats.totalCVs, icon: FileText, color: "text-green-500" },
    { label: "Active Today", value: stats.activeToday, icon: TrendingUp, color: "text-orange-500" },
    { label: "AI Requests Today", value: stats.aiRequestsToday, icon: Zap, color: "text-purple-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="border-b px-5 py-3">
          <h2 className="font-semibold">Recent AI Activity</h2>
        </div>
        {activity.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No activity yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-5 py-2 font-medium text-muted-foreground">User ID</th>
                  <th className="text-left px-5 py-2 font-medium text-muted-foreground">Feature</th>
                  <th className="text-left px-5 py-2 font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-5 py-2 font-mono text-xs text-muted-foreground truncate max-w-[120px]">{row.user_id}</td>
                    <td className="px-5 py-2 capitalize">{row.feature ?? "—"}</td>
                    <td className="px-5 py-2 text-muted-foreground text-xs">{new Date(row.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

import { createAdminClient } from "@/lib/supabase/admin"

async function getAnalytics() {
  try {
    const admin = createAdminClient()
    
    // Last 14 days user signups
    const since = new Date()
    since.setDate(since.getDate() - 14)
    const { data: newUsers } = await admin
      .from("profiles")
      .select("created_at")
      .gte("created_at", since.toISOString())

    // Template usage
    const { data: templateData } = await admin
      .from("cvs")
      .select("template_id")

    // AI feature usage
    const { data: aiData } = await admin
      .from("usage_logs")
      .select("feature")
      .limit(1000)

    return { newUsers: newUsers ?? [], templateData: templateData ?? [], aiData: aiData ?? [] }
  } catch {
    return { newUsers: [], templateData: [], aiData: [] }
  }
}

export default async function AdminAnalyticsPage() {
  const { newUsers, templateData, aiData } = await getAnalytics()

  // Process template counts
  const templateCounts: Record<string, number> = {}
  templateData.forEach((cv: { template_id: string }) => {
    const t = cv.template_id ?? "unknown"
    templateCounts[t] = (templateCounts[t] ?? 0) + 1
  })
  const topTemplates = Object.entries(templateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Process AI feature counts
  const aiCounts: Record<string, number> = {}
  aiData.forEach((log: { feature: string }) => {
    const f = log.feature ?? "unknown"
    aiCounts[f] = (aiCounts[f] ?? 0) + 1
  })
  const aiFeatures = Object.entries(aiCounts).sort((a, b) => b[1] - a[1])

  // Daily signups for last 14 days
  const dailySignups: Record<string, number> = {}
  const baseDate = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - i)
    dailySignups[d.toISOString().split("T")[0]] = 0
  }
  newUsers.forEach((u: { created_at: string }) => {
    const day = u.created_at.split("T")[0]
    if (day in dailySignups) dailySignups[day] = (dailySignups[day] ?? 0) + 1
  })

  const totalNewUsers = newUsers.length
  const totalAI = aiData.length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Signups */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <h2 className="font-semibold mb-4">New Users (Last 14 Days) — {totalNewUsers} total</h2>
          <div className="flex items-end gap-1 h-24">
            {Object.entries(dailySignups).map(([day, count]) => {
              const max = Math.max(...Object.values(dailySignups), 1)
              const height = Math.round((count / max) * 100)
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-0.5" title={`${day}: ${count}`}>
                  <div
                    className="w-full bg-primary/70 rounded-t"
                    style={{ height: `${height}%`, minHeight: count > 0 ? "4px" : "0" }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Templates */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Top Templates</h2>
          {topTemplates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topTemplates.map(([template, count]) => {
                const total = templateData.length || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={template} className="flex items-center gap-2 text-sm">
                    <span className="w-36 truncate capitalize">{template.replace(/-/g, " ")}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* AI Feature Usage */}
        <div className="rounded-xl border bg-background p-5 shadow-sm md:col-span-2">
          <h2 className="font-semibold mb-4">AI Feature Usage — {totalAI} total requests</h2>
          {aiFeatures.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {aiFeatures.map(([feature, count]) => (
                <div key={feature} className="rounded-lg border p-3 text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">{feature}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"

async function getUsers(page: number, search: string) {
  try {
    const admin = createAdminClient()
    const perPage = 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = admin
      .from("profiles")
      .select("id, full_name, email, plan, created_at, ai_requests_today", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, count } = await query
    return { users: data ?? [], total: count ?? 0 }
  } catch {
    return { users: [], total: 0 }
  }
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const params = await searchParams
  const page = parseInt(params.page ?? "1")
  const search = params.search ?? ""
  const { users, total } = await getUsers(page, search)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-sm text-muted-foreground">{total.toLocaleString()} total</span>
      </div>

      <div className="rounded-xl border bg-background shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">AI Used Today</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found</td>
              </tr>
            ) : (
              users.map((user: { id: string; full_name: string; email: string; plan: string; created_at: string; ai_requests_today: number }) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{user.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.plan === "pro" ? "default" : user.plan === "enterprise" ? "secondary" : "outline"} className="capitalize">
                      {user.plan ?? "free"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{user.ai_requests_today ?? 0}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

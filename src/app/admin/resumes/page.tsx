import { createAdminClient } from "@/lib/supabase/admin"
import { Badge } from "@/components/ui/badge"

async function getResumes(page: number) {
  try {
    const admin = createAdminClient()
    const perPage = 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    const { data, count } = await admin
      .from("cvs")
      .select("id, title, template_id, created_at, user_id, is_public", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)
    return { resumes: data ?? [], total: count ?? 0 }
  } catch {
    return { resumes: [], total: 0 }
  }
}

export default async function AdminResumesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = parseInt(params.page ?? "1")
  const { resumes, total } = await getResumes(page)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <span className="text-sm text-muted-foreground">{total.toLocaleString()} total</span>
      </div>

      <div className="rounded-xl border bg-background shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Template</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Visibility</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
            </tr>
          </thead>
          <tbody>
            {resumes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No resumes found</td>
              </tr>
            ) : (
              resumes.map((cv: { id: string; title: string; template_id: string; created_at: string; is_public: boolean }) => (
                <tr key={cv.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{cv.title}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{cv.template_id?.replace(/-/g, " ")}</td>
                  <td className="px-4 py-3">
                    <Badge variant={cv.is_public ? "default" : "outline"}>{cv.is_public ? "Public" : "Private"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(cv.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

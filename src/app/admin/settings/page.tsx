export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="max-w-lg">
        <div className="rounded-xl border bg-background p-6 shadow-sm space-y-6">
          <div>
            <h2 className="font-semibold mb-1">Admin Email</h2>
            <p className="text-sm text-muted-foreground">
              Set via <code className="bg-muted px-1 rounded text-xs">ADMIN_EMAIL</code> environment variable.
            </p>
          </div>
          <div>
            <h2 className="font-semibold mb-1">AI Provider</h2>
            <p className="text-sm text-muted-foreground">
              Groq (llama-3.3-70b-versatile). Set via <code className="bg-muted px-1 rounded text-xs">GROQ_API_KEY</code>.
            </p>
          </div>
          <div>
            <h2 className="font-semibold mb-1">Database</h2>
            <p className="text-sm text-muted-foreground">
              Supabase. Set via <code className="bg-muted px-1 rounded text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-muted px-1 rounded text-xs">SUPABASE_SERVICE_ROLE_KEY</code>.
            </p>
          </div>
          <div>
            <h2 className="font-semibold mb-1">App URL</h2>
            <p className="text-sm text-muted-foreground">
              Set via <code className="bg-muted px-1 rounded text-xs">NEXT_PUBLIC_APP_URL</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { LayoutDashboard, Users, FileText, BarChart3, CreditCard, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/resumes", label: "Resumes", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/plans", label: "Plans", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    // ADMIN_EMAIL env var is not configured — show a clear setup error instead
    // of silently redirecting, so the operator knows what to fix.
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="rounded-xl border bg-card p-8 shadow-sm max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Admin not configured</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Set the <code className="rounded bg-muted px-1 py-0.5 text-xs">ADMIN_EMAIL</code> environment variable
            in your Render dashboard to enable admin access.
          </p>
          <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (user.email !== adminEmail) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-gray-900 text-white">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-700">
          <span className="font-bold text-lg">ResumeLabAI</span>
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase">Admin</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-700 px-4 py-3">
          <p className="text-xs text-gray-400 truncate mb-2">{user.email}</p>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Link>
        </div>
      </aside>
      {/* Mobile header */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="md:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-3">
          <span className="font-bold">Admin</span>
          <div className="ml-auto flex gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="p-1.5 rounded hover:bg-gray-700">
                <item.icon className="h-4 w-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
        <main className="flex-1 bg-gray-50 dark:bg-gray-900/10 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

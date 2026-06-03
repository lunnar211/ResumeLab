import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const nextPath = searchParams.get("next") ?? "/dashboard"

  // Use the configured app URL so that the redirect always uses the correct
  // scheme and host, even when running behind a reverse-proxy on Render where
  // request.url may carry an `http://` origin instead of `https://`.
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_auth_code`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const errorMessage = encodeURIComponent(error.message)
    return NextResponse.redirect(`${appUrl}/login?error=auth_callback_error&message=${errorMessage}`)
  }

  return NextResponse.redirect(`${appUrl}${nextPath}`)
}

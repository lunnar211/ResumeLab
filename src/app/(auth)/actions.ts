"use server"

import { createClient } from "@/lib/supabase/server"

type ActionResult = { success: true } | { error: string }

export async function signInWithEmail(email: string, password: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signInWithGoogle(): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || ""
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appUrl}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  })
  if (error) return { error: error.message }
  if (!data.url) return { error: "No redirect URL returned" }
  return { url: data.url }
}

export async function signInWithMagicLink(email: string): Promise<ActionResult> {
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || ""
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function resetPassword(email: string): Promise<ActionResult> {
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || ""
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/reset-password`,
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updatePassword(password: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  return { success: true }
}

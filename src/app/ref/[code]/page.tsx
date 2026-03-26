import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createAdminClient } from "@/lib/supabase/admin"
import { StoreReferral } from "./store-referral"

async function getReferrerName(code: string): Promise<string | null> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("profiles")
      .select("full_name")
      .eq("referral_code", code)
      .single()
    return data?.full_name ?? null
  } catch {
    return null
  }
}

export default async function RefPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const referrerName = await getReferrerName(code)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-3">
          {referrerName
            ? `${referrerName} invited you to ResumeLabAI!`
            : "You've been invited to ResumeLabAI!"}
        </h1>
        <p className="text-muted-foreground text-lg mb-3">
          Build professional CVs with AI assistance — for free!
        </p>
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 mb-8">
          <p className="font-semibold text-primary">✨ Special offer: Sign up and get bonus AI credits!</p>
        </div>
        <Button size="lg" className="w-full text-base" asChild>
          <Link href={`/signup?ref=${code}`}>Get Started Free →</Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline">Sign in</Link>
        </p>
        {/* Store referral in localStorage via client component */}
        <StoreReferral code={code} />
      </div>
    </div>
  )
}

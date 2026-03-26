"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function ReferPage() {
  const [copied, setCopied] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReferral = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get or generate referral code
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single()

      if (profile?.referral_code) {
        setReferralCode(profile.referral_code)
      } else {
        // Generate a cryptographically secure unique code
        const code = crypto.randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase()
        await supabase.from("profiles").update({ referral_code: code }).eq("id", user.id)
        setReferralCode(code)
      }
      setLoading(false)
    }
    loadReferral()
  }, [])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumelab-d6gn.onrender.com"
  const referralLink = referralCode ? `${appUrl}/ref/${referralCode}` : ""

  const copy = async () => {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Build your CV with AI for free! Use my link: ${referralLink}`)
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const shareTwitter = () => {
    const text = encodeURIComponent(`Just discovered @ResumeLabAI — build professional CVs with AI. Get started free: ${referralLink}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const shareEmail = () => {
    const subject = encodeURIComponent("Build your CV with AI for free!")
    const body = encodeURIComponent(`Hey!\n\nI've been using ResumeLabAI to build my CV with AI assistance. It's free to start!\n\nUse my referral link: ${referralLink}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Invite Friends</h1>
      <p className="text-muted-foreground mb-8">
        Get 1 month Pro FREE for every 3 friends who sign up using your link!
      </p>

      {/* Reward banner */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 mb-8 flex items-center gap-4">
        <div className="text-4xl">🎁</div>
        <div>
          <h2 className="font-semibold">Referral Reward</h2>
          <p className="text-sm text-muted-foreground">Refer 3 friends → Get 1 month Pro FREE automatically</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="rounded-xl border bg-background p-5 mb-6">
        <h2 className="font-semibold mb-3">Your Referral Link</h2>
        {loading ? (
          <div className="h-10 bg-muted animate-pulse rounded" />
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 rounded-md border bg-muted/30 px-3 py-2 text-sm font-mono truncate">
              {referralLink}
            </div>
            <Button variant="outline" size="sm" onClick={copy} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        )}
      </div>

      {/* Share buttons */}
      <div className="rounded-xl border bg-background p-5 mb-8">
        <h2 className="font-semibold mb-3">Share via</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={shareWhatsApp} className="gap-2">
            <Share2 className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline" onClick={shareTwitter} className="gap-2">
            <Share2 className="h-4 w-4" />
            Twitter
          </Button>
          <Button variant="outline" onClick={shareEmail} className="gap-2">
            <Share2 className="h-4 w-4" />
            Email
          </Button>
        </div>
      </div>
    </div>
  )
}

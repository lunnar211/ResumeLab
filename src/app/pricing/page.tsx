"use client"

import { useState } from "react"
import { Check, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for getting started",
    badge: null,
    features: [
      { text: "3 CVs maximum", included: true },
      { text: "5 AI requests/day", included: true },
      { text: "3 templates", included: true },
      { text: "PDF export", included: true },
      { text: "Community support", included: true },
      { text: "DOCX export", included: false },
      { text: "Voice assistant", included: false },
      { text: "ATS checker", included: false },
      { text: "Custom colors", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 9,
    yearlyPrice: 7,
    description: "For serious job seekers",
    badge: "Most Popular",
    features: [
      { text: "Unlimited CVs", included: true },
      { text: "100 AI requests/day", included: true },
      { text: "All 10 templates", included: true },
      { text: "PDF export", included: true },
      { text: "DOCX export", included: true },
      { text: "Voice assistant", included: true },
      { text: "ATS checker", included: true },
      { text: "Custom colors", included: true },
      { text: "Priority email support", included: true },
      { text: "Team workspace", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 29,
    yearlyPrice: 23,
    description: "For teams and power users",
    badge: null,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited AI", included: true },
      { text: "Team workspace (5 members)", included: true },
      { text: "Custom branding", included: true },
      { text: "API access", included: true },
      { text: "Dedicated support", included: true },
      { text: "Invoice billing", included: true },
      { text: "SLA guarantee", included: true },
      { text: "Custom templates", included: true },
      { text: "Advanced analytics", included: true },
    ],
  },
]

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period." },
  { q: "Is there a free trial?", a: "Our Free plan is available forever with no credit card required. Upgrade when you need more features." },
  { q: "What AI model is used?", a: "We use Llama 3.3 70B via Groq for fast, high-quality AI assistance." },
  { q: "Can I export my CV?", a: "All plans include PDF export. Pro and Enterprise plans also include DOCX export." },
  { q: "Is my data secure?", a: "Yes, we use Supabase with row-level security. Your data is encrypted and private." },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">ResumeLabAI</Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild><Link href="/login">Sign In</Link></Button>
          <Button size="sm" asChild><Link href="/signup">Get Started</Link></Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Simple, transparent pricing</h1>
          <p className="text-muted-foreground text-lg">Start free, upgrade when you need more</p>
          
          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-all", !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-all", annual ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Annual
              <Badge variant="secondary" className="ml-1.5 text-[10px]">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {plans.map((plan) => {
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice
            const isPopular = plan.badge === "Most Popular"
            return (
              <div
                key={plan.id}
                className={cn(
                  "rounded-2xl border p-6 flex flex-col",
                  isPopular && "border-primary ring-2 ring-primary/20 shadow-lg relative"
                )}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-0.5 text-xs">{plan.badge}</Badge>
                  </div>
                )}
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-muted-foreground">/month</span>
                  {annual && price > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">Billed annually (${price * 12}/yr)</p>
                  )}
                </div>
                <Button
                  className="w-full mb-6"
                  variant={isPopular ? "default" : "outline"}
                  onClick={() => plan.id === "free" ? null : setShowModal(true)}
                  asChild={plan.id === "free"}
                >
                  {plan.id === "free" ? (
                    <Link href="/signup">Get Started Free</Link>
                  ) : (
                    <span>Get {plan.name} {isPopular && <Zap className="ml-1.5 h-3.5 w-3.5 inline" />}</span>
                  )}
                </Button>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className={cn("flex items-center gap-2", !f.included && "text-muted-foreground")}>
                      {f.included ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border p-5">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-background p-8 shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-2">Coming Soon! 🚀</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Paid plans are coming very soon. For now, enjoy the Free plan with all core features!
            </p>
            <Button onClick={() => setShowModal(false)} className="w-full">Got it</Button>
          </div>
        </div>
      )}
    </div>
  )
}

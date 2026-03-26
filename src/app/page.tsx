import Link from "next/link"
import type { ReactElement } from "react"
import { type LucideProps, Brain, CheckCircle, Layout, Mic, Download, Cloud, FileText, Check, Star, Zap, Shield } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { templates } from "@/lib/templates"
import { LandingAnimations } from "./landing-animations"

type FeatureIcon = (props: LucideProps) => ReactElement

const features: { Icon: FeatureIcon; title: string; description: string }[] = [
  { Icon: Brain as FeatureIcon, title: "AI Writing Assistant", description: "Generate professional summaries, bullet points, and skill suggestions powered by Groq AI." },
  { Icon: Layout as FeatureIcon, title: "10+ Professional Templates", description: "Classic, modern, ATS-friendly, creative and more — designed by professionals for every industry." },
  { Icon: CheckCircle as FeatureIcon, title: "ATS Score Checker", description: "Instantly analyze your CV's ATS compatibility and get keyword suggestions to rank higher." },
  { Icon: Mic as FeatureIcon, title: "Voice Input", description: "Fill your resume by speaking naturally. Just describe your experience and watch it auto-fill." },
  { Icon: Download as FeatureIcon, title: "PDF & DOCX Export", description: "Download your finished CV in PDF or Word format, ready to send to any employer." },
  { Icon: Cloud as FeatureIcon, title: "Auto-Save to Cloud", description: "Your work is saved automatically as you type. Access your CVs from any device, any time." },
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["3 CVs", "5 AI credits/day", "Free templates", "PDF export"],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    features: ["Unlimited CVs", "100 AI credits/day", "All templates", "PDF & DOCX export", "Custom domain sharing"],
    cta: "Start Pro",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/mo",
    features: ["Everything in Pro", "5 team seats", "Shared templates", "Priority support", "Analytics dashboard"],
    cta: "Start Team",
    href: "/signup",
    highlighted: false,
  },
]

const stats = [
  { label: "CVs Created", value: "50,000+" },
  { label: "Job Offers Landed", value: "12,000+" },
  { label: "Templates Available", value: "10+" },
  { label: "AI Suggestions Made", value: "200,000+" },
]

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer at Google", text: "I landed my dream job at Google within 3 weeks of using ResumeLabAI. The ATS checker was a game changer!", stars: 5 },
  { name: "Marcus Williams", role: "Product Manager at Meta", text: "The AI writing assistant helped me articulate my achievements in ways I never could have alone. Incredible tool.", stars: 5 },
  { name: "Priya Sharma", role: "Data Scientist at Stripe", text: "The templates are beautiful and the voice input feature saved me so much time. Highly recommend!", stars: 5 },
]

const templatePreviews = templates.slice(0, 6)

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero — deep blue to purple gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1e3a8a] to-[#7C3AED] px-4 py-28 text-center sm:py-36">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#7C3AED]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#2563EB]/30 blur-3xl" />

        <LandingAnimations>
          <Badge className="border border-white/20 bg-white/10 px-4 py-1 text-sm text-white backdrop-blur-sm">
            ✨ AI-Powered Resume Builder
          </Badge>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Build Your Perfect Resume{" "}
            <span className="bg-gradient-to-r from-[#60a5fa] to-[#c084fc] bg-clip-text text-transparent">
              with AI
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-blue-100 sm:text-xl">
            ATS-optimized, professionally designed templates. Land your dream job faster.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="bg-white text-[#1e3a8a] hover:bg-blue-50 font-semibold shadow-lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm" asChild>
              <Link href="/templates">View Templates</Link>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-blue-200">{s.label}</p>
              </div>
            ))}
          </div>
        </LandingAnimations>
      </section>

      {/* Trust bar */}
      <section className="border-b bg-muted/40 px-4 py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Built with Groq AI</span>
          <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> ATS Optimized</span>
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" /> 4.9/5 Rating</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500" /> Free to Start</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Everything you need to get hired</h2>
            <p className="mt-4 text-lg text-muted-foreground">Powerful tools that make building a standout resume effortless</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates showcase */}
      <section id="templates" className="bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <Badge variant="secondary" className="mb-4">Templates</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Professional Templates</h2>
            <p className="mt-4 text-lg text-muted-foreground">Choose from 10+ beautifully crafted templates for every career</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templatePreviews.map((template) => (
              <Card key={template.id} className="group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/10 transition-all group-hover:from-primary/10 group-hover:to-secondary/20">
                  <div className="w-24 space-y-1.5 rounded-sm border border-border bg-white p-2 shadow-md dark:bg-card">
                    <div className="h-1.5 w-full rounded bg-primary/70" />
                    <div className="h-1 w-2/3 rounded bg-muted-foreground/30" />
                    <div className="mt-2 space-y-1">
                      <div className="h-0.5 w-full rounded bg-border" />
                      <div className="h-0.5 w-5/6 rounded bg-border" />
                      <div className="h-0.5 w-4/6 rounded bg-border" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                    </div>
                    {template.isPremium ? (
                      <Badge variant="secondary" className="shrink-0 text-xs">Pro</Badge>
                    ) : (
                      <Badge variant="outline" className="shrink-0 text-xs text-green-600">Free</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/templates">Browse All Templates →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Loved by job seekers worldwide</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="flex flex-col">
                <CardContent className="flex flex-col gap-4 pt-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-auto">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">Start free, upgrade when you need more</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`relative overflow-hidden transition-all ${plan.highlighted ? "border-primary shadow-xl ring-2 ring-primary/20" : "hover:shadow-md"}`}>
                {plan.highlighted && (
                  <div className="bg-primary py-1.5 text-center text-xs font-semibold text-primary-foreground">
                    🔥 Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.highlighted ? "default" : "outline"}
                    className="mt-2 w-full"
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to land your dream job?</h2>
          <p className="mt-4 text-blue-100">Join thousands of professionals who built their perfect resume with ResumeLabAI.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-white text-[#1e3a8a] hover:bg-blue-50 font-semibold" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link href="/templates">View Templates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2 font-bold text-lg">
              <FileText className="h-5 w-5 text-primary" />
              ResumeLabAI
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ResumeLabAI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
              <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

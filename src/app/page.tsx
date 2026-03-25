import Link from "next/link"
import type { ReactElement } from "react"
import { type LucideProps, Brain, CheckCircle, Layout, Mic, Download, Eye, FileText, Check } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { templates } from "@/lib/templates"
import { LandingAnimations } from "./landing-animations"

type FeatureIcon = (props: LucideProps) => ReactElement

const features: { Icon: FeatureIcon; title: string; description: string }[] = [
  { Icon: Brain as FeatureIcon, title: "AI-Powered", description: "Smart content suggestions to make your CV stand out" },
  { Icon: CheckCircle as FeatureIcon, title: "ATS-Optimized", description: "Pass ATS scanners and reach human recruiters" },
  { Icon: Layout as FeatureIcon, title: "10+ Templates", description: "Professional designs for every industry and role" },
  { Icon: Mic as FeatureIcon, title: "Voice Assistant", description: "Dictate your experience hands-free (Pro — coming soon)" },
  { Icon: Download as FeatureIcon, title: "Export PDF/DOCX", description: "Download in multiple formats instantly" },
  { Icon: Eye as FeatureIcon, title: "Real-time Preview", description: "See every change reflected instantly" },
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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center sm:py-32">
        <LandingAnimations>
          <Badge variant="secondary" className="px-4 py-1 text-sm">
            ✨ AI-Powered CV Builder
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Build Your Perfect CV with AI
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Create professional, ATS-optimized CVs in minutes with AI assistance. Stand out from the crowd
            with beautifully designed templates.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#templates">View Templates</a>
            </Button>
          </div>
        </LandingAnimations>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need</h2>
            <p className="mt-3 text-muted-foreground">Powerful features to help you land your dream job</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
                <Card key={feature.title} className="h-full">
                  <CardHeader>
                    <feature.Icon className="mb-2 h-8 w-8 text-primary" />
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

      {/* Templates */}
      <section id="templates" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Professional Templates</h2>
            <p className="mt-3 text-muted-foreground">Choose from 10+ professionally designed templates</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => (
              <Card key={template.id} className="group cursor-pointer transition-shadow hover:shadow-md">
                <div className="flex h-36 items-center justify-center rounded-t-lg bg-gradient-to-br from-muted to-muted/50">
                  <FileText className="h-12 w-12 text-muted-foreground/40" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                    </div>
                    {template.isPremium && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        Pro
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button size="lg" asChild>
              <Link href="/signup">Use a Template</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Simple Pricing</h2>
            <p className="mt-3 text-muted-foreground">Start free, upgrade when you need more</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={plan.highlighted ? "border-primary shadow-lg" : ""}>
                {plan.highlighted && (
                  <div className="rounded-t-lg bg-primary py-1 text-center text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-2">
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

      {/* Footer */}
      <footer className="border-t px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="h-5 w-5" />
            ResumeLabAI
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ResumeLabAI. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

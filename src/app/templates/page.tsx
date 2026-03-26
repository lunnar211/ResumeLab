"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Zap, Palette, Briefcase, GraduationCap, Globe, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { getTemplateComponent } from "@/components/cv-templates"
import type { CVContent } from "@/types/cv"

const sampleData: CVContent = {
  personalInfo: {
    fullName: "Alex Johnson",
    professionalTitle: "Senior Software Engineer",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    website: "alexjohnson.dev",
    photoUrl: "",
    summary:
      "Results-driven engineer with 7+ years building scalable web applications. Led teams of 5–10 engineers delivering products used by millions.",
  },
  workExperience: [
    {
      id: "1",
      company: "Google LLC",
      role: "Senior Software Engineer",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: "Lead engineer on Google Search infrastructure.",
      bullets: [
        "Reduced query latency by 40% through algorithmic improvements",
        "Mentored 4 junior engineers to promotion",
        "Led migration of 3 services to Kubernetes",
      ],
    },
    {
      id: "2",
      company: "Stripe Inc.",
      role: "Software Engineer",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: "Payments platform backend engineering.",
      bullets: [
        "Built payment reconciliation system processing $2B/month",
        "Improved API response times by 25%",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "MIT",
      degree: "B.S. Computer Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      current: false,
      description: "Dean's List. Focus on algorithms and distributed systems.",
    },
  ],
  skills: [
    { id: "1", name: "TypeScript", level: "expert", category: "Languages" },
    { id: "2", name: "React", level: "expert", category: "Frontend" },
    { id: "3", name: "Node.js", level: "advanced", category: "Backend" },
    { id: "4", name: "Python", level: "advanced", category: "Languages" },
    { id: "5", name: "Kubernetes", level: "intermediate", category: "DevOps" },
    { id: "6", name: "PostgreSQL", level: "advanced", category: "Databases" },
  ],
  languages: [
    { id: "1", name: "English", level: "Native" },
    { id: "2", name: "Spanish", level: "B2" },
  ],
  certifications: [
    { id: "1", name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2022-04" },
  ],
  publications: [],
  projects: [
    {
      id: "1",
      name: "OpenResume",
      description: "Open source resume builder with 10k+ GitHub stars",
      technologies: ["React", "TypeScript", "Next.js"],
      url: "openresume.dev",
      github: "github.com/alexjohnson/openresume",
      startDate: "2022-01",
      endDate: "2023-06",
    },
  ],
  volunteerWork: [],
  awards: [
    { id: "1", title: "Engineering Excellence Award", issuer: "Google", date: "2023-11", description: "Top 1% engineer recognition" },
  ],
  references: [],
  customSections: [],
  showReferences: false,
  sectionOrder: [
    "personalInfo", "summary", "workExperience", "education",
    "skills", "languages", "certifications", "projects",
    "publications", "volunteerWork", "awards", "references", "customSections",
  ],
}

const templateMeta: Record<string, { badge: string; badgeColor: string; category: string; icon: React.ReactNode }> = {
  "classic-professional": { badge: "Popular", badgeColor: "bg-blue-100 text-blue-700", category: "Professional", icon: <Briefcase className="h-3 w-3" /> },
  "modern-minimal":       { badge: "Trending", badgeColor: "bg-purple-100 text-purple-700", category: "Professional", icon: <Palette className="h-3 w-3" /> },
  "ats-optimized":        { badge: "ATS Friendly", badgeColor: "bg-green-100 text-green-700", category: "ATS", icon: <Zap className="h-3 w-3" /> },
  "executive-blue":       { badge: "Executive", badgeColor: "bg-slate-100 text-slate-700", category: "Professional", icon: <Briefcase className="h-3 w-3" /> },
  "creative-colorful":    { badge: "Creative", badgeColor: "bg-pink-100 text-pink-700", category: "Creative", icon: <Palette className="h-3 w-3" /> },
  "academic-scholar":     { badge: "Academic", badgeColor: "bg-amber-100 text-amber-700", category: "Academic", icon: <GraduationCap className="h-3 w-3" /> },
  "technical-developer":  { badge: "Tech", badgeColor: "bg-cyan-100 text-cyan-700", category: "Tech", icon: <Code className="h-3 w-3" /> },
  "europass-eu":          { badge: "European", badgeColor: "bg-indigo-100 text-indigo-700", category: "European", icon: <Globe className="h-3 w-3" /> },
  "student-entry":        { badge: "Entry Level", badgeColor: "bg-teal-100 text-teal-700", category: "Professional", icon: <FileText className="h-3 w-3" /> },
  "international-global": { badge: "Global", badgeColor: "bg-orange-100 text-orange-700", category: "Professional", icon: <Globe className="h-3 w-3" /> },
}

const filters = ["All", "ATS", "Creative", "Professional", "Academic", "European", "Tech"] as const
type Filter = (typeof filters)[number]

const templateOrder = [
  "classic-professional",
  "modern-minimal",
  "ats-optimized",
  "executive-blue",
  "creative-colorful",
  "academic-scholar",
  "technical-developer",
  "europass-eu",
  "student-entry",
  "international-global",
]

export default function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All")

  const filtered = templateOrder.filter((id) => {
    if (activeFilter === "All") return true
    return templateMeta[id]?.category === activeFilter
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#2563EB] px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold sm:text-5xl">Choose Your Template</h1>
        <p className="mt-3 text-lg text-blue-200">
          Professional designs for every industry and career stage
        </p>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-10 border-b bg-background/95 backdrop-blur px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-muted text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} templates</span>
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((id) => {
            const TemplateComp = getTemplateComponent(id)
            const meta = templateMeta[id]
            return (
              <TemplateCard
                key={id}
                id={id}
                TemplateComp={TemplateComp}
                meta={meta}
              />
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="h-5 w-5" />
            ResumeLabAI
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ResumeLabAI. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/signup" className="hover:text-foreground">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function TemplateCard({
  id,
  TemplateComp,
  meta,
}: {
  id: string
  TemplateComp: (props: { content: CVContent }) => React.ReactElement
  meta: { badge: string; badgeColor: string; category: string; icon: React.ReactNode }
}) {
  const name = id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return (
    <div className="group flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      {/* Preview window */}
      <div className="relative h-60 overflow-hidden bg-gray-100 border-b">
        {/* Scaled-down live preview */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "top left",
            transform: "scale(0.32)",
            width: "794px",
            pointerEvents: "none",
          }}
        >
          <TemplateComp content={sampleData} />
        </div>
        {/* Overlay for click target */}
        <div className="absolute inset-0" />
        {/* Category badge on preview */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badgeColor}`}>
            {meta.icon}
            {meta.badge}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{meta.category}</p>
        </div>
        <Button size="sm" asChild className="shrink-0 text-xs h-8">
          <Link href="/signup">Use Template</Link>
        </Button>
      </div>
    </div>
  )
}

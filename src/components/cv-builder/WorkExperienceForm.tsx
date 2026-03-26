"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp, Sparkles, Loader2 } from "lucide-react"
import type { WorkExperience } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

function newEntry(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    bullets: [],
  }
}

interface Props {
  value: WorkExperience[]
  onChange: (value: WorkExperience[]) => void
}

export function WorkExperienceForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(value[0]?.id ?? null)
  const [improvingId, setImprovingId] = useState<string | null>(null)
  const { toast } = useToast()

  const update = (id: string, data: Partial<WorkExperience>) => {
    onChange(value.map((e) => (e.id === id ? { ...e, ...data } : e)))
  }

  const add = () => {
    const entry = newEntry()
    onChange([...value, entry])
    setExpandedId(entry.id)
  }

  const remove = (id: string) => {
    onChange(value.filter((e) => e.id !== id))
  }

  const updateBullets = (id: string, bulletsText: string) => {
    const bullets = bulletsText.split("\n").filter((b) => b.trim())
    update(id, { bullets })
  }

  const improveBullets = async (exp: WorkExperience) => {
    if (!exp.bullets.length && !exp.description) return
    setImprovingId(exp.id)
    try {
      const context = exp.bullets.length
        ? exp.bullets.join("\n")
        : exp.description
      const prompt = `Rewrite and improve these resume bullet points for a ${exp.role} at ${exp.company}. Make them action-oriented, quantified where possible, and ATS-friendly. Return only the improved bullet points, one per line, no numbering or dashes:\n\n${context}`
      const res = await fetch("/api/ai/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.result) {
        const improved = (data.result as string).split("\n").filter((b: string) => b.trim())
        update(exp.id, { bullets: improved })
        toast({ title: "Bullets improved!", description: "AI has enhanced your bullet points." })
      }
    } catch {
      toast({ title: "AI failed", description: "Could not improve bullets. Please try again.", variant: "destructive" })
    } finally {
      setImprovingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value.map((exp) => (
        <div key={exp.id} className="rounded-md border">
          <button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          >
            <span className={cn("font-medium", !exp.role && !exp.company && "text-muted-foreground")}>
              {exp.role || exp.company || "New Experience"}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); remove(exp.id) }}
              >
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === exp.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {expandedId === exp.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Job Title</Label>
                <Input value={exp.role} onChange={(e) => update(exp.id, { role: e.target.value })} placeholder="Software Engineer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Company</Label>
                <Input value={exp.company} onChange={(e) => update(exp.id, { company: e.target.value })} placeholder="Acme Corp" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Start Date</Label>
                <Input type="month" value={exp.startDate} onChange={(e) => update(exp.id, { startDate: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>End Date</Label>
                <Input type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => update(exp.id, { endDate: e.target.value })} />
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={exp.current} onChange={(e) => update(exp.id, { current: e.target.checked })} />
                  Currently working here
                </label>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => update(exp.id, { description: e.target.value })}
                  rows={2}
                  placeholder="Brief role description..."
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Bullet Points (one per line)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 gap-1 px-2 text-[11px]"
                    disabled={improvingId === exp.id || (!exp.bullets.length && !exp.description)}
                    onClick={() => improveBullets(exp)}
                  >
                    {improvingId === exp.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    AI Improve
                  </Button>
                </div>
                <Textarea
                  value={exp.bullets.join("\n")}
                  onChange={(e) => updateBullets(exp.id, e.target.value)}
                  rows={3}
                  placeholder="Led team of 5 engineers...&#10;Reduced load time by 40%..."
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Experience
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { Education } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function newEntry(): Education {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  }
}

interface Props {
  value: Education[]
  onChange: (value: Education[]) => void
}

export function EducationForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(value[0]?.id ?? null)

  const update = (id: string, data: Partial<Education>) => {
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

  return (
    <div className="flex flex-col gap-3">
      {value.map((edu) => (
        <div key={edu.id} className="rounded-md border">
          <div
            role="button"
            tabIndex={0}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedId(expandedId === edu.id ? null : edu.id) } }}
          >
            <span className={cn("font-medium", !edu.institution && !edu.degree && "text-muted-foreground")}>
              {edu.degree || edu.institution || "New Education"}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(edu.id) }}>
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === edu.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          {expandedId === edu.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Degree</Label>
                <Input value={edu.degree} onChange={(e) => update(edu.id, { degree: e.target.value })} placeholder="Bachelor of Science" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Field of Study</Label>
                <Input value={edu.field} onChange={(e) => update(edu.id, { field: e.target.value })} placeholder="Computer Science" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Institution</Label>
                <Input value={edu.institution} onChange={(e) => update(edu.id, { institution: e.target.value })} placeholder="MIT" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Start Date</Label>
                <Input type="month" value={edu.startDate} onChange={(e) => update(edu.id, { startDate: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>End Date</Label>
                <Input type="month" value={edu.endDate} disabled={edu.current} onChange={(e) => update(edu.id, { endDate: e.target.value })} />
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={edu.current} onChange={(e) => update(edu.id, { current: e.target.checked })} />
                  Currently studying
                </label>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={edu.description} onChange={(e) => update(edu.id, { description: e.target.value })} rows={2} placeholder="Relevant coursework, achievements..." />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Education
      </Button>
    </div>
  )
}

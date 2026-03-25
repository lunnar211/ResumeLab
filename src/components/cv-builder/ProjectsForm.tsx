"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { Project } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function newEntry(): Project {
  return { id: crypto.randomUUID(), name: "", description: "", technologies: [], url: "", github: "", startDate: "", endDate: "" }
}

interface Props {
  value: Project[]
  onChange: (value: Project[]) => void
}

export function ProjectsForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const update = (id: string, data: Partial<Project>) => {
    onChange(value.map((e) => (e.id === id ? { ...e, ...data } : e)))
  }
  const add = () => {
    const entry = newEntry()
    onChange([...value, entry])
    setExpandedId(entry.id)
  }
  const remove = (id: string) => onChange(value.filter((e) => e.id !== id))

  return (
    <div className="flex flex-col gap-3">
      {value.map((proj) => (
        <div key={proj.id} className="rounded-md border">
          <button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
          >
            <span className={cn("font-medium", !proj.name && "text-muted-foreground")}>
              {proj.name || "New Project"}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(proj.id) }}>
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === proj.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>
          {expandedId === proj.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Project Name</Label>
                <Input value={proj.name} onChange={(e) => update(proj.id, { name: e.target.value })} placeholder="My Project" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={proj.description} onChange={(e) => update(proj.id, { description: e.target.value })} rows={2} placeholder="What does this project do?" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={proj.technologies.join(", ")}
                  onChange={(e) => update(proj.id, { technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Start Date</Label>
                <Input type="month" value={proj.startDate} onChange={(e) => update(proj.id, { startDate: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>End Date</Label>
                <Input type="month" value={proj.endDate} onChange={(e) => update(proj.id, { endDate: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>URL</Label>
                <Input value={proj.url ?? ""} onChange={(e) => update(proj.id, { url: e.target.value })} placeholder="https://myproject.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>GitHub</Label>
                <Input value={proj.github ?? ""} onChange={(e) => update(proj.id, { github: e.target.value })} placeholder="github.com/user/repo" />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Project
      </Button>
    </div>
  )
}

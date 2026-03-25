"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { Award } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function newEntry(): Award {
  return { id: crypto.randomUUID(), title: "", issuer: "", date: "", description: "" }
}

interface Props {
  value: Award[]
  onChange: (value: Award[]) => void
}

export function AwardsForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const update = (id: string, data: Partial<Award>) => {
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
      {value.map((award) => (
        <div key={award.id} className="rounded-md border">
          <button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === award.id ? null : award.id)}
          >
            <span className={cn("font-medium", !award.title && "text-muted-foreground")}>
              {award.title || "New Award"}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(award.id) }}>
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === award.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>
          {expandedId === award.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Title</Label>
                <Input value={award.title} onChange={(e) => update(award.id, { title: e.target.value })} placeholder="Best Innovation Award" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Issuer</Label>
                <Input value={award.issuer} onChange={(e) => update(award.id, { issuer: e.target.value })} placeholder="TechConf 2024" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Date</Label>
                <Input type="month" value={award.date} onChange={(e) => update(award.id, { date: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={award.description} onChange={(e) => update(award.id, { description: e.target.value })} rows={2} />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Award
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { Reference } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, handleToggleKeyDown } from "@/lib/utils"

function newEntry(): Reference {
  return { id: crypto.randomUUID(), name: "", title: "", company: "", email: "", phone: "", relationship: "" }
}

interface Props {
  value: Reference[]
  onChange: (value: Reference[]) => void
  show: boolean
  onToggle: () => void
}

export function ReferencesForm({ value, onChange, show, onToggle }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const update = (id: string, data: Partial<Reference>) => {
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
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={show} onChange={onToggle} />
        Show references on CV
      </label>

      {value.map((ref) => (
        <div key={ref.id} className="rounded-md border">
          <div
            role="button"
            tabIndex={0}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === ref.id ? null : ref.id)}
            onKeyDown={(e) => handleToggleKeyDown(e, () => setExpandedId(expandedId === ref.id ? null : ref.id))}
          >
            <span className={cn("font-medium", !ref.name && "text-muted-foreground")}>
              {ref.name || "New Reference"}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(ref.id) }}>
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === ref.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
          {expandedId === ref.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Name</Label>
                <Input value={ref.name} onChange={(e) => update(ref.id, { name: e.target.value })} placeholder="Jane Smith" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Job Title</Label>
                <Input value={ref.title} onChange={(e) => update(ref.id, { title: e.target.value })} placeholder="Engineering Manager" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Company</Label>
                <Input value={ref.company} onChange={(e) => update(ref.id, { company: e.target.value })} placeholder="Acme Corp" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Relationship</Label>
                <Input value={ref.relationship} onChange={(e) => update(ref.id, { relationship: e.target.value })} placeholder="Former Manager" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Email</Label>
                <Input type="email" value={ref.email} onChange={(e) => update(ref.id, { email: e.target.value })} placeholder="jane@example.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Phone</Label>
                <Input value={ref.phone} onChange={(e) => update(ref.id, { phone: e.target.value })} placeholder="+1 234 567 8900" />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Reference
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { VolunteerWork } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn, handleToggleKeyDown } from "@/lib/utils"

function newEntry(): VolunteerWork {
  return { id: crypto.randomUUID(), organization: "", role: "", startDate: "", endDate: "", description: "" }
}

interface Props {
  value: VolunteerWork[]
  onChange: (value: VolunteerWork[]) => void
}

export function VolunteerForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const update = (id: string, data: Partial<VolunteerWork>) => {
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
      {value.map((vol) => (
        <div key={vol.id} className="rounded-md border">
          <div
            role="button"
            tabIndex={0}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === vol.id ? null : vol.id)}
            onKeyDown={(e) => handleToggleKeyDown(e, () => setExpandedId(expandedId === vol.id ? null : vol.id))}
          >
            <span className={cn("font-medium", !vol.role && !vol.organization && "text-muted-foreground")}>
              {vol.role || vol.organization || "New Volunteer Work"}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(vol.id) }}>
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === vol.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
          {expandedId === vol.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Role</Label>
                <Input value={vol.role} onChange={(e) => update(vol.id, { role: e.target.value })} placeholder="Volunteer Coordinator" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Organization</Label>
                <Input value={vol.organization} onChange={(e) => update(vol.id, { organization: e.target.value })} placeholder="Red Cross" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Start Date</Label>
                <Input type="month" value={vol.startDate} onChange={(e) => update(vol.id, { startDate: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>End Date</Label>
                <Input type="month" value={vol.endDate} onChange={(e) => update(vol.id, { endDate: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={vol.description} onChange={(e) => update(vol.id, { description: e.target.value })} rows={2} />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Volunteer Work
      </Button>
    </div>
  )
}

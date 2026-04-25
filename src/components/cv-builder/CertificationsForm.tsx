"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { Certification } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function newEntry(): Certification {
  return { id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "" }
}

interface Props {
  value: Certification[]
  onChange: (value: Certification[]) => void
}

export function CertificationsForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const update = (id: string, data: Partial<Certification>) => {
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
      {value.map((cert) => (
        <div key={cert.id} className="rounded-md border">
          <div
            role="button"
            tabIndex={0}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedId(expandedId === cert.id ? null : cert.id) } }}
          >
            <span className={cn("font-medium", !cert.name && "text-muted-foreground")}>
              {cert.name || "New Certification"}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(cert.id) }}>
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === cert.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
          {expandedId === cert.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Name</Label>
                <Input value={cert.name} onChange={(e) => update(cert.id, { name: e.target.value })} placeholder="AWS Certified Developer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Issuer</Label>
                <Input value={cert.issuer} onChange={(e) => update(cert.id, { issuer: e.target.value })} placeholder="Amazon" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Date</Label>
                <Input type="month" value={cert.date} onChange={(e) => update(cert.id, { date: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>URL (optional)</Label>
                <Input value={cert.url ?? ""} onChange={(e) => update(cert.id, { url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Certification
      </Button>
    </div>
  )
}

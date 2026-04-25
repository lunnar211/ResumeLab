"use client"

import { useState } from "react"
import { Plus, Trash, ChevronDown, ChevronUp } from "lucide-react"
import type { Publication } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function newEntry(): Publication {
  return { id: crypto.randomUUID(), title: "", publisher: "", date: "", url: "", description: "" }
}

interface Props {
  value: Publication[]
  onChange: (value: Publication[]) => void
}

export function PublicationsForm({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const update = (id: string, data: Partial<Publication>) => {
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
      {value.map((pub) => (
        <div key={pub.id} className="rounded-md border">
          <div
            role="button"
            tabIndex={0}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm"
            onClick={() => setExpandedId(expandedId === pub.id ? null : pub.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedId(expandedId === pub.id ? null : pub.id) } }}
          >
            <span className={cn("font-medium", !pub.title && "text-muted-foreground")}>
              {pub.title || "New Publication"}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); remove(pub.id) }}>
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === pub.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
          {expandedId === pub.id && (
            <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Title</Label>
                <Input value={pub.title} onChange={(e) => update(pub.id, { title: e.target.value })} placeholder="My Research Paper" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Publisher</Label>
                <Input value={pub.publisher} onChange={(e) => update(pub.id, { publisher: e.target.value })} placeholder="IEEE" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Date</Label>
                <Input type="month" value={pub.date} onChange={(e) => update(pub.id, { date: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>URL</Label>
                <Input value={pub.url ?? ""} onChange={(e) => update(pub.id, { url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={pub.description} onChange={(e) => update(pub.id, { description: e.target.value })} rows={2} />
              </div>
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Publication
      </Button>
    </div>
  )
}

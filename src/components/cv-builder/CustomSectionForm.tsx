"use client"

import { Plus, Trash } from "lucide-react"
import type { CustomSection } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function newEntry(): CustomSection {
  return { id: crypto.randomUUID(), label: "", content: "" }
}

interface Props {
  value: CustomSection[]
  onChange: (value: CustomSection[]) => void
}

export function CustomSectionForm({ value, onChange }: Props) {
  const update = (id: string, data: Partial<CustomSection>) => {
    onChange(value.map((e) => (e.id === id ? { ...e, ...data } : e)))
  }
  const add = () => onChange([...value, newEntry()])
  const remove = (id: string) => onChange(value.filter((e) => e.id !== id))

  return (
    <div className="flex flex-col gap-4">
      {value.map((sec) => (
        <div key={sec.id} className="flex flex-col gap-2 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="sr-only">Section Label</Label>
              <Input
                value={sec.label}
                onChange={(e) => update(sec.id, { label: e.target.value })}
                placeholder="Section title (e.g. Hobbies)"
                className="mb-2"
              />
              <Textarea
                value={sec.content}
                onChange={(e) => update(sec.id, { content: e.target.value })}
                rows={3}
                placeholder="Section content..."
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-2 self-start"
              onClick={() => remove(sec.id)}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Custom Section
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, Trash } from "lucide-react"
import type { Language } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  value: Language[]
  onChange: (value: Language[]) => void
}

const levels: Language["level"][] = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"]

export function LanguagesForm({ value, onChange }: Props) {
  const [newName, setNewName] = useState("")
  const [newLevel, setNewLevel] = useState<Language["level"]>("B2")

  const add = () => {
    if (!newName.trim()) return
    onChange([...value, { id: crypto.randomUUID(), name: newName.trim(), level: newLevel }])
    setNewName("")
  }

  const remove = (id: string) => onChange(value.filter((l) => l.id !== id))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {value.map((l) => (
          <div key={l.id} className="flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs">
            <span>{l.name}</span>
            <span className="text-muted-foreground">· {l.level}</span>
            <button type="button" onClick={() => remove(l.id)} className="ml-1 hover:text-destructive">
              <Trash className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Language"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1"
        />
        <Select value={newLevel} onValueChange={(v) => setNewLevel(v as Language["level"])}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, Trash } from "lucide-react"
import type { Skill } from "@/types/cv"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  value: Skill[]
  onChange: (value: Skill[]) => void
}

export function SkillsForm({ value, onChange }: Props) {
  const [newName, setNewName] = useState("")
  const [newLevel, setNewLevel] = useState<Skill["level"]>("intermediate")

  const add = () => {
    if (!newName.trim()) return
    onChange([...value, { id: crypto.randomUUID(), name: newName.trim(), level: newLevel }])
    setNewName("")
  }

  const remove = (id: string) => onChange(value.filter((s) => s.id !== id))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {value.map((s) => (
          <div key={s.id} className="flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs">
            <span>{s.name}</span>
            {s.level && <span className="text-muted-foreground">· {s.level}</span>}
            <button type="button" onClick={() => remove(s.id)} className="ml-1 hover:text-destructive">
              <Trash className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Skill name"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1"
        />
        <Select value={newLevel} onValueChange={(v) => setNewLevel(v as Skill["level"])}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

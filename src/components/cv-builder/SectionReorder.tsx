"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  sections: string[]
  onChange: (sections: string[]) => void
  labels: Record<string, string>
}

export function SectionReorder({ sections, onChange, labels }: Props) {
  const move = (index: number, direction: -1 | 1) => {
    const newSections = [...sections]
    const target = index + direction
    if (target < 0 || target >= newSections.length) return
    ;[newSections[index], newSections[target]] = [newSections[target], newSections[index]]
    onChange(newSections)
  }

  return (
    <div className="flex flex-col gap-1">
      {sections.map((section, i) => (
        <div key={section} className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
          <span className="flex-1">{labels[section] ?? section}</span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => move(i, -1)}
              disabled={i === 0}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => move(i, 1)}
              disabled={i === sections.length - 1}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

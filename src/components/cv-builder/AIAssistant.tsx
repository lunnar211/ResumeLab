"use client"

import { useState } from "react"
import { Sparkles, Wand2, CheckCircle, FileText, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAI } from "@/hooks/use-ai"
import { cn } from "@/lib/utils"

interface Props {
  text: string
  feature?: string
  onResult: (result: string) => void
}

const aiFeatures = [
  { id: "enhance", label: "Enhance", icon: Wand2 },
  { id: "grammar", label: "Fix Grammar", icon: CheckCircle },
  { id: "ats", label: "ATS Check", icon: FileText },
  { id: "summary", label: "Write Summary", icon: Sparkles },
]

export function AIAssistant({ text, feature: defaultFeature = "enhance", onResult }: Props) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState("")
  const [selectedFeature, setSelectedFeature] = useState(defaultFeature)
  const { enhance, loading, error } = useAI()

  const run = async (feat: string) => {
    const res = await enhance(text, feat)
    setResult(res)
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="gap-1.5"
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-80 rounded-lg border bg-card p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-sm">AI Assistant</span>
            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {aiFeatures.map((f) => (
              <Button
                key={f.id}
                type="button"
                variant={selectedFeature === f.id ? "default" : "outline"}
                size="sm"
                className="gap-1 text-xs"
                onClick={() => { setSelectedFeature(f.id); run(f.id) }}
                disabled={loading}
              >
                {loading && selectedFeature === f.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <f.icon className="h-3 w-3" />
                )}
                {f.label}
              </Button>
            ))}
          </div>

          {error && <p className="mb-2 text-xs text-destructive">{error}</p>}

          {result && (
            <div className="flex flex-col gap-2">
              <Textarea value={result} onChange={(e) => setResult(e.target.value)} rows={5} className="text-xs" />
              <Button
                type="button"
                size="sm"
                onClick={() => { onResult(result); setOpen(false) }}
                className={cn("w-full")}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

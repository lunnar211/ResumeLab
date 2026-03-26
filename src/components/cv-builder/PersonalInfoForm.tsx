"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Sparkles, Loader2 } from "lucide-react"
import type { PersonalInfo } from "@/types/cv"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { VoiceAssistant } from "@/components/VoiceAssistant"
import { useToast } from "@/hooks/use-toast"

interface Props {
  value: PersonalInfo
  onChange: (value: PersonalInfo) => void
}

export function PersonalInfoForm({ value, onChange }: Props) {
  const { register, watch, setValue } = useForm<PersonalInfo>({ defaultValues: value })
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const sub = watch((data) => onChange(data as PersonalInfo))
    return () => sub.unsubscribe()
  }, [watch, onChange])

  const handleVoiceFill = (fields: Record<string, unknown>) => {
    const mapping: Record<string, keyof PersonalInfo> = {
      fullName: "fullName",
      email: "email",
      phone: "phone",
      location: "location",
      website: "website",
      linkedin: "linkedin",
      github: "github",
      jobTitle: "professionalTitle",
    }
    for (const [key, val] of Object.entries(fields)) {
      const formKey = mapping[key] ?? (key as keyof PersonalInfo)
      if (val !== null && val !== undefined && val !== "") {
        setValue(formKey, val as string, { shouldDirty: true })
      }
    }
  }

  const generateSummary = async () => {
    const current = watch()
    const fullName = current.fullName || "the candidate"
    const professionalTitle = current.professionalTitle || "professional"
    const prompt = `Write a professional summary for ${fullName}, a ${professionalTitle}. 2-3 sentences. Professional, concise, impactful.`
    setGeneratingSummary(true)
    try {
      const res = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.result) {
        setValue("summary", data.result as string, { shouldDirty: true })
        toast({ title: "Summary generated!", description: "AI has written your professional summary." })
      } else {
        toast({ title: "AI failed", description: "Could not generate summary. Please try again.", variant: "destructive" })
      }
    } catch {
      toast({ title: "AI failed", description: "Could not generate summary. Please try again.", variant: "destructive" })
    } finally {
      setGeneratingSummary(false)
    }
  }

  const fields: { name: keyof PersonalInfo; label: string; type?: string; placeholder?: string; textarea?: boolean }[] = [
    { name: "fullName", label: "Full Name", placeholder: "John Doe" },
    { name: "professionalTitle", label: "Professional Title", placeholder: "Software Engineer" },
    { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
    { name: "phone", label: "Phone", placeholder: "+1 234 567 8900" },
    { name: "location", label: "Location", placeholder: "New York, NY" },
    { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/johndoe" },
    { name: "github", label: "GitHub", placeholder: "github.com/johndoe" },
    { name: "website", label: "Website", placeholder: "johndoe.com" },
    { name: "photoUrl", label: "Photo URL", placeholder: "https://..." },
  ]

  return (
    <div className="flex flex-col gap-4">
      <VoiceAssistant section="personalInfo" onFieldsFilled={handleVoiceFill} />
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-1.5">
            <Label htmlFor={f.name}>{f.label}</Label>
            <Input
              id={f.name}
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              {...register(f.name)}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 gap-1 px-2 text-[11px]"
            disabled={generatingSummary}
            onClick={generateSummary}
          >
            {generatingSummary ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            AI Generate
          </Button>
        </div>
        <Textarea
          id="summary"
          rows={4}
          placeholder="Write a brief professional summary..."
          {...register("summary")}
        />
      </div>
    </div>
  )
}

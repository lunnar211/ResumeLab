"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { PersonalInfo } from "@/types/cv"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  value: PersonalInfo
  onChange: (value: PersonalInfo) => void
}

export function PersonalInfoForm({ value, onChange }: Props) {
  const { register, watch } = useForm<PersonalInfo>({ defaultValues: value })

  useEffect(() => {
    const sub = watch((data) => onChange(data as PersonalInfo))
    return () => sub.unsubscribe()
  }, [watch, onChange])

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
        <Label htmlFor="summary">Professional Summary</Label>
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

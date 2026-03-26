"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash, Copy, FileText, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { defaultCVContent } from "@/types/cv"
import type { CVFormat } from "@/types/cv"
import { templates } from "@/lib/templates"
import { generateSlug, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CV {
  id: string
  title: string
  format: CVFormat
  template_id: string
  updated_at: string
}

interface Props {
  cvs: CV[]
  usageCount: number
  plan: string
  userId: string
}

const formatOptions: { value: CVFormat; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "academic", label: "Academic" },
  { value: "technical", label: "Technical" },
  { value: "executive", label: "Executive" },
  { value: "creative", label: "Creative" },
  { value: "ats", label: "ATS Optimized" },
]

export function DashboardClient({ cvs: initialCVs, usageCount, plan, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [cvs, setCVs] = useState<CV[]>(initialCVs)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("My CV")
  const [newFormat, setNewFormat] = useState<CVFormat>("standard")
  const [newTemplate, setNewTemplate] = useState(templates[0].id)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const createCV = async () => {
    setCreating(true)
    const { data, error } = await supabase
      .from("cvs")
      .insert({
        user_id: userId,
        title: newTitle,
        format: newFormat,
        template_id: newTemplate,
        content: defaultCVContent,
        is_public: false,
        public_slug: generateSlug(newTitle),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    setCreating(false)
    if (!error && data) {
      setDialogOpen(false)
      router.push(`/builder/${data.id}`)
    }
  }

  const deleteCV = async (id: string) => {
    setDeleteId(id)
    await supabase.from("cvs").delete().eq("id", id)
    setCVs((prev) => prev.filter((cv) => cv.id !== id))
    setDeleteId(null)
  }

  const duplicateCV = async (cv: CV) => {
    const { data } = await supabase
      .from("cvs")
      .select("content")
      .eq("id", cv.id)
      .single()

    await supabase.from("cvs").insert({
      user_id: userId,
      title: `${cv.title} (Copy)`,
      format: cv.format,
      template_id: cv.template_id,
      content: data?.content ?? defaultCVContent,
      is_public: false,
      public_slug: generateSlug(`${cv.title} copy`),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    router.refresh()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total CVs</p>
            <p className="text-3xl font-bold">{cvs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">AI Credits Used</p>
            <p className="text-3xl font-bold">{usageCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <Badge variant={plan === "pro" ? "default" : "secondary"} className="mt-1 text-base">
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My CVs</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New CV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New CV</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label>Title</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="My CV"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Format</Label>
                <Select value={newFormat} onValueChange={(v) => setNewFormat(v as CVFormat)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Template selector */}
              <div className="flex flex-col gap-1.5">
                <Label>Template</Label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewTemplate(t.id)}
                      className={cn(
                        "flex shrink-0 flex-col items-center gap-1 rounded-lg border-2 p-2 text-xs transition-all",
                        newTemplate === t.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex h-12 w-9 items-center justify-center rounded-sm bg-muted text-muted-foreground">
                        <span className="text-[8px] font-bold leading-tight text-center">{t.name.slice(0, 4).toUpperCase()}</span>
                      </div>
                      <span className="max-w-[64px] truncate text-center font-medium">{t.name}</span>
                      {t.isPremium && (
                        <span className="rounded bg-amber-100 px-1 py-0 text-[9px] font-semibold text-amber-700">Pro</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={createCV} disabled={creating || !newTitle.trim()}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create CV
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CV Grid */}
      {cvs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-20 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No CVs yet</p>
            <p className="text-sm text-muted-foreground">Create your first CV to get started</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create CV
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => (
            <Card key={cv.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-base">{cv.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0 text-xs capitalize">
                    {cv.format}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Edited {formatDistanceToNow(new Date(cv.updated_at), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex h-28 items-center justify-center rounded-md bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground/40" />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push(`/builder/${cv.id}`)}
                >
                  <Edit className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => duplicateCV(cv)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => deleteCV(cv.id)}
                  disabled={deleteId === cv.id}
                >
                  {deleteId === cv.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash className="h-3.5 w-3.5" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

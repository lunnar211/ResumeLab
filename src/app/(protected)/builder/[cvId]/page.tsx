import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CVBuilderClient } from "./cv-builder-client"
import type { CVContent } from "@/types/cv"
import { defaultCVContent } from "@/types/cv"

interface Props {
  params: Promise<{ cvId: string }>
}

export default async function BuilderPage({ params }: Props) {
  const { cvId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: cv } = await supabase
    .from("cvs")
    .select("*")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single()

  if (!cv) notFound()

  return (
    <CVBuilderClient
      cvId={cv.id}
      initialTitle={cv.title}
      initialContent={(cv.content as CVContent) ?? defaultCVContent}
      initialTemplateId={cv.template_id}
      isPublic={cv.is_public}
      publicSlug={cv.public_slug}
    />
  )
}

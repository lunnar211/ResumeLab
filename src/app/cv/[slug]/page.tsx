import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { CVContent } from "@/types/cv"
import { ClassicProfessional } from "@/components/cv-templates/ClassicProfessional"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PublicCVPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: cv } = await supabase
    .from("cvs")
    .select("*")
    .eq("public_slug", slug)
    .eq("is_public", true)
    .single()

  if (!cv) notFound()

  const content = cv.content as CVContent

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm">
            <FileText className="h-4 w-4" />
            ResumeLabAI
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Create your own CV →</Link>
          </Button>
        </div>

        <div id="cv-preview" className="mx-auto max-w-[794px] shadow-lg">
          <ClassicProfessional content={content} />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <Link href="/" className="font-medium hover:underline">
              ResumeLabAI
            </Link>
          </p>
          <Button asChild className="mt-4">
            <Link href="/signup">Create Your Perfect CV →</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ message: "Use client-side PDF export with html2canvas + jsPDF" })
}

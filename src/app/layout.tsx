import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ResumeLabAI - AI-Powered CV Builder",
  description: "Build professional CVs with AI assistance. ATS optimization, voice assistant, 10+ templates.",
  keywords: ["resume builder", "CV builder", "AI resume", "ATS optimized"],
  openGraph: {
    title: "ResumeLabAI - AI-Powered CV Builder",
    description: "Build professional CVs with AI assistance",
    url: "https://www.resumelabai.free.nf",
    siteName: "ResumeLabAI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <FileText className="h-6 w-6 text-primary" />
          <span>ResumeLabAI</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/templates" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Templates
          </Link>
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
              <Link
                href="/templates"
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                Templates
              </Link>
              <a
                href="#features"
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </a>
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
              <a
                href="#features"
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </a>
              <a
                href="#templates"
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                Templates
              </a>
              <a
                href="#pricing"
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </a>
              <div className="mt-2 flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

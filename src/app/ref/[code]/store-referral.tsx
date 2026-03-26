"use client"

import { useEffect } from "react"

export function StoreReferral({ code }: { code: string }) {
  useEffect(() => {
    try {
      localStorage.setItem("referral_code", code)
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, [code])

  return null
}

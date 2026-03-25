import { useState } from "react"

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enhance = async (text: string, feature: string): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          feature,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "AI request failed")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let result = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim()
            if (data === "[DONE]") continue
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) result += content
            } catch (parseErr) {
              if (process.env.NODE_ENV === "development") {
                console.debug("Skipping malformed SSE line:", data, parseErr)
              }
            }
          }
        }
      }

      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setError(msg)
      return ""
    } finally {
      setLoading(false)
    }
  }

  return { enhance, loading, error }
}

"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, MicOff, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceAssistantProps {
  section: string
  onFieldsFilled: (fields: Record<string, unknown>) => void
  className?: string
}

type State = "idle" | "listening" | "processing" | "confirming" | "error"

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export function VoiceAssistant({ section, onFieldsFilled, className }: VoiceAssistantProps) {
  const [state, setState] = useState<State>("idle")
  const [transcript, setTranscript] = useState("")
  const [pendingFields, setPendingFields] = useState<Record<string, unknown> | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const isSupported =
    typeof window !== "undefined" &&
    (typeof window.SpeechRecognition !== "undefined" || typeof window.webkitSpeechRecognition !== "undefined")

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopListening()
  }, [stopListening])

  const startListening = () => {
    if (!isSupported) {
      setErrorMsg("Speech recognition is not supported in this browser. Try Chrome or Edge.")
      setState("error")
      return
    }

    const SpeechRecognitionImpl =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionImpl()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onstart = () => setState("listening")

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      setState("processing")
      parseTranscript(text)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setErrorMsg(event.error === "not-allowed" ? "Microphone access denied." : `Error: ${event.error}`)
      setState("error")
    }

    recognition.onend = () => {
      if (state === "listening") setState("idle")
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const parseTranscript = async (text: string) => {
    try {
      const res = await fetch("/api/ai/voice-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, section }),
      })
      const data = await res.json()
      if (data.fields && Object.keys(data.fields).length > 0) {
        setPendingFields(data.fields)
        setState("confirming")
      } else {
        setErrorMsg("Could not extract any information. Please try again.")
        setState("error")
      }
    } catch {
      setErrorMsg("Failed to process speech. Please try again.")
      setState("error")
    }
  }

  const confirmFill = () => {
    if (pendingFields) {
      onFieldsFilled(pendingFields)
    }
    reset()
  }

  const reset = () => {
    setState("idle")
    setTranscript("")
    setPendingFields(null)
    setErrorMsg("")
  }

  if (!isSupported && state === "idle") {
    return null
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {state === "idle" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startListening}
          className="gap-2 text-xs h-8"
          title="Fill with voice input"
        >
          <Mic className="h-3.5 w-3.5 text-primary" />
          Voice Input
        </Button>
      )}

      {state === "listening" && (
        <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </div>
          <span className="text-xs text-muted-foreground flex-1">Listening…</span>
          <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => { stopListening(); reset() }}>
            <MicOff className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {state === "processing" && (
        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
          <span className="text-xs text-muted-foreground truncate">Processing: &ldquo;{transcript}&rdquo;</span>
        </div>
      )}

      {state === "confirming" && pendingFields && (
        <div className="rounded-md border bg-card p-3 text-xs flex flex-col gap-2">
          <p className="font-medium">I heard: <span className="italic text-muted-foreground">&ldquo;{transcript}&rdquo;</span></p>
          <div className="flex flex-col gap-1 text-muted-foreground">
            {Object.entries(pendingFields).map(([key, val]) => (
              <div key={key} className="flex gap-1">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                <span className="truncate">{Array.isArray(val) ? val.join(", ") : String(val)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-1">
            <Button type="button" size="sm" className="h-7 text-xs gap-1 flex-1" onClick={confirmFill}>
              <Check className="h-3 w-3" /> Fill in
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1 flex-1" onClick={reset}>
              <X className="h-3 w-3" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
          <span className="text-xs text-destructive flex-1">{errorMsg}</span>
          <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={reset}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}

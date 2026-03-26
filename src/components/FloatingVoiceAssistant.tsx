"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, MicOff, X, ChevronRight, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Web Speech API type declarations
interface SpeechRecognitionResult {
  transcript: string
}
interface SpeechRecognitionResultItem {
  [index: number]: SpeechRecognitionResult
  isFinal: boolean
}
interface SpeechRecognitionEvent extends Event {
  results: { [index: number]: SpeechRecognitionResultItem; length: number }
  resultIndex: number
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string
}
interface SpeechRecognitionInstance {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start: () => void
  stop: () => void
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionCtor
    webkitSpeechRecognition: SpeechRecognitionCtor
  }
}

const SECTIONS = [
  { id: "personalInfo", label: "Personal" },
  { id: "workExperience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "summary", label: "Summary" },
]

type Status = "ready" | "listening" | "processing" | "done" | "error"

interface HistoryItem {
  transcript: string
  section: string
  timestamp: Date
}

export function FloatingVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<Status>("ready")
  const [activeSection, setActiveSection] = useState("personalInfo")
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [parsedFields, setParsedFields] = useState<Record<string, unknown> | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finalTranscriptRef = useRef("")
  const statusRef = useRef<Status>("ready")
  const { toast } = useToast()

  const isSupported =
    typeof window !== "undefined" &&
    (typeof window.SpeechRecognition !== "undefined" || typeof window.webkitSpeechRecognition !== "undefined")

  const setStatusSync = (s: Status) => {
    statusRef.current = s
    setStatus(s)
  }

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopListening()
  }, [stopListening])

  const processTranscript = async (text: string) => {
    if (!text.trim()) return
    setStatusSync("processing")
    try {
      const res = await fetch("/api/ai/voice-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, section: activeSection }),
      })
      const data = await res.json()
      if (data.fields && Object.keys(data.fields).length > 0) {
        setParsedFields(data.fields)
        setStatusSync("done")
        setHistory((prev) =>
          [{ transcript: text, section: activeSection, timestamp: new Date() }, ...prev].slice(0, 3)
        )
      } else {
        setStatusSync("error")
        toast({
          title: "No data extracted",
          description: "Could not extract information. Please try again.",
          variant: "destructive",
        })
      }
    } catch {
      setStatusSync("error")
      toast({
        title: "Processing failed",
        description: "Failed to process speech. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startListening = () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser. Try Chrome or Edge.",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionImpl()
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.continuous = false

    finalTranscriptRef.current = ""
    setTranscript("")
    setInterimTranscript("")
    setParsedFields(null)
    setStatusSync("listening")

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""
      let final = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += result
        } else {
          interim += result
        }
      }
      if (final) {
        finalTranscriptRef.current += final
        setTranscript(finalTranscriptRef.current)
      }
      setInterimTranscript(interim)

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        stopListening()
      }, 2000)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setStatusSync("error")
      toast({
        title: "Microphone error",
        description:
          event.error === "not-allowed"
            ? "Microphone access denied."
            : `Error: ${event.error}`,
        variant: "destructive",
      })
    }

    recognition.onend = () => {
      setInterimTranscript("")
      const finalText = finalTranscriptRef.current
      if (finalText.trim()) {
        processTranscript(finalText)
      } else if (statusRef.current === "listening") {
        setStatusSync("ready")
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleMicClick = () => {
    if (status === "listening") {
      stopListening()
      setStatusSync("ready")
    } else {
      startListening()
    }
  }

  const reset = () => {
    setStatusSync("ready")
    setTranscript("")
    setInterimTranscript("")
    setParsedFields(null)
    finalTranscriptRef.current = ""
  }

  const statusLabels: Record<Status, string> = {
    ready: "Ready",
    listening: "Listening...",
    processing: "Processing...",
    done: "Done!",
    error: "Error",
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
      {/* Tab trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-20 w-8 items-center justify-center rounded-l-md bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          title="Open Voice Assistant"
        >
          <span className="-rotate-90 whitespace-nowrap text-[10px] font-bold tracking-widest uppercase">
            Voice
          </span>
        </button>
      )}

      {/* Slide-in panel */}
      <div
        className={cn(
          "flex h-screen w-80 flex-col bg-background border-l shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-primary" />
            <span className="font-semibold">Voice Assistant</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Status bar */}
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm border-b",
            status === "listening" && "bg-red-500/10 text-red-600",
            status === "processing" && "bg-blue-500/10 text-blue-600",
            status === "done" && "bg-green-500/10 text-green-600",
            status === "error" && "bg-destructive/10 text-destructive",
            status === "ready" && "bg-muted/50 text-muted-foreground"
          )}
        >
          {status === "listening" && (
            <div className="flex gap-[3px] items-end h-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-current rounded-full animate-bounce"
                  style={{ height: `${[60, 100, 80, 100, 60][i]}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
          {status === "processing" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {status === "done" && <Check className="h-3.5 w-3.5" />}
          <span>{statusLabels[status]}</span>
        </div>

        {/* Section tabs */}
        <div className="flex overflow-x-auto border-b px-2 py-1 gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "shrink-0 rounded px-2 py-1 text-xs font-medium transition-colors",
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Transcript box */}
        <div className="mx-4 my-3 min-h-[80px] rounded-md border bg-muted/30 p-3 text-sm">
          {transcript || interimTranscript ? (
            <>
              <span>{transcript}</span>
              <span className="text-muted-foreground">{interimTranscript}</span>
            </>
          ) : (
            <span className="text-muted-foreground italic">
              {status === "ready" ? "Click the mic button to start speaking..." : ""}
            </span>
          )}
        </div>

        {/* Parsed fields */}
        {parsedFields && Object.keys(parsedFields).length > 0 && (
          <div className="mx-4 mb-3 rounded-md border bg-card p-3 text-xs">
            <p className="mb-1.5 font-medium text-sm">Extracted data:</p>
            <div className="flex flex-col gap-1 text-muted-foreground">
              {Object.entries(parsedFields).map(([key, val]) => (
                <div key={key} className="flex gap-1">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                  <span className="truncate">
                    {Array.isArray(val) ? (val as string[]).join(", ") : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* History */}
        {history.length > 0 && (
          <div className="mx-4 mb-3">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Recent inputs:</p>
            <div className="flex flex-col gap-1">
              {history.map((item, i) => (
                <div key={i} className="rounded border px-2 py-1 text-xs text-muted-foreground truncate">
                  <span className="capitalize font-medium">{item.section}: </span>
                  {item.transcript}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mic button */}
        <div className="flex flex-col items-center gap-3 border-t px-4 py-4">
          <button
            onClick={handleMicClick}
            disabled={status === "processing"}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all",
              status === "listening"
                ? "bg-red-500 text-white animate-pulse"
                : status === "processing"
                  ? "bg-muted cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {status === "processing" ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : status === "listening" ? (
              <MicOff className="h-7 w-7" />
            ) : (
              <Mic className="h-7 w-7" />
            )}
          </button>

          {status === "done" && parsedFields && (
            <Button size="sm" className="w-full gap-2" onClick={reset}>
              <ChevronRight className="h-3.5 w-3.5" />
              Voice data ready — open form to apply
            </Button>
          )}
          {(status === "error" || status === "done") && (
            <Button variant="outline" size="sm" className="w-full" onClick={reset}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { TinderaChatPanel } from "./tindera-chat-panel"

export function TinderaBubble() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Bubble */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl p-0 flex items-center justify-center z-40 transition-all duration-200 hover:scale-110 group"
        aria-label="Open Tindera chat"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-primary/75 opacity-75 animate-pulse" />
        </div>
      </Button>

      {/* Chat Panel */}
      <TinderaChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

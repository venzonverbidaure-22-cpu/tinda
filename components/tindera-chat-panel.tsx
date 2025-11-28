"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send } from "lucide-react"
import { useTinderaChat } from "@/hooks/useTinderaChat"

interface TinderaChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function TinderaChatPanel({ isOpen, onClose }: TinderaChatPanelProps) {
  const { messages, isLoading, addMessage, clearMessages } = useTinderaChat()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const message = inputRef.current?.value.trim()
    if (message && inputRef.current) { // Added check for inputRef.current
      addMessage(message)
      inputRef.current.value = ""
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-20 left-4 z-50 w-80 h-96 bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-600 to-green-500">
        <div className="flex items-center gap-2">
          <div className="text-xl">🌶️</div>
          <div>
            <h3 className="font-bold text-white text-sm">Tindera</h3>
            <p className="text-xs text-green-50">Your Palengke Helper</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-green-700 text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-3 flex flex-col">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`break-words px-3 py-2 rounded-lg text-sm max-w-[calc(100%-16px)] ${
                  message.role === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <Input ref={inputRef} placeholder="Ask Tindera..." className="text-sm" disabled={isLoading} />
        <Button type="submit" size="sm" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

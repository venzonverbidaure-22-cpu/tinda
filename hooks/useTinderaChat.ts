"use client"

import { useState, useCallback } from "react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function useTinderaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hi suki! 👋 Welcome sa Tinda! Ano ang gusto mo today? Fresh vegetables, best prices, or vendor recommendations? Nandito ako to help! 💚",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Placeholder AI function - replace with your actual backend
  const sendMessageToAI = useCallback(async (userMessage: string): Promise<string> => {
    // This is a placeholder function. You'll replace this with your actual AI backend call
    console.log("[Tindera] Sending message to AI:", userMessage)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return "This is a placeholder response."
  }, [])

  const addMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Get AI response
        const aiResponse = await sendMessageToAI(content)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error("[Tindera] Error sending message:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [sendMessageToAI],
  )

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "0",
        role: "assistant",
        content:
          "Hi suki! 👋 Welcome sa Tinda! Ano ang gusto mo today? Fresh vegetables, best prices, or vendor recommendations? Nandito ako to help! 💚",
        timestamp: new Date(),
      },
    ])
  }, [])

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
  }
}

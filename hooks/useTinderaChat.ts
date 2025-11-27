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

    // Mock responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes("gulay") || lowerMessage.includes("vegetable")) {
      return "Mayroong fresh vegetables ngayon! Check out Mang Jose sa San Juan - sariwa ang kanyang produce. May discount pa for regular customers! 🥬"
    } else if (lowerMessage.includes("presyo") || lowerMessage.includes("price")) {
      return "Best deals ngayong linggo: Kamote - ₱50/kg, Cabbage - ₱30/kg, Tomato - ₱60/kg. Mag-order na para makatipid! 💰"
    } else if (lowerMessage.includes("delivery") || lowerMessage.includes("tracking")) {
      return "Para sa delivery options, check your order details sa app. May same-day delivery kami sa selected areas! 🚚 Anong area ka ba?"
    } else if (lowerMessage.includes("loyalty") || lowerMessage.includes("points")) {
      return "Earn Suki points sa bawat order! Accumulate points para sa discounts at freebies. Mas maraming bili, mas maraming rewards! 🎁"
    } else if (lowerMessage.includes("vendor") || lowerMessage.includes("tindahan")) {
      return "Looking for vendors? Tell me what area you're in, I can recommend the best local vendors near you! 📍"
    } else {
      return "That's a great question! To help you better, pwede mo i-refine? Looking for fresh produce, vendors, prices, or something else? 🤔"
    }
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

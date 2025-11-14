"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import type { UserRole } from "@/lib/types"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("buyer")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setIsLoading(true)

  try {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    await login(email, password, role)

    const response = await axios.post("http://localhost:3001/api/auth/login",{
      email,
      password,
      role
    })

    const {token, user: userData} = response.data
    localStorage.setItem("token", token)
    localStorage.setItem("user_id", userData.id.toString())
    localStorage.setItem("user_role", userData.role)
    localStorage.setItem("user_email", userData.email)
    localStorage.setItem("user_full_name", userData.full_name)
    // ✅ Redirect by role
    if (role === "vendor") {
      router.push("/")
    } else {
      router.push("/")
    }
  } catch (err) {
    console.error("Login failed:", err)
    setError("Invalid email or password. Please try again.")
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-6 py-20">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your Tinda account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">I am a:</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buyer" id="buyer" />
                  <Label htmlFor="buyer" className="font-normal cursor-pointer">
                    Buyer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label htmlFor="vendor" className="font-normal cursor-pointer">
                    Vendor
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-md bg-muted p-4 text-sm">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p className="text-muted-foreground">Email: demo@tinda.com</p>
            <p className="text-muted-foreground">Password: demo123</p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

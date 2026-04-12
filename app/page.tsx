"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { Bot, Zap, Shield, Users, Phone, MessageCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { login, register, currentUser } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regReferral, setRegReferral] = useState("")

  if (currentUser) {
    router.push("/dashboard")
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = login(loginEmail, loginPassword)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = register(regName, regEmail, regPhone, regPassword, regReferral)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email already exists")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="gradient-bg text-white">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8" />
            <span className="text-xl font-bold">Malai XMD.Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:254105197055" className="flex items-center gap-2 text-sm hover:underline">
              <Phone className="h-4 w-4" />
              +254 105 197 055
            </a>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl text-balance">
            Deploy Your WhatsApp Bot in Minutes
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 text-pretty">
            Malai XMD.Pro is the most powerful WhatsApp bot deployment platform. 
            Get started with automated messaging, social media boosting, and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#auth" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-600 transition hover:bg-white/90">
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
            <a href="https://wa.me/254105197055" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
              <MessageCircle className="h-4 w-4" /> Contact Support
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Malai XMD.Pro?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Zap className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Deploy your bot in under 5 minutes with our streamlined pairing process</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>Your session data is encrypted and protected 24/7</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Social Boosting</CardTitle>
              <CardDescription>Grow your social media presence with our boosting services</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Bot className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>24/7 Uptime</CardTitle>
              <CardDescription>Your bot runs continuously without interruption</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth" className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to Malai XMD.Pro</CardTitle>
              <CardDescription>Login or create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="254712345678"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referral">Referral Code (Optional)</Label>
                      <Input
                        id="referral"
                        placeholder="Enter referral code"
                        value={regReferral}
                        onChange={(e) => setRegReferral(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold">Malai XMD.Pro</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
              <a href="tel:254105197055" className="hover:text-foreground">Helpline: +254 105 197 055</a>
              <a href="https://wa.me/254105197055" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">WhatsApp Support</a>
            </div>
            <p className="text-sm text-muted-foreground">
              Malai Global Tech - Powered by BWM-XMD
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

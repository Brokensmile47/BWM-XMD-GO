"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { generatePairingCode, generateSessionId } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Smartphone,
  QrCode,
  Hash,
  Check,
  Copy,
  RefreshCw,
  ArrowRight,
  Clock,
  MessageCircle,
} from "lucide-react"
import QRCodeComponent from "@/components/qr-code"

export default function DeployBotPage() {
  const router = useRouter()
  const { currentUser, createBot } = useStore()
  const [step, setStep] = useState(1)
  const [botName, setBotName] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("basic")
  const [pairingMethod, setPairingMethod] = useState<"code" | "qr">("code")
  const [pairingCode, setPairingCode] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [isPairing, setIsPairing] = useState(false)
  const [pairingComplete, setPairingComplete] = useState(false)
  const [copied, setCopied] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  const plans = [
    { id: "basic", name: "Basic", price: 500, features: ["30 days", "Standard support", "Basic commands"] },
    { id: "premium", name: "Premium", price: 1000, features: ["30 days", "Priority support", "All commands", "Custom prefix"] },
    { id: "unlimited", name: "Unlimited", price: 2500, features: ["30 days", "24/7 support", "All features", "Unlimited usage", "Custom branding"] },
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPairing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Reset pairing if time runs out
      setIsPairing(false)
      setPairingCode("")
      setTimeLeft(180)
    }
    return () => clearInterval(timer)
  }, [isPairing, timeLeft])

  const handleGeneratePairingCode = () => {
    const code = generatePairingCode()
    const session = generateSessionId()
    setPairingCode(code)
    setSessionId(session)
    setIsPairing(true)
    setTimeLeft(180)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCompletePairing = () => {
    if (!phoneNumber) return
    
    const bot = createBot(botName, selectedPlan)
    if (bot) {
      setPairingComplete(true)
      // Simulate sending session ID to WhatsApp
      setTimeout(() => {
        router.push("/dashboard/bots")
      }, 3000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentUser) return null

  const selectedPlanDetails = plans.find((p) => p.id === selectedPlan)
  const canAfford = currentUser.isAdmin || currentUser.balance >= (selectedPlanDetails?.price || 0)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Deploy New Bot</h1>
        <p className="text-muted-foreground">
          Create and deploy your WhatsApp bot in minutes
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`mx-2 h-1 flex-1 rounded ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>Bot Details</span>
          <span>Select Plan</span>
          <span>Pair Device</span>
        </div>
      </div>

      {/* Step 1: Bot Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Bot Details</CardTitle>
            <CardDescription>Enter your bot configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                placeholder="My Awesome Bot"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
              />
            </div>
            <Button onClick={() => setStep(2)} disabled={!botName} className="w-full">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Plan */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "border-primary ring-2 ring-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {selectedPlan === plan.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="text-2xl font-bold">
                    KES {plan.price.toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div>
              <p className="font-medium">Your Balance: KES {currentUser.balance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Selected plan: {selectedPlanDetails?.name} - KES {selectedPlanDetails?.price.toLocaleString()}
              </p>
            </div>
            {!canAfford && (
              <Badge variant="destructive">Insufficient Balance</Badge>
            )}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canAfford} className="flex-1">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Pairing */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Pair Your WhatsApp</CardTitle>
            <CardDescription>
              Choose your preferred pairing method. You have 3 minutes to complete pairing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!pairingComplete ? (
              <Tabs value={pairingMethod} onValueChange={(v) => setPairingMethod(v as "code" | "qr")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="code" className="gap-2">
                    <Hash className="h-4 w-4" /> Pairing Code
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="gap-2">
                    <QrCode className="h-4 w-4" /> QR Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="space-y-4">
                  {!isPairing ? (
                    <div className="py-8 text-center">
                      <Smartphone className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">Ready to Pair</h3>
                      <p className="mb-4 text-muted-foreground">
                        Generate an 8-digit pairing code to link your WhatsApp
                      </p>
                      <Button onClick={handleGeneratePairingCode}>
                        Generate Pairing Code
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Time remaining: {formatTime(timeLeft)}
                        </div>
                        <Progress value={(timeLeft / 180) * 100} className="mb-4" />
                      </div>

                      <div className="rounded-lg bg-muted p-6 text-center">
                        <p className="mb-2 text-sm text-muted-foreground">Your Pairing Code</p>
                        <div className="mb-4 flex items-center justify-center gap-2">
                          <span className="font-mono text-4xl font-bold tracking-widest">
                            {pairingCode}
                          </span>
                          <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGeneratePairingCode}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" /> Regenerate
                        </Button>
                      </div>

                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h4 className="mb-2 font-semibold">How to pair:</h4>
                        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                          <li>Open WhatsApp on your phone</li>
                          <li>Go to Settings &gt; Linked Devices</li>
                          <li>Tap &quot;Link a Device&quot;</li>
                          <li>Select &quot;Link with phone number instead&quot;</li>
                          <li>Enter the 8-digit code above</li>
                        </ol>
                      </div>

                      <div className="space-y-2">
                        <Label>Enter your WhatsApp number</Label>
                        <Input
                          type="tel"
                          placeholder="254712345678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Session ID will be sent to this number
                        </p>
                      </div>

                      <Button onClick={handleCompletePairing} className="w-full" disabled={!phoneNumber}>
                        Complete Pairing
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="qr" className="space-y-4">
                  {!isPairing ? (
                    <div className="py-8 text-center">
                      <QrCode className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">QR Code Pairing</h3>
                      <p className="mb-4 text-muted-foreground">
                        Scan a QR code to link your WhatsApp
                      </p>
                      <Button onClick={handleGeneratePairingCode}>
                        Generate QR Code
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Time remaining: {formatTime(timeLeft)}
                        </div>
                        <Progress value={(timeLeft / 180) * 100} className="mb-4" />
                      </div>

                      <div className="flex justify-center">
                        <QRCodeComponent value={`malai-xmd://${sessionId}?code=${pairingCode}`} />
                      </div>

                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h4 className="mb-2 font-semibold">How to scan:</h4>
                        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                          <li>Open WhatsApp on your phone</li>
                          <li>Go to Settings &gt; Linked Devices</li>
                          <li>Tap &quot;Link a Device&quot;</li>
                          <li>Point your camera at the QR code</li>
                        </ol>
                      </div>

                      <div className="space-y-2">
                        <Label>Enter your WhatsApp number</Label>
                        <Input
                          type="tel"
                          placeholder="254712345678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Session ID will be sent to this number
                        </p>
                      </div>

                      <Button onClick={handleCompletePairing} className="w-full" disabled={!phoneNumber}>
                        Complete Pairing
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Bot Deployed Successfully!</h3>
                <p className="mb-4 text-muted-foreground">
                  Your session ID has been sent to +{phoneNumber}
                </p>
                <div className="mx-auto max-w-md rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm text-muted-foreground">Session ID:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-xs font-mono break-all">{sessionId}</code>
                    <Button variant="ghost" size="icon" onClick={handleCopySessionId}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Redirecting to your bots...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

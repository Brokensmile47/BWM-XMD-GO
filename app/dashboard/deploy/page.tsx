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
import Link from "next/link"
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
  ExternalLink,
  Terminal,
  Server,
  Settings,
  Phone,
} from "lucide-react"
import QRCodeComponent from "@/components/qr-code"

const DEFAULT_CONFIG = `# ===== MALAI XMD BOT CONFIGURATION =====
# Edit these settings to customize your bot

# ===== OWNER SETTINGS =====
OWNER_NAME=YourName
OWNER_NUMBER=254XXXXXXXXX
BOT_NAME=Malai-XMD

# ===== PREFIX SETTINGS =====
PREFIX=.
MULTI_PREFIX=true

# ===== AUTO FEATURES (true/false) =====
AUTO_READ_STATUS=true
AUTO_TYPING=true
AUTO_RECORDING=false
AUTO_BIO=false
AUTO_REACT=true

# ===== COMMAND TOGGLES (true/false) =====
ENABLE_STICKER=true
ENABLE_DOWNLOAD=true
ENABLE_AI=true
ENABLE_GAMES=true
ENABLE_NSFW=false
ENABLE_ECONOMY=true
ENABLE_MODERATION=true
ENABLE_FUN=true
ENABLE_TOOLS=true
ENABLE_GROUP=true

# ===== AI SETTINGS =====
AI_MODEL=gpt-4
AI_PERSONALITY=helpful

# ===== GROUP SETTINGS =====
ANTI_LINK=true
ANTI_SPAM=true
ANTI_DELETE=false
WELCOME_MESSAGE=true
GOODBYE_MESSAGE=true

# ===== DOWNLOAD SETTINGS =====
MAX_DOWNLOAD_SIZE=100
DOWNLOAD_QUALITY=high

# ===== SECURITY =====
ONLY_OWNER_COMMANDS=false
BLOCK_UNKNOWN=false`

export default function DeployBotPage() {
  const router = useRouter()
  const { currentUser, createBot } = useStore()
  const [step, setStep] = useState(1)
  const [botName, setBotName] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("basic")
  const [pairingMethod, setPairingMethod] = useState<"code" | "qr">("code")
  const [pairingCode, setPairingCode] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [timeLeft, setTimeLeft] = useState(180)
  const [isPairing, setIsPairing] = useState(false)
  const [pairingComplete, setPairingComplete] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPhoneSet, setIsPhoneSet] = useState(false)
  const [manualSessionId, setManualSessionId] = useState("")
  const [configEnv, setConfigEnv] = useState(DEFAULT_CONFIG)
  const [showConfig, setShowConfig] = useState(false)

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
      setIsPairing(false)
      setPairingCode("")
      setTimeLeft(180)
    }
    return () => clearInterval(timer)
  }, [isPairing, timeLeft])

  const handleSetPhoneNumber = () => {
    if (phoneNumber.length >= 10) {
      setIsPhoneSet(true)
    }
  }

  const handleGeneratePairingCode = () => {
    const code = generatePairingCode()
    const session = generateSessionId()
    setPairingCode(code)
    setSessionId(session)
    setIsPairing(true)
    setTimeLeft(180)
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCompletePairing = () => {
    if (!phoneNumber) return
    
    const bot = createBot(botName, selectedPlan)
    if (bot) {
      setPairingComplete(true)
      setTimeout(() => {
        router.push("/dashboard/bots")
      }, 5000)
    }
  }

  const handleDeployWithSessionId = () => {
    if (manualSessionId.length > 10) {
      setSessionId(manualSessionId)
      const bot = createBot(botName || "My Bot", selectedPlan)
      if (bot) {
        setPairingComplete(true)
        setTimeout(() => {
          router.push("/dashboard/bots")
        }, 5000)
      }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Deploy New Bot</h1>
            <p className="text-muted-foreground">
              Create and deploy your WhatsApp bot on Ubuntu Server
            </p>
          </div>
          <Link href="/pairing" target="_blank">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Malai-Pairing-Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
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
              {s < 4 && (
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
          <span>Configure</span>
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Pair Your WhatsApp
              </CardTitle>
              <CardDescription>
                Choose your preferred pairing method. You have 3 minutes to complete pairing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!pairingComplete ? (
                <>
                  {/* Phone Number Input */}
                  {!isPhoneSet ? (
                    <div className="space-y-6">
                      <div className="rounded-lg border border-border bg-muted/50 p-6">
                        <h3 className="mb-4 flex items-center gap-2 font-semibold">
                          <Phone className="h-5 w-5 text-primary" />
                          Enter Your WhatsApp Number
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp Phone Number</Label>
                            <div className="flex gap-2">
                              <div className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                +
                              </div>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="254712345678"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                className="rounded-l-none"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Enter with country code (e.g., 254 for Kenya). Session ID will be sent here.
                            </p>
                          </div>
                          <Button
                            onClick={handleSetPhoneNumber}
                            disabled={phoneNumber.length < 10}
                            className="w-full"
                          >
                            Set Number & Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Phone Confirmed */}
                      <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                        <div className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Phone Number Set</p>
                            <p className="font-mono text-sm text-muted-foreground">+{phoneNumber}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsPhoneSet(false)}>
                          Change
                        </Button>
                      </div>

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
                              <Hash className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                              <h3 className="mb-2 text-lg font-semibold">Ready to Pair</h3>
                              <p className="mb-4 text-muted-foreground">
                                Generate an 8-digit alphanumeric pairing code
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
                                  Time remaining: <span className="font-mono font-bold text-primary">{formatTime(timeLeft)}</span>
                                </div>
                                <Progress value={(timeLeft / 180) * 100} className="mb-4" />
                              </div>

                              <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-6 text-center">
                                <p className="mb-2 text-sm text-muted-foreground">Your 8-Digit Pairing Code</p>
                                <div className="mb-4 flex items-center justify-center gap-2">
                                  <span className="font-mono text-4xl font-bold tracking-[0.2em]">
                                    {pairingCode}
                                  </span>
                                  <Button variant="ghost" size="icon" onClick={() => handleCopy(pairingCode, "code")}>
                                    {copied === "code" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
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

                              <Button onClick={handleCompletePairing} className="w-full">
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
                                  Time remaining: <span className="font-mono font-bold text-primary">{formatTime(timeLeft)}</span>
                                </div>
                                <Progress value={(timeLeft / 180) * 100} className="mb-4" />
                              </div>

                              <div className="flex justify-center">
                                <div className="rounded-xl bg-white p-4">
                                  <QRCodeComponent value={`malai-xmd://${sessionId}?code=${pairingCode}&phone=${phoneNumber}`} />
                                </div>
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

                              <Button onClick={handleCompletePairing} className="w-full">
                                Complete Pairing
                              </Button>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Bot Deployed Successfully!</h3>
                  <p className="mb-4 text-muted-foreground">
                    Your session ID has been sent to +{phoneNumber} via &quot;Message Yourself&quot;
                  </p>
                  <div className="mx-auto max-w-md rounded-lg bg-muted p-4">
                    <p className="mb-2 text-sm text-muted-foreground">Session ID:</p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="break-all font-mono text-xs">{sessionId}</code>
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(sessionId, "session")}>
                        {copied === "session" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Redirecting to your bots...
                  </p>
                  <Button onClick={() => setStep(4)} className="mt-4">
                    Configure Bot Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deploy with Existing Session ID */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Deploy with Existing Session ID
              </CardTitle>
              <CardDescription>
                Already have a session ID? Enter it here to deploy your bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manualSession">Session ID</Label>
                <Input
                  id="manualSession"
                  placeholder="malai_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={manualSessionId}
                  onChange={(e) => setManualSessionId(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button
                onClick={handleDeployWithSessionId}
                disabled={manualSessionId.length < 10}
                className="w-full"
              >
                Deploy Bot with Session ID
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Configuration */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Bot Configuration (config.env)
                </CardTitle>
                <CardDescription>
                  Customize which commands and features are enabled/disabled
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(configEnv, "config")}
                className="gap-2"
              >
                {copied === "config" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy Config
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-border">
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
                  <span className="font-mono text-sm">config.env</span>
                  <Badge variant="outline" className="gap-1">
                    <Server className="h-3 w-3" />
                    Ubuntu Server
                  </Badge>
                </div>
                <textarea
                  value={configEnv}
                  onChange={(e) => setConfigEnv(e.target.value)}
                  className="h-80 w-full resize-none bg-background p-4 font-mono text-sm focus:outline-none"
                  spellCheck={false}
                />
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="mb-2 font-semibold">Configuration Guide:</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Set <code className="rounded bg-muted px-1">true</code> to enable a feature</li>
                  <li>Set <code className="rounded bg-muted px-1">false</code> to disable a feature</li>
                  <li>Change <code className="rounded bg-muted px-1">PREFIX</code> to set your command prefix</li>
                  <li>Update <code className="rounded bg-muted px-1">OWNER_NUMBER</code> with your WhatsApp number</li>
                  <li>Bot commands are controlled via WhatsApp &quot;Message Yourself&quot;</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button onClick={() => router.push("/dashboard/bots")} className="flex-1 gap-2">
                  <Server className="h-4 w-4" />
                  Save & Deploy to Ubuntu Server
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

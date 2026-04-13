"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { generatePairingCode, generateSessionId } from "@/lib/utils"
import {
  Bot,
  Smartphone,
  QrCode,
  Hash,
  Check,
  Copy,
  RefreshCw,
  Clock,
  Phone,
  MessageCircle,
  Shield,
  Server,
  Terminal,
  ExternalLink,
} from "lucide-react"
import QRCodeComponent from "@/components/qr-code"
import Link from "next/link"

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

export default function MalaiPairingSite() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPhoneSet, setIsPhoneSet] = useState(false)
  const [pairingMethod, setPairingMethod] = useState<"code" | "qr">("code")
  const [pairingCode, setPairingCode] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [timeLeft, setTimeLeft] = useState(180)
  const [isPairing, setIsPairing] = useState(false)
  const [pairingComplete, setPairingComplete] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [configEnv, setConfigEnv] = useState(DEFAULT_CONFIG)
  const [manualSessionId, setManualSessionId] = useState("")

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPairing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isPairing) {
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
    setPairingComplete(true)
    setIsPairing(false)
  }

  const handleDeployWithSessionId = () => {
    if (manualSessionId.length > 10) {
      setSessionId(manualSessionId)
      setPairingComplete(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Malai-Pairing-Site</h1>
              <p className="text-xs text-muted-foreground">WhatsApp Bot Deployment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <Server className="h-3 w-3" />
              Ubuntu Server
            </Badge>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Helpline Banner */}
          <div className="mb-6 rounded-lg bg-primary/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Need Help?</p>
                  <p className="text-sm text-muted-foreground">
                    Helpline: <span className="font-mono text-primary">+254 105 197 055</span>
                  </p>
                </div>
              </div>
              <a href="https://wa.me/254105197055" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Main Pairing Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>WhatsApp Pairing</CardTitle>
                  <CardDescription>
                    Link your WhatsApp to deploy your Malai XMD Bot on Ubuntu Server
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!pairingComplete ? (
                <>
                  {/* Step 1: Phone Number Input */}
                  {!isPhoneSet ? (
                    <div className="space-y-6">
                      <div className="rounded-lg border border-border bg-muted/50 p-6">
                        <h3 className="mb-4 flex items-center gap-2 font-semibold">
                          <Phone className="h-5 w-5 text-primary" />
                          Step 1: Enter Your WhatsApp Number
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
                              Enter your number with country code (e.g., 254 for Kenya)
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

                      <div className="text-center text-sm text-muted-foreground">
                        <p>Your session ID will be sent to this WhatsApp number</p>
                        <p>via &quot;Message Yourself&quot; feature</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Phone Number Confirmed */}
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

                      {/* Step 2: Pairing Method */}
                      <Tabs value={pairingMethod} onValueChange={(v) => setPairingMethod(v as "code" | "qr")}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="code" className="gap-2">
                            <Hash className="h-4 w-4" /> Pairing Code
                          </TabsTrigger>
                          <TabsTrigger value="qr" className="gap-2">
                            <QrCode className="h-4 w-4" /> QR Code
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="code" className="space-y-4 pt-4">
                          {!isPairing ? (
                            <div className="py-8 text-center">
                              <Hash className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                              <h3 className="mb-2 text-lg font-semibold">Generate Pairing Code</h3>
                              <p className="mb-6 text-muted-foreground">
                                Get an 8-digit alphanumeric code to link your WhatsApp
                              </p>
                              <Button onClick={handleGeneratePairingCode} size="lg">
                                Generate Code
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Timer */}
                              <div className="text-center">
                                <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  Time remaining: <span className="font-mono font-bold text-primary">{formatTime(timeLeft)}</span>
                                </div>
                                <Progress value={(timeLeft / 180) * 100} className="h-2" />
                              </div>

                              {/* Pairing Code Display */}
                              <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 text-center">
                                <p className="mb-2 text-sm text-muted-foreground">Your 8-Digit Pairing Code</p>
                                <div className="mb-4 flex items-center justify-center gap-3">
                                  <span className="font-mono text-5xl font-bold tracking-[0.3em] text-primary">
                                    {pairingCode}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopy(pairingCode, "code")}
                                  >
                                    {copied === "code" ? (
                                      <Check className="h-5 w-5 text-primary" />
                                    ) : (
                                      <Copy className="h-5 w-5" />
                                    )}
                                  </Button>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleGeneratePairingCode}
                                  className="gap-2"
                                >
                                  <RefreshCw className="h-4 w-4" /> Regenerate Code
                                </Button>
                              </div>

                              {/* Instructions */}
                              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <h4 className="mb-3 flex items-center gap-2 font-semibold">
                                  <Shield className="h-4 w-4 text-primary" />
                                  How to Pair:
                                </h4>
                                <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                                  <li>Open <strong>WhatsApp</strong> on your phone</li>
                                  <li>Go to <strong>Settings</strong> &gt; <strong>Linked Devices</strong></li>
                                  <li>Tap <strong>&quot;Link a Device&quot;</strong></li>
                                  <li>Select <strong>&quot;Link with phone number instead&quot;</strong></li>
                                  <li>Enter the <strong>8-digit code</strong> shown above</li>
                                  <li>Wait for pairing to complete</li>
                                </ol>
                              </div>

                              <Button onClick={handleCompletePairing} className="w-full" size="lg">
                                I Have Completed Pairing
                              </Button>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="qr" className="space-y-4 pt-4">
                          {!isPairing ? (
                            <div className="py-8 text-center">
                              <QrCode className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                              <h3 className="mb-2 text-lg font-semibold">Generate QR Code</h3>
                              <p className="mb-6 text-muted-foreground">
                                Scan a QR code to link your WhatsApp
                              </p>
                              <Button onClick={handleGeneratePairingCode} size="lg">
                                Generate QR Code
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Timer */}
                              <div className="text-center">
                                <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  Time remaining: <span className="font-mono font-bold text-primary">{formatTime(timeLeft)}</span>
                                </div>
                                <Progress value={(timeLeft / 180) * 100} className="h-2" />
                              </div>

                              {/* QR Code Display */}
                              <div className="flex justify-center">
                                <div className="rounded-xl bg-white p-4">
                                  <QRCodeComponent value={`malai-xmd://${sessionId}?code=${pairingCode}&phone=${phoneNumber}`} />
                                </div>
                              </div>

                              {/* Instructions */}
                              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <h4 className="mb-3 flex items-center gap-2 font-semibold">
                                  <Shield className="h-4 w-4 text-primary" />
                                  How to Scan:
                                </h4>
                                <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                                  <li>Open <strong>WhatsApp</strong> on your phone</li>
                                  <li>Go to <strong>Settings</strong> &gt; <strong>Linked Devices</strong></li>
                                  <li>Tap <strong>&quot;Link a Device&quot;</strong></li>
                                  <li>Point your camera at the <strong>QR code</strong></li>
                                  <li>Wait for pairing to complete</li>
                                </ol>
                              </div>

                              <Button onClick={handleCompletePairing} className="w-full" size="lg">
                                I Have Completed Pairing
                              </Button>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </>
              ) : (
                /* Pairing Complete */
                <div className="space-y-6">
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">Pairing Successful!</h3>
                    <p className="text-muted-foreground">
                      Your bot is being deployed on Ubuntu Server
                    </p>
                  </div>

                  {/* Session ID */}
                  <div className="rounded-lg bg-muted p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Your Session ID
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(sessionId, "session")}
                        className="gap-2"
                      >
                        {copied === "session" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy
                      </Button>
                    </div>
                    <code className="block break-all rounded bg-background p-3 font-mono text-sm">
                      {sessionId}
                    </code>
                    <p className="mt-2 text-xs text-muted-foreground">
                      This session ID has been sent to +{phoneNumber} via &quot;Message Yourself&quot;
                    </p>
                  </div>

                  {/* WhatsApp Message Preview */}
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      Message Sent to Your WhatsApp:
                    </h4>
                    <div className="rounded-lg bg-background p-4 font-mono text-sm">
                      <p className="mb-2">*MALAI XMD BOT - SESSION ID*</p>
                      <p className="mb-2">Your bot has been successfully deployed!</p>
                      <p className="mb-2">Session ID:</p>
                      <p className="break-all text-primary">{sessionId}</p>
                      <p className="mt-2">Use this ID to configure your bot.</p>
                      <p className="mt-2">Commands: Type .menu to see all commands</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deploy with Existing Session ID */}
          <Card className="mb-6">
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
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
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

          {/* Config.env Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
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
                    <Badge variant="outline">Ubuntu Server</Badge>
                  </div>
                  <textarea
                    value={configEnv}
                    onChange={(e) => setConfigEnv(e.target.value)}
                    className="h-96 w-full resize-none bg-background p-4 font-mono text-sm focus:outline-none"
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
                  </ul>
                </div>

                <Button className="w-full gap-2">
                  <Server className="h-4 w-4" />
                  Save & Deploy to Ubuntu Server
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Powered by Malai Global Tech</p>
            <p>Helpline: +254 105 197 055 | Deposit: +254 105 197 055</p>
            <div className="mt-2 flex items-center justify-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-1 text-primary hover:underline">
                Go to Dashboard <ExternalLink className="h-3 w-3" />
              </Link>
              <Link href="/" className="flex items-center gap-1 text-primary hover:underline">
                Home <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

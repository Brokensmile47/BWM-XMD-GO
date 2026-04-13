"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Phone,
  MessageCircle,
  Mail,
  HelpCircle,
  Bot,
  Wallet,
  Users,
  TrendingUp,
  Shield,
  Clock,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "How do I deploy a WhatsApp bot?",
    answer:
      "Go to Deploy Bot in the sidebar, enter your bot name, select a plan, and follow the pairing process using either the 8-digit pairing code or QR code. Your session ID will be sent to your WhatsApp number after successful pairing.",
  },
  {
    question: "What is the pairing code?",
    answer:
      "The pairing code is an 8-digit alphanumeric code (mixture of letters and numbers) that you use to link your WhatsApp. Open WhatsApp > Settings > Linked Devices > Link a Device > Link with phone number instead, then enter the code.",
  },
  {
    question: "How long does it take to receive my session ID?",
    answer:
      "Your session ID is generated immediately after successful pairing and sent to your WhatsApp number. If you don't receive it within a few minutes, please contact support.",
  },
  {
    question: "How do I add funds to my wallet?",
    answer:
      "Go to Wallet in the sidebar and click Deposit. Send money to our M-Pesa or Airtel Money number (254105197055), then enter the amount sent. Your balance will be credited after admin confirmation.",
  },
  {
    question: "What are the different bot plans?",
    answer:
      "We offer three plans: Basic (KES 500) with standard features, Premium (KES 1,000) with priority support and all commands, and Unlimited (KES 2,500) with 24/7 support, unlimited usage, and custom branding.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "Share your unique referral code with friends. When they register using your code, they receive KES 50 bonus and you earn KES 100. There's no limit to how many people you can refer!",
  },
  {
    question: "How long does social media boosting take?",
    answer:
      "Most orders start processing within minutes. Followers and likes typically complete within 24-72 hours depending on the quantity ordered. You can track your order status in the Order History section.",
  },
  {
    question: "Is my WhatsApp data safe?",
    answer:
      "Yes, your session data is encrypted and securely stored. We only access what's necessary for the bot to function. We never read your personal messages or share your data with third parties.",
  },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with your account, bots, and services
        </p>
      </div>

      {/* Contact Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Helpline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 font-mono text-2xl font-bold">+254 105 197 055</p>
            <a href="tel:254105197055">
              <Button className="w-full gap-2">
                <Phone className="h-4 w-4" /> Call Now
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              WhatsApp Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Chat with us on WhatsApp for quick support</p>
            <a href="https://wa.me/254105197055" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" /> Open WhatsApp
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 font-medium">24/7 Available</p>
            <p className="text-sm text-muted-foreground">
              Our support team is available round the clock to assist you
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Help</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer transition-colors hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Bot Issues</CardTitle>
                <CardDescription>Troubleshoot bot problems</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-colors hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Payment Help</CardTitle>
                <CardDescription>Deposits & withdrawals</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-colors hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Social Boost</CardTitle>
                <CardDescription>Order status & issues</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-colors hover:border-primary">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Referrals</CardTitle>
                <CardDescription>Referral program help</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="border-t px-4 py-3 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deposit Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Deposit Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-2 font-medium">Send payments to:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">M-Pesa Number:</span>
                <span className="font-mono font-bold">254105197055</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Airtel Money:</span>
                <span className="font-mono font-bold">254105197055</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              After sending payment, go to Wallet and submit a deposit request with the amount sent.
              Your balance will be credited after admin confirmation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="mt-8 border-orange-500/50 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <Shield className="h-5 w-5" />
            Need Urgent Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            For urgent matters or account security issues, contact us immediately:
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:254105197055">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" /> +254 105 197 055
              </Button>
            </a>
            <a href="https://wa.me/254105197055" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

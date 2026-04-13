"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Bot, Wallet, TrendingUp, Users, ArrowRight, Zap } from "lucide-react"

export default function DashboardPage() {
  const { currentUser, bots } = useStore()

  if (!currentUser) return null

  const userBots = bots.filter((b) => b.status !== "inactive")
  const activeBots = userBots.filter((b) => b.status === "active")

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
        <p className="text-muted-foreground">
          Manage your bots, wallet, and services from your dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {currentUser.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/dashboard/wallet" className="text-primary hover:underline">
                Add funds
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBots.length}</div>
            <p className="text-xs text-muted-foreground">
              {userBots.length} total deployed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{currentUser.referralCode}</div>
            <p className="text-xs text-muted-foreground">
              Share to earn KES 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentUser.isAdmin ? (
                <Badge variant="success">Admin</Badge>
              ) : (
                <Badge>Standard</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentUser.isAdmin ? "Unlimited access" : "Upgrade for more"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group cursor-pointer transition-colors hover:border-primary">
            <Link href="/dashboard/deploy">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Bot className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="mt-4">Deploy New Bot</CardTitle>
                <CardDescription>
                  Create and deploy a new WhatsApp bot with pairing code or QR
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-colors hover:border-primary">
            <Link href="/dashboard/wallet">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Wallet className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="mt-4">Add Funds</CardTitle>
                <CardDescription>
                  Deposit money via M-Pesa or Airtel Money to your wallet
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-colors hover:border-primary">
            <Link href="/dashboard/social">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="mt-4">Social Boost</CardTitle>
                <CardDescription>
                  Boost your social media accounts with followers and engagement
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Bots */}
      {userBots.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Bots</h2>
            <Link href="/dashboard/bots">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userBots.slice(0, 3).map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <Badge
                      variant={
                        bot.status === "active"
                          ? "success"
                          : bot.status === "pairing"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {bot.status}
                    </Badge>
                  </div>
                  <CardDescription className="font-mono text-xs">
                    {bot.sessionId.slice(0, 20)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Plan: <span className="capitalize font-medium">{bot.plan}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(bot.expiresAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

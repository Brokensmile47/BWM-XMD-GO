"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Gift, Copy, Check, Share2, Wallet, UserPlus } from "lucide-react"

export default function ReferralsPage() {
  const { currentUser, getAllUsers } = useStore()
  const [copied, setCopied] = useState(false)

  if (!currentUser) return null

  const allUsers = getAllUsers()
  const referredUsers = allUsers.filter((u) => u.referredBy === currentUser.referralCode)
  const totalEarnings = referredUsers.length * 100

  const referralLink = `https://malaiglobaltech.com/register?ref=${currentUser.referralCode}`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Malai XMD.Pro",
        text: "Deploy your WhatsApp bot with Malai XMD.Pro and get KES 50 bonus!",
        url: referralLink,
      })
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">
          Invite friends and earn KES 100 for each successful referral
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referredUsers.length}</div>
            <p className="text-xs text-muted-foreground">Friends joined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bonus Per Referral</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES 100</div>
            <p className="text-xs text-muted-foreground">You earn per signup</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>
            Share your code with friends. They get KES 50 bonus, you earn KES 100!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 rounded-lg bg-muted p-4 text-center">
              <span className="font-mono text-3xl font-bold tracking-widest">
                {currentUser.referralCode}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14"
              onClick={() => handleCopy(currentUser.referralCode)}
            >
              {copied ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <Copy className="h-6 w-6" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Referral Link</label>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={() => handleCopy(referralLink)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">1. Share Your Code</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral code with friends and family
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">2. Friends Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                They register using your code and get KES 50 bonus
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">3. You Earn</h3>
              <p className="text-sm text-muted-foreground">
                You receive KES 100 for every successful referral
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referred Users */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>Users who signed up with your code</CardDescription>
        </CardHeader>
        <CardContent>
          {referredUsers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No referrals yet. Start sharing your code!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-semibold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">+KES 100</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

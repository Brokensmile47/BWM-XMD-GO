"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Wallet, ArrowDownLeft, ArrowUpRight, Phone, Copy, Check } from "lucide-react"

export default function WalletPage() {
  const { currentUser, transactions, deposit, withdraw } = useStore()
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawPhone, setWithdrawPhone] = useState("")
  const [copied, setCopied] = useState(false)
  const [showDepositDialog, setShowDepositDialog] = useState(false)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [depositPending, setDepositPending] = useState(false)

  if (!currentUser) return null

  const userTransactions = transactions
    .filter((t) => t.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("254105197055")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeposit = () => {
    const amount = parseInt(depositAmount)
    if (amount > 0) {
      deposit(amount)
      setDepositPending(true)
    }
  }

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount)
    if (amount > 0 && withdrawPhone) {
      const success = withdraw(amount, withdrawPhone)
      if (success) {
        setShowWithdrawDialog(false)
        setWithdrawAmount("")
        setWithdrawPhone("")
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and transactions</p>
      </div>

      {/* Balance Card */}
      <Card className="mb-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-primary-foreground/80">
            <Wallet className="h-5 w-5" />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-4xl font-bold">
            KES {currentUser.balance.toLocaleString()}
          </div>
          <div className="flex flex-wrap gap-3">
            <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <ArrowDownLeft className="h-4 w-4" />
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                  <DialogDescription>
                    Send money to the number below and enter the amount
                  </DialogDescription>
                </DialogHeader>
                
                {!depositPending ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="mb-2 text-sm font-medium">Send to M-Pesa/Airtel Money:</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg font-bold">254105197055</span>
                        <Button variant="ghost" size="sm" onClick={handleCopyNumber}>
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Amount Sent (KES)</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={handleDeposit} className="w-full" disabled={!depositAmount}>
                      Confirm Deposit
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Deposit Submitted</h3>
                      <p className="text-sm text-muted-foreground">
                        Your deposit of KES {depositAmount} is pending confirmation.
                        Please wait for admin approval.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setShowDepositDialog(false)
                        setDepositPending(false)
                        setDepositAmount("")
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Enter the amount and phone number to receive funds
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Amount (KES)</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: KES {currentUser.balance.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="254712345678"
                      value={withdrawPhone}
                      onChange={(e) => setWithdrawPhone(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    onClick={handleWithdraw}
                    className="w-full"
                    disabled={
                      !withdrawAmount ||
                      !withdrawPhone ||
                      parseInt(withdrawAmount) > currentUser.balance
                    }
                  >
                    Request Withdrawal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              M-Pesa Deposit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-muted-foreground">Send to:</p>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <span className="font-mono font-bold">254105197055</span>
              <Button variant="ghost" size="sm" onClick={handleCopyNumber}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Airtel Money Deposit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-muted-foreground">Send to:</p>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <span className="font-mono font-bold">254105197055</span>
              <Button variant="ghost" size="sm" onClick={handleCopyNumber}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your deposits and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          {userTransactions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {userTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        tx.type === "deposit" || tx.type === "referral"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-orange-500/10 text-orange-500"
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "referral" ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        tx.type === "deposit" || tx.type === "referral"
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {tx.type === "deposit" || tx.type === "referral" ? "+" : "-"}KES{" "}
                      {tx.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        tx.status === "completed"
                          ? "success"
                          : tx.status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Users,
  Bot,
  Wallet,
  TrendingUp,
  Search,
  Plus,
  Minus,
  Trash2,
  Check,
  X,
  Shield,
  Activity,
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const {
    currentUser,
    getAllUsers,
    getAllBots,
    getAllTransactions,
    socialOrders,
    updateUserBalance,
    deleteUser,
    updateOrderStatus,
  } = useStore()

  const [search, setSearch] = useState("")
  const [balanceUserId, setBalanceUserId] = useState<string | null>(null)
  const [balanceAmount, setBalanceAmount] = useState("")
  const [balanceAction, setBalanceAction] = useState<"add" | "remove">("add")

  if (!currentUser || !currentUser.isAdmin) {
    router.push("/dashboard")
    return null
  }

  const users = getAllUsers()
  const bots = getAllBots()
  const transactions = getAllTransactions()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search)
  )

  const pendingTransactions = transactions.filter((t) => t.status === "pending")
  const pendingSocialOrders = socialOrders.filter((o) => o.status === "pending")

  const handleUpdateBalance = () => {
    if (!balanceUserId || !balanceAmount) return
    const amount = parseInt(balanceAmount) * (balanceAction === "add" ? 1 : -1)
    updateUserBalance(balanceUserId, amount)
    setBalanceUserId(null)
    setBalanceAmount("")
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) return
    deleteUser(userId)
  }

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-500" },
    { label: "Active Bots", value: bots.filter((b) => b.status === "active").length, icon: Bot, color: "text-green-500" },
    { label: "Pending Deposits", value: pendingTransactions.filter((t) => t.type === "deposit").length, icon: Wallet, color: "text-orange-500" },
    { label: "Social Orders", value: pendingSocialOrders.length, icon: TrendingUp, color: "text-purple-500" },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Manage users, bots, and platform resources</p>
        <Badge variant="success" className="mt-2">Unlimited Resources</Badge>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="deposits">Pending Deposits</TabsTrigger>
          <TabsTrigger value="bots">All Bots</TabsTrigger>
          <TabsTrigger value="social">Social Orders</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium">User</th>
                      <th className="p-4 text-left text-sm font-medium">Phone</th>
                      <th className="p-4 text-left text-sm font-medium">Balance</th>
                      <th className="p-4 text-left text-sm font-medium">Referral Code</th>
                      <th className="p-4 text-left text-sm font-medium">Status</th>
                      <th className="p-4 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm">{user.phone}</td>
                        <td className="p-4 font-semibold">KES {user.balance.toLocaleString()}</td>
                        <td className="p-4 font-mono text-sm">{user.referralCode}</td>
                        <td className="p-4">
                          <Badge variant={user.isAdmin ? "success" : "secondary"}>
                            {user.isAdmin ? "Admin" : "User"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Dialog
                              open={balanceUserId === user.id}
                              onOpenChange={(open) => !open && setBalanceUserId(null)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setBalanceUserId(user.id)}
                                >
                                  <Wallet className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Balance</DialogTitle>
                                  <DialogDescription>
                                    Modify balance for {user.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Current Balance</p>
                                    <p className="text-2xl font-bold">
                                      KES {user.balance.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant={balanceAction === "add" ? "default" : "outline"}
                                      onClick={() => setBalanceAction("add")}
                                      className="flex-1"
                                    >
                                      <Plus className="mr-2 h-4 w-4" /> Add
                                    </Button>
                                    <Button
                                      variant={balanceAction === "remove" ? "default" : "outline"}
                                      onClick={() => setBalanceAction("remove")}
                                      className="flex-1"
                                    >
                                      <Minus className="mr-2 h-4 w-4" /> Remove
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Amount (KES)</Label>
                                    <Input
                                      type="number"
                                      value={balanceAmount}
                                      onChange={(e) => setBalanceAmount(e.target.value)}
                                      placeholder="Enter amount"
                                    />
                                  </div>
                                  <Button onClick={handleUpdateBalance} className="w-full">
                                    Update Balance
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {!user.isAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Deposits Tab */}
        <TabsContent value="deposits">
          <Card>
            <CardHeader>
              <CardTitle>Pending Deposits</CardTitle>
              <CardDescription>Approve or reject user deposit requests</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTransactions.filter((t) => t.type === "deposit").length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No pending deposits
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTransactions
                    .filter((t) => t.type === "deposit")
                    .map((tx) => {
                      const user = users.find((u) => u.id === tx.userId)
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-medium">{user?.name || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold">
                              KES {tx.amount.toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (user) {
                                    updateUserBalance(user.id, tx.amount)
                                  }
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Bots Tab */}
        <TabsContent value="bots">
          <Card>
            <CardHeader>
              <CardTitle>All Bots</CardTitle>
              <CardDescription>View all deployed bots across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {bots.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No bots deployed</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {bots.map((bot) => (
                    <div key={bot.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{bot.name}</h4>
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
                      <p className="mt-2 font-mono text-xs text-muted-foreground truncate">
                        {bot.sessionId}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <Badge variant="outline" className="capitalize">{bot.plan}</Badge>
                        <span className="text-muted-foreground">
                          {new Date(bot.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Orders Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Orders</CardTitle>
              <CardDescription>Manage social media boosting orders</CardDescription>
            </CardHeader>
            <CardContent>
              {socialOrders.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No orders yet</div>
              ) : (
                <div className="space-y-4">
                  {socialOrders.map((order) => {
                    const user = users.find((u) => u.id === order.userId)
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="capitalize">{order.platform}</Badge>
                            <span className="font-medium">{order.service}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground truncate max-w-md">
                            {order.link}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            By: {user?.name || "Unknown"} | Qty: {order.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">KES {order.amount}</span>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "success"
                                : order.status === "processing"
                                ? "warning"
                                : order.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                          {order.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, "processing")}
                              >
                                Process
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateOrderStatus(order.id, "completed")}
                              >
                                Complete
                              </Button>
                            </div>
                          )}
                          {order.status === "processing" && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

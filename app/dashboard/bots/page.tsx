"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { Bot, Plus, Copy, Check, Trash2, Power, PowerOff, Clock, Search } from "lucide-react"

export default function BotsPage() {
  const { currentUser, bots, updateBotStatus, deleteBot } = useStore()
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  if (!currentUser) return null

  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(search.toLowerCase()) ||
      bot.sessionId.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleToggleStatus = (botId: string, currentStatus: string) => {
    updateBotStatus(botId, currentStatus === "active" ? "inactive" : "active")
  }

  const handleDelete = (botId: string) => {
    deleteBot(botId)
    setDeleteConfirm(null)
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Bots</h1>
          <p className="text-muted-foreground">Manage your deployed WhatsApp bots</p>
        </div>
        <Link href="/dashboard/deploy">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Deploy New Bot
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bots Grid */}
      {filteredBots.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bot className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No bots found</h3>
            <p className="mb-4 text-muted-foreground">
              {search ? "Try a different search term" : "Deploy your first bot to get started"}
            </p>
            {!search && (
              <Link href="/dashboard/deploy">
                <Button>Deploy Your First Bot</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBots.map((bot) => (
            <Card key={bot.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Session ID</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs font-mono">
                      {bot.sessionId}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(bot.id, bot.sessionId)}
                    >
                      {copied === bot.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Expires: {new Date(bot.expiresAt).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {bot.plan}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => handleToggleStatus(bot.id, bot.status)}
                  >
                    {bot.status === "active" ? (
                      <>
                        <PowerOff className="h-4 w-4" /> Stop
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4" /> Start
                      </>
                    )}
                  </Button>

                  <Dialog open={deleteConfirm === bot.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setDeleteConfirm(bot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Bot</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete &quot;{bot.name}&quot;? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(bot.id)}>
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

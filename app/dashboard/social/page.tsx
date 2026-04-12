"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Music2,
  Users,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Check,
  ShoppingCart,
} from "lucide-react"

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    services: [
      { id: "ig_followers", name: "Followers", price: 0.5, icon: Users, min: 100, max: 50000 },
      { id: "ig_likes", name: "Likes", price: 0.3, icon: Heart, min: 50, max: 10000 },
      { id: "ig_views", name: "Reels Views", price: 0.2, icon: Eye, min: 100, max: 100000 },
      { id: "ig_comments", name: "Comments", price: 2, icon: MessageCircle, min: 10, max: 1000 },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    color: "bg-black",
    services: [
      { id: "tt_followers", name: "Followers", price: 0.4, icon: Users, min: 100, max: 50000 },
      { id: "tt_likes", name: "Likes", price: 0.2, icon: Heart, min: 100, max: 50000 },
      { id: "tt_views", name: "Views", price: 0.1, icon: Eye, min: 500, max: 1000000 },
      { id: "tt_shares", name: "Shares", price: 0.5, icon: Share2, min: 50, max: 10000 },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    services: [
      { id: "yt_subscribers", name: "Subscribers", price: 1, icon: Users, min: 100, max: 10000 },
      { id: "yt_views", name: "Views", price: 0.5, icon: Eye, min: 500, max: 100000 },
      { id: "yt_likes", name: "Likes", price: 0.3, icon: Heart, min: 100, max: 10000 },
      { id: "yt_comments", name: "Comments", price: 3, icon: MessageCircle, min: 10, max: 500 },
    ],
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    color: "bg-blue-500",
    services: [
      { id: "tw_followers", name: "Followers", price: 0.6, icon: Users, min: 100, max: 50000 },
      { id: "tw_likes", name: "Likes", price: 0.2, icon: Heart, min: 50, max: 10000 },
      { id: "tw_retweets", name: "Retweets", price: 0.4, icon: Share2, min: 50, max: 10000 },
      { id: "tw_views", name: "Views", price: 0.1, icon: Eye, min: 500, max: 100000 },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    services: [
      { id: "fb_followers", name: "Page Followers", price: 0.5, icon: Users, min: 100, max: 50000 },
      { id: "fb_likes", name: "Post Likes", price: 0.2, icon: Heart, min: 50, max: 10000 },
      { id: "fb_shares", name: "Shares", price: 0.5, icon: Share2, min: 50, max: 5000 },
      { id: "fb_views", name: "Video Views", price: 0.2, icon: Eye, min: 500, max: 100000 },
    ],
  },
]

export default function SocialBoostPage() {
  const { currentUser, createSocialOrder, socialOrders } = useStore()
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0])
  const [selectedService, setSelectedService] = useState(platforms[0].services[0])
  const [quantity, setQuantity] = useState("")
  const [link, setLink] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)

  if (!currentUser) return null

  const userOrders = socialOrders
    .filter((o) => o.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalPrice = Math.round((parseInt(quantity) || 0) * selectedService.price)
  const canAfford = currentUser.isAdmin || currentUser.balance >= totalPrice
  const isValidQuantity =
    parseInt(quantity) >= selectedService.min && parseInt(quantity) <= selectedService.max

  const handlePlaceOrder = () => {
    if (!link || !quantity || !isValidQuantity || (!canAfford && !currentUser.isAdmin)) return

    const success = createSocialOrder(
      selectedPlatform.id,
      selectedService.name,
      link,
      parseInt(quantity),
      totalPrice
    )

    if (success) {
      setShowSuccess(true)
      setLink("")
      setQuantity("")
      setTimeout(() => {
        setShowSuccess(false)
        setOrderDialogOpen(false)
      }, 2000)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Social Media Boosting</h1>
        <p className="text-muted-foreground">
          Grow your social media presence with our boosting services
        </p>
      </div>

      <Tabs defaultValue="order">
        <TabsList>
          <TabsTrigger value="order">Place Order</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="order" className="space-y-6">
          {/* Platform Selection */}
          <div>
            <Label className="mb-3 block">Select Platform</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    setSelectedPlatform(platform)
                    setSelectedService(platform.services[0])
                    setQuantity("")
                    setLink("")
                  }}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    selectedPlatform.id === platform.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${platform.color} text-white`}
                  >
                    <platform.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <Label className="mb-3 block">Select Service</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {selectedPlatform.services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service)
                    setQuantity("")
                  }}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                    selectedService.id === service.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  <service.icon className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className="text-xs text-muted-foreground">
                    KES {service.price}/unit
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle>Place Your Order</CardTitle>
              <CardDescription>
                {selectedPlatform.name} - {selectedService.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {selectedPlatform.id === "youtube" ? "Video/Channel URL" : "Profile/Post URL"}
                </Label>
                <Input
                  placeholder={`Enter your ${selectedPlatform.name} URL`}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder={`Min: ${selectedService.min} - Max: ${selectedService.max}`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {selectedService.min.toLocaleString()}</span>
                  <span>Max: {selectedService.max.toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Price:</span>
                  <span className="text-2xl font-bold">KES {totalPrice.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span className={canAfford ? "text-green-500" : "text-destructive"}>
                    KES {currentUser.balance.toLocaleString()}
                  </span>
                </div>
              </div>

              {!canAfford && totalPrice > 0 && (
                <p className="text-sm text-destructive">
                  Insufficient balance. Please add funds to your wallet.
                </p>
              )}

              {!isValidQuantity && quantity && (
                <p className="text-sm text-destructive">
                  Quantity must be between {selectedService.min.toLocaleString()} and{" "}
                  {selectedService.max.toLocaleString()}
                </p>
              )}

              <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full gap-2"
                    disabled={!link || !quantity || !isValidQuantity || (!canAfford && !currentUser.isAdmin)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Place Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {!showSuccess ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Confirm Order</DialogTitle>
                        <DialogDescription>
                          Review your order before confirming
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Platform:</span>
                            <span className="font-medium">{selectedPlatform.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Service:</span>
                            <span className="font-medium">{selectedService.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium">
                              {parseInt(quantity).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Link:</span>
                            <span className="font-medium text-xs truncate max-w-[200px]">
                              {link}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">
                              KES {totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Button onClick={handlePlaceOrder} className="w-full">
                          Confirm Order
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Order Placed Successfully!</h3>
                      <p className="text-muted-foreground">
                        Your order is being processed
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past social media boosting orders</CardDescription>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No orders yet. Place your first order above!
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => {
                    const platform = platforms.find((p) => p.id === order.platform)
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              platform?.color || "bg-muted"
                            } text-white`}
                          >
                            {platform?.icon && <platform.icon className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">{order.platform}</span>
                              <span className="text-muted-foreground">-</span>
                              <span>{order.service}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {order.link}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {order.quantity.toLocaleString()} units
                          </p>
                          <p className="text-sm text-muted-foreground">
                            KES {order.amount.toLocaleString()}
                          </p>
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

"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  LayoutDashboard,
  Wallet,
  Smartphone,
  Users,
  TrendingUp,
  HelpCircle,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { currentUser, logout } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.push("/")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bots", href: "/dashboard/bots", icon: Bot },
    { name: "Deploy Bot", href: "/dashboard/deploy", icon: Smartphone },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Social Boost", href: "/dashboard/social", icon: TrendingUp },
    { name: "Referrals", href: "/dashboard/referrals", icon: Users },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ]

  const adminNavigation = currentUser.isAdmin
    ? [{ name: "Admin Panel", href: "/dashboard/admin", icon: Settings }]
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b bg-card p-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold">Malai XMD.Pro</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r bg-card transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="hidden items-center gap-2 border-b p-4 lg:flex">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Malai XMD.Pro</span>
          </div>

          {/* User info */}
          <div className="border-b p-4 lg:mt-0 mt-16">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="font-medium truncate">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  KES {currentUser.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}

            {adminNavigation.length > 0 && (
              <>
                <div className="my-4 border-t" />
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </>
            )}
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="min-h-screen pt-16 lg:pt-0">{children}</div>
      </main>
    </div>
  )
}

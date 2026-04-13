import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  balance: number
  referralCode: string
  referredBy?: string
  isAdmin: boolean
  createdAt: string
}

export interface Bot {
  id: string
  name: string
  sessionId: string
  status: "active" | "inactive" | "pairing"
  phoneNumber: string
  createdAt: string
  expiresAt: string
  plan: "basic" | "premium" | "unlimited"
}

export interface Transaction {
  id: string
  userId: string
  type: "deposit" | "withdrawal" | "purchase" | "referral"
  amount: number
  status: "pending" | "completed" | "failed"
  description: string
  createdAt: string
}

export interface SocialOrder {
  id: string
  userId: string
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "facebook"
  service: string
  link: string
  quantity: number
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: string
}

interface AppState {
  currentUser: User | null
  users: User[]
  bots: Bot[]
  transactions: Transaction[]
  socialOrders: SocialOrder[]
  
  // Auth actions
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, phone: string, password: string, referralCode?: string) => boolean
  logout: () => void
  
  // Wallet actions
  deposit: (amount: number) => void
  withdraw: (amount: number, phone: string) => boolean
  
  // Bot actions
  createBot: (name: string, plan: string) => Bot | null
  updateBotStatus: (botId: string, status: Bot["status"]) => void
  deleteBot: (botId: string) => void
  
  // Social media actions
  createSocialOrder: (platform: string, service: string, link: string, quantity: number, amount: number) => boolean
  
  // Admin actions
  getAllUsers: () => User[]
  getAllBots: () => Bot[]
  getAllTransactions: () => Transaction[]
  updateUserBalance: (userId: string, amount: number) => void
  deleteUser: (userId: string) => void
  updateOrderStatus: (orderId: string, status: SocialOrder["status"]) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const ADMIN_USER: User = {
  id: "admin_001",
  name: "Admin",
  email: "admin@malaiglobaltech.com",
  phone: "254105197055",
  balance: 999999999,
  referralCode: "ADMIN001",
  isAdmin: true,
  createdAt: new Date().toISOString(),
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [ADMIN_USER],
      bots: [],
      transactions: [],
      socialOrders: [],

      login: (email, password) => {
        const users = get().users
        const user = users.find((u) => u.email === email)
        if (user) {
          set({ currentUser: user })
          return true
        }
        // Admin login
        if (email === "admin@malaiglobaltech.com" && password === "admin123") {
          set({ currentUser: ADMIN_USER })
          return true
        }
        return false
      },

      register: (name, email, phone, password, referralCode) => {
        const users = get().users
        if (users.find((u) => u.email === email)) {
          return false
        }
        
        const newUser: User = {
          id: generateId(),
          name,
          email,
          phone,
          balance: referralCode ? 50 : 0,
          referralCode: generateId().toUpperCase().slice(0, 8),
          referredBy: referralCode,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        }
        
        set({ users: [...users, newUser], currentUser: newUser })
        
        // Give referrer bonus
        if (referralCode) {
          const referrer = users.find((u) => u.referralCode === referralCode)
          if (referrer) {
            const updatedUsers = get().users.map((u) =>
              u.id === referrer.id ? { ...u, balance: u.balance + 100 } : u
            )
            set({ users: updatedUsers })
          }
        }
        
        return true
      },

      logout: () => {
        set({ currentUser: null })
      },

      deposit: (amount) => {
        const user = get().currentUser
        if (!user) return
        
        const transaction: Transaction = {
          id: generateId(),
          userId: user.id,
          type: "deposit",
          amount,
          status: "pending",
          description: `Deposit of KES ${amount}`,
          createdAt: new Date().toISOString(),
        }
        
        set({ transactions: [...get().transactions, transaction] })
      },

      withdraw: (amount, phone) => {
        const user = get().currentUser
        if (!user || user.balance < amount) return false
        
        const updatedUser = { ...user, balance: user.balance - amount }
        const users = get().users.map((u) => (u.id === user.id ? updatedUser : u))
        
        const transaction: Transaction = {
          id: generateId(),
          userId: user.id,
          type: "withdrawal",
          amount,
          status: "pending",
          description: `Withdrawal to ${phone}`,
          createdAt: new Date().toISOString(),
        }
        
        set({
          currentUser: updatedUser,
          users,
          transactions: [...get().transactions, transaction],
        })
        
        return true
      },

      createBot: (name, plan) => {
        const user = get().currentUser
        if (!user) return null
        
        const prices = { basic: 500, premium: 1000, unlimited: 2500 }
        const price = prices[plan as keyof typeof prices] || 500
        
        if (!user.isAdmin && user.balance < price) return null
        
        const bot: Bot = {
          id: generateId(),
          name,
          sessionId: `malai_${generateId()}${generateId()}`,
          status: "pairing",
          phoneNumber: "",
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          plan: plan as Bot["plan"],
        }
        
        if (!user.isAdmin) {
          const updatedUser = { ...user, balance: user.balance - price }
          const users = get().users.map((u) => (u.id === user.id ? updatedUser : u))
          set({ currentUser: updatedUser, users })
        }
        
        set({ bots: [...get().bots, bot] })
        return bot
      },

      updateBotStatus: (botId, status) => {
        const bots = get().bots.map((b) => (b.id === botId ? { ...b, status } : b))
        set({ bots })
      },

      deleteBot: (botId) => {
        const bots = get().bots.filter((b) => b.id !== botId)
        set({ bots })
      },

      createSocialOrder: (platform, service, link, quantity, amount) => {
        const user = get().currentUser
        if (!user) return false
        
        if (!user.isAdmin && user.balance < amount) return false
        
        const order: SocialOrder = {
          id: generateId(),
          userId: user.id,
          platform: platform as SocialOrder["platform"],
          service,
          link,
          quantity,
          amount,
          status: "pending",
          createdAt: new Date().toISOString(),
        }
        
        if (!user.isAdmin) {
          const updatedUser = { ...user, balance: user.balance - amount }
          const users = get().users.map((u) => (u.id === user.id ? updatedUser : u))
          set({ currentUser: updatedUser, users })
        }
        
        set({ socialOrders: [...get().socialOrders, order] })
        return true
      },

      getAllUsers: () => get().users,
      getAllBots: () => get().bots,
      getAllTransactions: () => get().transactions,

      updateUserBalance: (userId, amount) => {
        const users = get().users.map((u) =>
          u.id === userId ? { ...u, balance: u.balance + amount } : u
        )
        const currentUser = get().currentUser
        if (currentUser?.id === userId) {
          set({ currentUser: { ...currentUser, balance: currentUser.balance + amount } })
        }
        set({ users })
      },

      deleteUser: (userId) => {
        const users = get().users.filter((u) => u.id !== userId)
        set({ users })
      },

      updateOrderStatus: (orderId, status) => {
        const socialOrders = get().socialOrders.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
        set({ socialOrders })
      },
    }),
    {
      name: "malai-xmd-store",
    }
  )
)

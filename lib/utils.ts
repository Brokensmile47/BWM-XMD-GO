import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePairingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let id = "malai_"
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export function formatCurrency(amount: number): string {
  return `KES ${amount.toLocaleString()}`
}

export function formatPhoneNumber(phone: string): string {
  if (phone.startsWith("254")) {
    return `+${phone}`
  }
  if (phone.startsWith("0")) {
    return `+254${phone.slice(1)}`
  }
  return phone
}

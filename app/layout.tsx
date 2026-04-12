import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Malai XMD.Pro - WhatsApp Bot Deployment Platform",
  description: "Deploy your WhatsApp bot with Malai XMD.Pro. Fast, reliable, and feature-rich bot deployment service.",
  keywords: ["WhatsApp bot", "bot deployment", "Malai XMD", "Kenya", "automation"],
}

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

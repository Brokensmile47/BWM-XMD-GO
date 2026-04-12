"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
}

export default function QRCodeComponent({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple QR-like pattern generator (visual representation)
    const moduleSize = size / 25
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Generate a deterministic pattern based on value
    const hash = value.split("").reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0
    }, 0)

    ctx.fillStyle = "#000000"

    // Position detection patterns (corners)
    const drawPositionPattern = (x: number, y: number) => {
      // Outer square
      ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize)
      ctx.fillStyle = "#000000"
      ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
    }

    drawPositionPattern(0, 0)
    drawPositionPattern(18, 0)
    drawPositionPattern(0, 18)

    // Generate data modules based on hash
    let seed = Math.abs(hash)
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Skip position patterns
        if (
          (row < 8 && col < 8) ||
          (row < 8 && col > 16) ||
          (row > 16 && col < 8)
        ) {
          continue
        }

        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        if (seed % 3 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Timing patterns
    ctx.fillStyle = "#000000"
    for (let i = 8; i < 17; i += 2) {
      ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize)
      ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize)
    }
  }, [value, size])

  return (
    <div className="rounded-lg border bg-white p-4">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="mx-auto"
      />
    </div>
  )
}

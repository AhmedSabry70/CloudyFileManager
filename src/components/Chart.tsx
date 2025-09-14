"use client"
import { convertFileSize } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface StorageGaugeChartProps {
  percentage: number
  size?: number
  strokeWidth?: number
  backgroundColor?: string
  foregroundColor?: string
  textColor?: string
  used?: number 
}

export default function StorageGaugeChart({
  percentage = 65,
  size = 300,
  strokeWidth = 30,
  backgroundColor = "#ff6b6b",
  foregroundColor = "#ffffff",
  textColor = "#ffffff",
   used = 0 
}: StorageGaugeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set the canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr

    // Scale the context to account for the device pixel ratio
    ctx.scale(dpr, dpr)

    // Clear the canvas
    ctx.clearRect(0, 0, size, size)

    const centerX = size / 2
    const centerY = size / 2
    const radius = (size - strokeWidth) / 2

    // Draw the background arc (lighter color)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 0.25 * Math.PI)
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineCap = "round"
    ctx.stroke()

    // Calculate the end angle based on the percentage
    // 0% is at 0.75π (bottom left), 100% is at 0.25π (bottom right)
    const endAngle = 0.75 * Math.PI - (percentage / 100) * 1.5 * Math.PI

    // Draw the foreground arc (progress)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, endAngle, true)
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = foregroundColor
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw the dotted circle
    const dotRadius = 5 //1.5
    const dotCount = 200 //60 // Number of dots
    const dotRadius2 = radius - strokeWidth / 2 // Radius where dots are placed / *

    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * 2 * Math.PI

      // Skip dots at the bottom gap (from 0.65π to 0.35π)
      if (angle > 0.65 * Math.PI && angle < 1.35 * Math.PI) {
        const x = centerX + dotRadius2 * Math.cos(angle)
        const y = centerY + dotRadius2 * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(x, y, dotRadius, 0, 2 * Math.PI)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()
      }
    }

    // Draw the text in the center
    ctx.textAlign = "center"
    ctx.fillStyle = textColor

    // Draw the percentage
    ctx.font = "bold 48px Arial"
    ctx.fillText(`${percentage}%`, centerX, centerY)

    // Draw the "Space used" text
    ctx.font = "20px Arial"
    ctx.fillText("Space used", centerX, centerY + 30)
  }, [percentage, size, strokeWidth, backgroundColor, foregroundColor, textColor])

  return (
    <>
    <Card className="chart">
      <CardContent className="flex-1 p-0">
      <div
      className="relative"
      style={{
        width: size,
        height: size,
        backgroundColor: backgroundColor,
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
      </CardContent>
      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Available Storage</CardTitle>
        <CardDescription className="chart-description">
          {used ? convertFileSize(used) : "2GB"} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
    
    </>
  )
}


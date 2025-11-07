"use client"

import { useEffect, useRef } from "react"

interface Snowflake {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  radius: number
  opacity: number
}

export function Snowfall3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create snowflakes
    const snowflakes: Snowflake[] = []
    const numFlakes = 150 // Numero di fiocchi

    for (let i = 0; i < numFlakes; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 100, // Profondità 3D (0-100)
        vx: (Math.random() - 0.5) * 0.3, // Velocità orizzontale slow
        vy: Math.random() * 0.3 + 0.2, // Velocità verticale slow (0.2-0.5)
        vz: (Math.random() - 0.5) * 0.1, // Velocità profondità
        radius: Math.random() * 2 + 1, // Dimensione base
        opacity: Math.random() * 0.6 + 0.4, // Opacità (0.4-1)
      })
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sort by z-index for depth effect
      snowflakes.sort((a, b) => a.z - b.z)

      snowflakes.forEach((flake) => {
        // Update position (slow motion)
        flake.x += flake.vx
        flake.y += flake.vy
        flake.z += flake.vz

        // Wrap around edges
        if (flake.x > canvas.width + 50) flake.x = -50
        if (flake.x < -50) flake.x = canvas.width + 50
        if (flake.y > canvas.height + 50) {
          flake.y = -50
          flake.x = Math.random() * canvas.width
        }
        if (flake.z > 100) flake.z = 0
        if (flake.z < 0) flake.z = 100

        // Calculate size based on depth (3D effect)
        const scale = (flake.z + 50) / 150 // Scale da 0.33 a 1
        const size = flake.radius * scale * 2

        // Calculate opacity based on depth
        const depthOpacity = (flake.z + 50) / 150
        const finalOpacity = flake.opacity * depthOpacity

        // Draw snowflake
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`
        ctx.fill()

        // Add glow effect for closer flakes
        if (flake.z > 70) {
          ctx.shadowBlur = 10
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
        } else {
          ctx.shadowBlur = 0
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: "screen" }}
    />
  )
}


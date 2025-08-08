"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type AnimatedBackdropProps = {
  className?: string
  intensity?: "subtle" | "normal" | "strong"
}

/**
 * Pastel floating blobs backdrop.
 * - Uses CSS keyframes scoped to this component.
 * - Non-interactive and GPU-accelerated transforms.
 */
export default function AnimatedBackdrop({ className, intensity = "normal" }: AnimatedBackdropProps) {
  const opacity =
    intensity === "subtle" ? "opacity-[0.25]" : intensity === "strong" ? "opacity-[0.6]" : "opacity-[0.4]"
  const blur = intensity === "subtle" ? "blur-2xl" : intensity === "strong" ? "blur-[64px]" : "blur-[48px]"

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        "select-none will-change-transform",
        className
      )}
    >
      {/* Blob A */}
      <div
        className={cn(
          "absolute size-[40vmin] rounded-full mix-blend-screen",
          "bg-rose-400/30",
          opacity,
          blur,
          "animate-[floatA_18s_ease-in-out_infinite]"
        )}
        style={{ top: "-10%", left: "-10%" }}
      />
      {/* Blob B */}
      <div
        className={cn(
          "absolute size-[36vmin] rounded-full mix-blend-screen",
          "bg-teal-400/30",
          opacity,
          blur,
          "animate-[floatB_22s_ease-in-out_infinite]"
        )}
        style={{ bottom: "-8%", right: "-8%" }}
      />
      {/* Blob C */}
      <div
        className={cn(
          "absolute size-[28vmin] rounded-full mix-blend-screen",
          "bg-violet-400/30",
          opacity,
          blur,
          "animate-[floatC_26s_ease-in-out_infinite]"
        )}
        style={{ top: "30%", right: "20%" }}
      />
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),rgba(0,0,0,0.7))]" />

      <style jsx>{`
        @keyframes floatA {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(6%, 4%, 0) scale(1.05);
          }
          50% {
            transform: translate3d(2%, -3%, 0) scale(0.98);
          }
          75% {
            transform: translate3d(-5%, 3%, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes floatB {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          20% {
            transform: translate3d(-5%, 6%, 0) scale(1.04);
          }
          50% {
            transform: translate3d(-2%, -4%, 0) scale(1.01);
          }
          80% {
            transform: translate3d(4%, -2%, 0) scale(0.99);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes floatC {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          30% {
            transform: translate3d(3%, -6%, 0) scale(1.02);
          }
          60% {
            transform: translate3d(-4%, 2%, 0) scale(0.97);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

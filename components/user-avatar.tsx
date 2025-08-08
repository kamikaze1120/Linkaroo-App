"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { UserIcon, Camera, X } from 'lucide-react'

type UserAvatarProps = {
  size?: number // px
  className?: string
  ring?: boolean
  onClick?: () => void
  alt?: string
}

const AVATAR_KEY = "linkaroo:avatar"

export function UserAvatar({ size = 64, className, ring, onClick, alt = "Profile picture" }: UserAvatarProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_KEY)
      if (saved) setSrc(saved)
    } catch {}
  }, [])

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-white/10 flex items-center justify-center select-none",
        ring && "ring-2 ring-white/15",
        className
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt}
      onClick={onClick}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <UserIcon className="h-1/2 w-1/2 text-white/70" />
      )}
    </div>
  )
}

type AvatarUploaderProps = {
  buttonClassName?: string
  onChange?: (dataUrl: string | null) => void
  compact?: boolean
}

export function AvatarUploader({ buttonClassName, onChange, compact = false }: AvatarUploaderProps) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handlePick = () => inputRef.current?.click()

  const handleFile = async (file: File) => {
    setBusy(true)
    try {
      const dataUrl = await resizeToDataURL(file, 512)
      localStorage.setItem(AVATAR_KEY, dataUrl)
      onChange?.(dataUrl)
    } catch (e) {
      console.error("Avatar upload failed", e)
    } finally {
      setBusy(false)
    }
  }

  const onInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
    // reset input to allow re-picking same file
    if (inputRef.current) inputRef.current.value = ""
  }

  const remove = useCallback(() => {
    localStorage.removeItem(AVATAR_KEY)
    onChange?.(null)
  }, [onChange])

  return (
    <div className={cn("flex items-center gap-2", compact ? "gap-1" : "gap-2")}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInput}
      />
      <button
        type="button"
        onClick={handlePick}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-colors",
          buttonClassName
        )}
        disabled={busy}
        aria-busy={busy}
      >
        <Camera className="h-4 w-4" />
        {busy ? "Uploading..." : "Change Photo"}
      </button>
      <button
        type="button"
        onClick={remove}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-transparent hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
        )}
        disabled={busy}
      >
        <X className="h-4 w-4" />
        Remove
      </button>
    </div>
  )
}

// Resize uploaded image to a max square and return data URL (JPEG ~0.9)
async function resizeToDataURL(file: File, max: number): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap
  const scale = Math.min(1, max / Math.max(width, height))
  const targetW = Math.round(width * scale)
  const targetH = Math.round(height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")
  ctx.drawImage(bitmap, 0, 0, targetW, targetH)
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
  return dataUrl
}

export function getStoredAvatar(): string | null {
  try {
    return localStorage.getItem(AVATAR_KEY)
  } catch {
    return null
  }
}

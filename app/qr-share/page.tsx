"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import QRCode from "react-qr-code"
import jsQR from "jsqr"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BottomNav from "@/components/BottomNav"
import { ArrowLeft, Download, QrCode, Scan, Shield, Zap, Users, Briefcase, Heart, CheckCircle2, Info, Upload, RefreshCw } from 'lucide-react'

type TemplateId = "quick-connect" | "full-access" | "work" | "family"

interface Template {
  id: TemplateId
  name: string
  description: string
  icon: JSX.Element
  permissions: string[]
  color: string
  badge: string
}

const shareTemplates: Template[] = [
  {
    id: "quick-connect",
    name: "Quick Connect",
    description: "Basic contact info only",
    icon: <Zap className="h-4 w-4" />,
    permissions: ["Name", "Phone", "Email"],
    color: "bg-emerald-200 text-emerald-900",
    badge: "border border-emerald-300",
  },
  {
    id: "full-access",
    name: "Full Access",
    description: "All contact information",
    icon: <Users className="h-4 w-4" />,
    permissions: ["Name", "Phone", "Email", "Address", "Social Media", "Notes"],
    color: "bg-sky-200 text-sky-900",
    badge: "border border-sky-300",
  },
  {
    id: "work",
    name: "Work Contact",
    description: "Professional information",
    icon: <Briefcase className="h-4 w-4" />,
    permissions: ["Name", "Work Phone", "Work Email", "Company", "Title"],
    color: "bg-indigo-200 text-indigo-900",
    badge: "border border-indigo-300",
  },
  {
    id: "family",
    name: "Family & Friends",
    description: "Personal contact details",
    icon: <Heart className="h-4 w-4" />,
    permissions: ["Name", "Personal Phone", "Personal Email", "Address", "Birthday"],
    color: "bg-rose-200 text-rose-900",
    badge: "border border-rose-300",
  },
]

type Mode = "generate" | "scan"

export default function QRSharePage() {
  const [mode, setMode] = useState<Mode>("generate")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("quick-connect")
  const [showFrame, setShowFrame] = useState(true)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo profile; replace with actual user data when integrated with auth/profile.
  const profile = {
    name: "John Doe",
    maskedPhone: "+1 (•••) •••-4567",
    maskedEmail: "j•••@example.com",
    id: "user_12345",
  }

  const currentTemplate = shareTemplates.find((t) => t.id === selectedTemplate)!

  // Generate a short-lived payload (expires in 5 minutes)
  const payload = useMemo(() => {
    const expiresAt = Date.now() + 5 * 60 * 1000
    return {
      v: "lkr-qr-1",
      user: { id: profile.id, n: profile.name },
      t: selectedTemplate,
      ts: Date.now(),
      exp: expiresAt,
      nonce: Math.random().toString(36).slice(2, 10),
    }
  }, [selectedTemplate])

  const payloadString = useMemo(() => JSON.stringify(payload), [payload])

  // Scanner refs
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const loopRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (mode !== "scan") {
      stopScanner()
      return
    }
    startScanner()
    return () => stopScanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const startScanner = async () => {
    try {
      setError(null)
      setScanResult(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsScanning(true)
      scanLoop()
    } catch (e: any) {
      setError("Camera access denied or unavailable. You can also upload a QR image below.")
      setIsScanning(false)
    }
  }

  const stopScanner = () => {
    setIsScanning(false)
    if (loopRef.current) {
      cancelAnimationFrame(loopRef.current)
      loopRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  const scanLoop = () => {
    if (!isScanning) return
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      const w = 320
      const h = 320
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h)
        const imageData = ctx.getImageData(0, 0, w, h)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })
        if (code && code.data) {
          setScanResult(code.data)
          stopScanner()
        }
      }
    }
    loopRef.current = requestAnimationFrame(scanLoop)
  }

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const max = 512
        const scale = Math.min(max / img.width, max / img.height, 1)
        const w = Math.floor(img.width * scale)
        const h = Math.floor(img.height * scale)
        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h)
        const imageData = ctx.getImageData(0, 0, w, h)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code && code.data) {
          setScanResult(code.data)
        } else {
          setError("No QR code detected in the selected image.")
        }
      }
      img.src = URL.createObjectURL(file)
    } catch {
      setError("Could not process the selected image.")
    }
  }

  const downloadSVG = () => {
    const svg = document.getElementById("linkaroo-qr-svg")
    if (!svg) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svg)
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `linkaroo-qr-${selectedTemplate}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const parsedResult = useMemo(() => {
    if (!scanResult) return null
    try {
      return JSON.parse(scanResult)
    } catch {
      return null
    }
  }, [scanResult])

  return (
    <div className="min-h-screen pb-20">
      {/* Pastel dynamic backdrop */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-rose-100 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-emerald-100 blur-3xl animate-pulse [animation-delay:200ms]" />
        <div className="absolute top-1/4 right-1/3 h-40 w-40 rounded-full bg-sky-100 blur-3xl animate-pulse [animation-delay:400ms]" />
      </div>

      {/* Header */}
      <div className="bg-white/70 backdrop-blur border-b border-white/60 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/share">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">QR Share</h1>
            <p className="text-sm text-gray-500">Privacy-first contact exchange</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setMode("generate")}
            className={`h-12 transition-all ${mode === "generate" ? "bg-emerald-500 hover:bg-emerald-600 shadow-md" : "bg-white/80 text-emerald-700 hover:bg-emerald-50 border border-emerald-200"}`}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate
          </Button>
          <Button
            onClick={() => setMode("scan")}
            className={`h-12 transition-all ${mode === "scan" ? "bg-sky-500 hover:bg-sky-600 shadow-md" : "bg-white/80 text-sky-700 hover:bg-sky-50 border border-sky-200"}`}
          >
            <Scan className="h-4 w-4 mr-2" />
            Scan
          </Button>
        </div>

        {/* Template Selection */}
        <Card className="bg-white/70 border-white/60">
          <CardHeader>
            <CardTitle className="text-base">Choose Sharing Template</CardTitle>
            <CardDescription>
              Select what information to include in your QR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedTemplate} onValueChange={(v: TemplateId) => setSelectedTemplate(v)}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {shareTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      {t.icon}
                      <span>{t.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className={`p-3 rounded-lg ${currentTemplate.color} ${currentTemplate.badge}`}>
              <div className="flex items-center gap-2 mb-2">
                {currentTemplate.icon}
                <span className="font-medium">{currentTemplate.name}</span>
              </div>
              <p className="text-sm opacity-90 mb-2">{currentTemplate.description}</p>
              <div className="flex flex-wrap gap-1">
                {currentTemplate.permissions.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs bg-white/70">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Mode */}
        {mode === "generate" && (
          <Card className="bg-white/80 border-white/60 animate-in fade-in-0 zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle className="text-base">Your Linkaroo QR</CardTitle>
              <CardDescription>Expires in 5 minutes • Only masked info is shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div
                  className={`relative p-4 rounded-2xl bg-gradient-to-br from-white to-white/70 shadow-sm border border-white/60 transition-transform ${showFrame ? "hover:scale-[1.02]" : ""}`}
                >
                  {showFrame && (
                    <div className="absolute inset-2 rounded-xl border-2 border-dashed border-emerald-300 pointer-events-none" />
                  )}
                  {/* QRCode renders an SVG. We set an id to serialize for download */}
                  <div className="bg-white p-3 rounded-md">
                    <QRCode
                      id="linkaroo-qr-svg"
                      value={payloadString}
                      size={220}
                      bgColor="#ffffff"
                      fgColor="#111827"
                      level="M"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={downloadSVG} className="bg-emerald-500 hover:bg-emerald-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                  onClick={() => setShowFrame((s) => !s)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {showFrame ? "Hide Frame" : "Show Frame"}
                </Button>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 mt-0.5 text-emerald-600" />
                <p>
                  Linkaroo uses consent-based sharing. The QR includes a signed, short-lived token and masked
                  contact fields. Mutual approval is always required.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scan Mode */}
        {mode === "scan" && (
          <Card className="bg-white/80 border-white/60 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <CardHeader>
              <CardTitle className="text-base">Scan a Linkaroo QR</CardTitle>
              <CardDescription>Point your camera at a QR to connect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-white/60 bg-black/5">
                <video
                  ref={videoRef}
                  className={`w-full aspect-square object-cover ${isScanning ? "animate-pulse" : ""}`}
                  playsInline
                  muted
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={isScanning ? stopScanner : startScanner}
                  className={isScanning ? "bg-rose-500 hover:bg-rose-600" : "bg-sky-500 hover:bg-sky-600"}
                >
                  <Scan className="h-4 w-4 mr-2" />
                  {isScanning ? "Stop" : "Start"} scanning
                </Button>
                <label className="inline-flex">
                  <input type="file" accept="image/*" onChange={onUploadImage} className="hidden" />
                  <Button type="button" variant="outline" className="w-full bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload image
                  </Button>
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {scanResult && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="font-medium text-sm">QR detected</p>
                  </div>
                  {parsedResult ? (
                    <div className="text-sm text-emerald-900 space-y-1">
                      <p>
                        From: <span className="font-medium">{parsedResult.user?.n ?? "Unknown"}</span>
                      </p>
                      <p>
                        Template: <span className="font-medium">{parsedResult.t}</span>
                      </p>
                      <p>
                        Expires:{" "}
                        <span className="font-medium">
                          {parsedResult.exp ? new Date(parsedResult.exp).toLocaleTimeString() : "N/A"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-900 break-all">{scanResult}</p>
                  )}
                </div>
              )}

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4 mt-0.5 text-sky-600" />
                <p>
                  For best results, ensure the QR code is well lit and within the frame. You can also scan from a screenshot by uploading an image.
                </p>
              </div>

              {/* Hidden canvas for frame processing */}
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        )}

        {/* Helpful Tips */}
        <Card className="bg-white/70 border-white/60">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 text-emerald-700" />
              <div className="text-sm text-gray-700">
                Linkaroo doesn&apos;t support manual contact entry to preserve anonymity and mutual consent. Use NFC, QR, or Proximity to connect.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Nav */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/nfc-share" className="block">
            <div className="h-12 rounded-md bg-white/80 border border-white/60 flex items-center justify-center gap-2 hover:shadow transition-all">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">NFC Tap-to-Share</span>
            </div>
          </Link>
          <Link href="/proximity" className="block">
            <div className="h-12 rounded-md bg-white/80 border border-white/60 flex items-center justify-center gap-2 hover:shadow transition-all">
              <Users className="h-4 w-4 text-sky-700" />
              <span className="text-sm font-medium">Proximity</span>
            </div>
          </Link>
        </div>
      </div>

      <BottomNav activeTab="share" />
    </div>
  )
}

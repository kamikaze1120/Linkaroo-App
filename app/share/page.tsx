"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, QrCode, Radar, Shield, Share2, Smartphone, ArrowLeft } from 'lucide-react'
import BottomNav from "@/components/BottomNav"
import AnimatedBackdrop from "@/components/animated-backdrop"
import { UserAvatar } from "@/components/user-avatar"

type Method = {
  id: "nfc" | "proximity" | "qr"
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  badge: string
  badgeColor: string
  features: string[]
}

export default function SharePage() {
  // Only 3 methods — manual is fully removed to preserve anonymity.
  const methods = useMemo<Method[]>(
    () => [
      {
        id: "nfc",
        title: "NFC Tap-to-Share",
        description: "Instant connection with a simple tap",
        icon: <Zap className="h-6 w-6" />,
        href: "/nfc-share",
        color: "from-amber-300 to-rose-300",
        badge: "Fastest",
        badgeColor: "bg-amber-400/80 text-amber-950",
        features: ["< 2s", "Ultra-secure", "Offline"],
      },
      {
        id: "proximity",
        title: "Proximity Detection",
        description: "Auto-discover nearby users",
        icon: <Radar className="h-6 w-6" />,
        href: "/proximity",
        color: "from-teal-300 to-emerald-300",
        badge: "New",
        badgeColor: "bg-teal-400/80 text-teal-950",
        features: ["Auto", "10m range", "Live"],
      },
      {
        id: "qr",
        title: "QR Code Sharing",
        description: "Universal compatibility",
        icon: <QrCode className="h-6 w-6" />,
        href: "/qr-share",
        color: "from-violet-300 to-fuchsia-300",
        badge: "Universal",
        badgeColor: "bg-violet-400/80 text-violet-950",
        features: ["Any device", "Camera", "Long range"],
      },
    ],
    []
  )

  const quickStats = [
    { title: "Shares", value: "47", hint: "+12 this week", tint: "text-emerald-300" },
    { title: "NFC", value: "28", hint: "59% of total", tint: "text-amber-300" },
    { title: "Success", value: "94%", hint: "Excellent", tint: "text-rose-300" },
  ]

  function timeAgo(ts: number) {
    const m = Math.floor((Date.now() - ts) / 60000)
    if (m < 1) return "Just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const recent = [
    { id: "1", name: "Sarah J.", method: "NFC", t: Date.now() - 300_000, status: "connected", badge: "bg-emerald-400/20 text-emerald-300" },
    { id: "2", name: "Mike C.", method: "Proximity", t: Date.now() - 600_000, status: "connected", badge: "bg-teal-400/20 text-teal-300" },
    { id: "3", name: "Emma D.", method: "QR", t: Date.now() - 900_000, status: "pending", badge: "bg-amber-400/20 text-amber-300" },
  ]

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white pb-24">
      <AnimatedBackdrop intensity="normal" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Share</h1>
            <p className="text-xs text-white/70">Choose how to securely connect — manual entry is disabled for privacy</p>
          </div>
          <div className="ml-auto">
            <UserAvatar size={28} ring className="cursor-pointer hover:ring-white/25 transition" alt="Your profile" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 p-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((s) => (
            <Card key={s.title} className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-semibold ${s.tint}`}>{s.value}</div>
                <div className="text-xs text-white/80">{s.title}</div>
                <div className="text-[11px] text-white/50">{s.hint}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured NFC */}
        <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-200/15 p-3 text-amber-300 ring-1 ring-amber-300/20">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">NFC Tap-to-Share</CardTitle>
                  <CardDescription className="text-white/75">The fastest, most secure way to share</CardDescription>
                </div>
              </div>
              <Badge className="rounded-full bg-amber-300/20 px-2 py-1 text-xs font-medium text-amber-200 ring-1 ring-amber-300/30">
                Recommended
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="mb-4 grid grid-cols-3 gap-3 text-center text-[11px] text-white/70">
              <div>
                <div className="font-semibold text-amber-200">⚡ Instant</div>
                <div className="text-white/80">{"< 2s"}</div>
              </div>
              <div>
                <div className="font-semibold text-rose-200">🔒 Secure</div>
                <div className="text-white/80">4cm range</div>
              </div>
              <div>
                <div className="font-semibold text-amber-200">📱 Offline</div>
                <div className="text-white/80">No internet</div>
              </div>
            </div>
            <Link href="/nfc-share" className="block">
              <Button className="group w-full border border-white/15 bg-white/8 text-white hover:bg-white/15">
                <Zap className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Start NFC Sharing
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Methods grid (Manual removed) */}
        <section>
          <h2 className="mb-3 text-sm font-medium text-white/80">All Methods</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {methods.map((m) => (
              <Link key={m.id} href={m.href} className="group">
                <Card className="bg-white/5 ring-1 ring-white/10 transition-all hover:bg-white/8 hover:shadow-lg hover:shadow-black/30">
                  <CardHeader className="space-y-2">
                    <div className="w-12 rounded-xl bg-gradient-to-br p-3 text-neutral-900 shadow-sm transition-transform group-hover:scale-105 group-active:scale-100"
                      style={{ backgroundImage: `linear-gradient(135deg,var(--tw-gradient-from),var(--tw-gradient-to))` }}
                    >
                      <span className={`sr-only`}>{m.title}</span>
                      <div className={`from-rose-300 to-rose-300 hidden`} />
                      <div className={`from-teal-300 to-emerald-300 hidden`} />
                      <div className={`from-violet-300 to-fuchsia-300 hidden`} />
                      {/* Using tailwind gradient via class on parent */}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`rounded-xl bg-gradient-to-br ${m.color} p-2 text-neutral-900`}>{m.icon}</div>
                      <CardTitle className="text-base">{m.title}</CardTitle>
                      <Badge className={`ml-auto ${m.badgeColor}`}>{m.badge}</Badge>
                    </div>
                    <CardDescription className="text-white/70">{m.description}</CardDescription>
                    <div className="flex gap-2">
                      {m.features.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/75 backdrop-blur transition-colors"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy note — clarifies no manual/direct entry */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="rounded-md bg-emerald-300/80 p-2 text-emerald-950">
              <Shield className="h-4 w-4" />
            </div>
            <p className="text-sm text-white/80">
              Linkaroo does not support manual contact entry to protect anonymity and ensure mutual consent.
              Use NFC, QR, or Proximity to connect securely.
            </p>
          </CardContent>
        </Card>

        {/* Quick CTA row */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/nfc-share" className="block">
            <div className="group flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-black/30">
              <Smartphone className="h-4 w-4 text-amber-300 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">NFC</span>
            </div>
          </Link>
          <Link href="/qr-share" className="block">
            <div className="group flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-black/30">
              <QrCode className="h-4 w-4 text-violet-300 transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">QR</span>
            </div>
          </Link>
        </div>

        {/* Recent activity (no direct/manual mentions) */}
        <section className="space-y-2">
          <h3 className="text-sm font-medium text-white/80">Recent Activity</h3>
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm">{r.name}</div>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] ${r.badge}`}>{r.method}</span>
                  </div>
                  <div className="text-[11px] text-white/60">{timeAgo(r.t)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeTab="share" />
    </div>
  )
}

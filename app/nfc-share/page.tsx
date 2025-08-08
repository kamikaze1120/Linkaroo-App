"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Zap, QrCode, Users, Briefcase, Heart, Shield, Clock, Radar, MapPin } from 'lucide-react'
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import NFCManager from "@/components/NFCManager"
import ConsentFlow from "@/components/ConsentFlow"
import AnimatedBackdrop from "@/components/animated-backdrop"

interface Template {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  permissions: string[]
  color: string
}

const shareTemplates: Template[] = [
  {
    id: "quick-connect",
    name: "Quick Connect",
    description: "Basic contact info only",
    icon: <Zap className="h-4 w-4" />,
    permissions: ["Name", "Phone", "Email"],
    color: "bg-emerald-400",
  },
  {
    id: "full-access",
    name: "Full Access",
    description: "All contact information",
    icon: <Users className="h-4 w-4" />,
    permissions: ["Name", "Phone", "Email", "Address", "Social Media", "Notes"],
    color: "bg-sky-400",
  },
  {
    id: "work",
    name: "Work Contact",
    description: "Professional information",
    icon: <Briefcase className="h-4 w-4" />,
    permissions: ["Name", "Work Phone", "Work Email", "Company", "Title"],
    color: "bg-indigo-400",
  },
  {
    id: "family",
    name: "Family & Friends",
    description: "Personal contact details",
    icon: <Heart className="h-4 w-4" />,
    permissions: ["Name", "Personal Phone", "Personal Email", "Address", "Birthday"],
    color: "bg-rose-400",
  },
]

const recentConnections = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    template: "work",
    timestamp: Date.now() - 300000,
    method: "nfc",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@example.com",
    template: "quick-connect",
    timestamp: Date.now() - 600000,
    method: "nfc",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@example.com",
    template: "family",
    timestamp: Date.now() - 900000,
    method: "nfc",
  },
]

export default function NFCSharePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("quick-connect")
  const [shareComplete, setShareComplete] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<any>(null)

  const currentTemplate = shareTemplates.find((t) => t.id === selectedTemplate)

  const shareData = {
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john@example.com",
    template: selectedTemplate,
  }

  const handleDataReceived = (data: any) => {
    const consentRequest = {
      id: `nfc_${Date.now()}`,
      requesterName: data.name,
      requesterMaskedId: data.phone,
      requesterAvatar: data.name
        .split(" ")
        .map((n: string) => n[0])
        .join(""),
      message: `Shared via NFC tap at ${new Date().toLocaleTimeString()}`,
      timestamp: data.timestamp,
      expiresAt: data.expires,
      requestType: "nfc" as const,
      permissions: {
        call: data.template === "work" || data.template === "family",
        message: true,
        shareProfile: data.template === "family",
      },
    }
    setPendingRequest(consentRequest)
  }

  const handleWriteComplete = () => {
    setShareComplete(true)
    setTimeout(() => setShareComplete(false), 3000)
  }

  const handleApproveRequest = () => setPendingRequest(null)
  const handleRejectRequest = () => setPendingRequest(null)
  const handleBlockUser = () => setPendingRequest(null)

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackdrop intensity="normal" />

      {/* Header */}
      <div className="bg-white/10 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/share">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">NFC Tap-to-Share</h1>
              <p className="text-sm text-white/70">Instant contact sharing</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/proximity">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Radar className="h-4 w-4 mr-1" />
                Proximity
              </Button>
            </Link>
            <Zap className="h-6 w-6 text-amber-300" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Template Selection */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-white">Choose Sharing Template</CardTitle>
            <CardDescription className="text-white/70">
              Select what information to share when someone taps your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {shareTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <span>{template.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentTemplate && (
              <div className="p-3 bg-white/10 border border-white/15 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${currentTemplate.color}`}></div>
                  <span className="font-medium text-white">{currentTemplate.name}</span>
                </div>
                <p className="text-sm text-white/80 mb-2">{currentTemplate.description}</p>
                <div className="flex flex-wrap gap-1">
                  {currentTemplate.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* NFC Manager */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardContent className="p-4">
            <NFCManager
              mode="both"
              shareData={{
                ...shareData,
                template: selectedTemplate,
              }}
              onDataReceived={handleDataReceived}
              onWriteComplete={handleWriteComplete}
            />
            {shareComplete && (
              <div className="mt-3 text-sm text-emerald-200">NFC payload written successfully.</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Access to Proximity Detection */}
        <Card className="border-sky-200/30 bg-sky-300/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2 text-white">
              <Radar className="h-4 w-4 text-sky-300" />
              <span>Proximity Detection</span>
              <Badge className="bg-sky-400 text-slate-900">New</Badge>
            </CardTitle>
            <CardDescription className="text-white/70">
              Find nearby Linkaroo users automatically without touching devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-sky-300/20 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-sky-300" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">Auto-Discovery</h4>
                <p className="text-sm text-white/70">Detect users within 10 meters range</p>
              </div>
            </div>
            <Link href="/proximity">
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                <Radar className="h-4 w-4 mr-2" />
                Enable Proximity Detection
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Method Comparison */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-white">Connection Methods Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-amber-300/15 rounded-lg border border-amber-200/20">
                <Zap className="h-5 w-5 text-amber-300" />
                <div className="flex-1">
                  <p className="font-medium text-white">NFC Tap-to-Share</p>
                  <p className="text-sm text-white/70">Instant connection with physical tap • 4cm range</p>
                </div>
                <Badge className="bg-amber-400 text-slate-900">Fastest</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-sky-300/15 rounded-lg border border-sky-200/20">
                <Radar className="h-5 w-5 text-sky-300" />
                <div className="flex-1">
                  <p className="font-medium text-white">Proximity Detection</p>
                  <p className="text-sm text-white/70">Auto-discover nearby users • 10m range</p>
                </div>
                <Badge className="bg-sky-400 text-slate-900">Automatic</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-emerald-300/15 rounded-lg border border-emerald-200/20">
                <QrCode className="h-5 w-5 text-emerald-300" />
                <div className="flex-1">
                  <p className="font-medium text-white">QR Code Sharing</p>
                  <p className="text-sm text-white/70">Works on all devices • Longer range</p>
                </div>
                <Badge className="bg-emerald-400 text-slate-900">Universal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent NFC Connections */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-white">Recent NFC Connections</CardTitle>
            <CardDescription className="text-white/70">Contacts shared via NFC tap-to-share</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentConnections.map((connection) => {
                const template = shareTemplates.find((t) => t.id === connection.template)
                return (
                  <div key={connection.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${template?.color || "bg-white/40"}`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white">{connection.name}</p>
                      <p className="text-xs text-white/70">{connection.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs mb-1 border-white/20 text-white">
                        {template?.name || "Unknown"}
                      </Badge>
                      <p className="text-xs text-white/70 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(connection.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alternative Methods (no manual, QR + Proximity only) */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-white">Alternative Sharing Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/qr-share">
                <Button variant="outline" className="w-full justify-center bg-transparent flex-col h-16 p-2 border-white/20 text-white hover:bg-white/10">
                  <QrCode className="h-4 w-4 mb-1 text-emerald-300" />
                  <span className="text-xs">QR Code</span>
                </Button>
              </Link>
              <Link href="/proximity">
                <Button variant="outline" className="w-full justify-center bg-transparent flex-col h-16 p-2 border-white/20 text-white hover:bg-white/10">
                  <Radar className="h-4 w-4 mb-1 text-sky-300" />
                  <span className="text-xs">Proximity</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="border-emerald-200/30 bg-emerald-300/10 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-emerald-300 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Advanced Security</h4>
                <ul className="text-xs text-white/80 space-y-1">
                  <li>{'•'} NFC data expires in 5 minutes automatically</li>
                  <li>{'•'} Only masked contact information is transmitted</li>
                  <li>{'•'} Mutual consent required for all connections</li>
                  <li>{'•'} End-to-end encryption for all data transfer</li>
                  <li>{'•'} Proximity detection uses local protocols only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Request Modal */}
      {pendingRequest && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <ConsentFlow
              request={pendingRequest}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onBlock={handleBlockUser}
            />
          </div>
        </div>
      )}

      <BottomNav activeTab="share" />
    </div>
  )
}

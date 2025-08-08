"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { QrCode, Zap, Edit3, Share2, Radar, Clock, Shield } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

const sharingMethods = [
  {
    id: "nfc",
    title: "NFC Tap-to-Share",
    description: "Instant connection with a simple tap",
    icon: <Zap className="h-6 w-6" />,
    href: "/nfc-share",
    color: "bg-orange-500 hover:bg-orange-600",
    features: ["⚡ Instant (< 2 seconds)", "🔒 Ultra-secure (4cm range)", "📱 Works offline"],
    badge: "Fastest",
    badgeColor: "bg-orange-600",
  },
  {
    id: "proximity",
    title: "Proximity Detection",
    description: "Auto-discover nearby users",
    icon: <Radar className="h-6 w-6" />,
    href: "/proximity",
    color: "bg-blue-500 hover:bg-blue-600",
    features: ["📡 Auto-discovery", "📍 10m range", "🔄 Continuous scanning"],
    badge: "New",
    badgeColor: "bg-blue-600",
  },
  {
    id: "qr",
    title: "QR Code Sharing",
    description: "Universal compatibility",
    icon: <QrCode className="h-6 w-6" />,
    href: "/qr-share",
    color: "bg-green-500 hover:bg-green-600",
    features: ["📱 Works on any device", "📷 Camera required", "🎯 Long range"],
    badge: "Universal",
    badgeColor: "bg-green-600",
  },
  {
    id: "manual",
    title: "Manual Entry",
    description: "Direct contact sharing",
    icon: <Edit3 className="h-6 w-6" />,
    href: "/manual-share",
    color: "bg-purple-500 hover:bg-purple-600",
    features: ["⌨️ Type contact details", "✅ Always works", "🔗 No hardware needed"],
    badge: "Reliable",
    badgeColor: "bg-purple-600",
  },
]

const recentShares = [
  {
    id: "1",
    name: "Sarah Johnson",
    method: "NFC",
    timestamp: Date.now() - 300000,
    status: "connected",
    avatar: "SJ",
  },
  {
    id: "2",
    name: "Mike Chen",
    method: "Proximity",
    timestamp: Date.now() - 600000,
    status: "connected",
    avatar: "MC",
  },
  {
    id: "3",
    name: "Emma Davis",
    method: "QR Code",
    timestamp: Date.now() - 900000,
    status: "pending",
    avatar: "ED",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    method: "NFC",
    timestamp: Date.now() - 1200000,
    status: "connected",
    avatar: "AR",
  },
]

const quickStats = [
  {
    title: "Total Shares",
    value: "47",
    change: "+12 this week",
    color: "text-blue-600",
  },
  {
    title: "NFC Connections",
    value: "28",
    change: "59% of total",
    color: "text-orange-600",
  },
  {
    title: "Success Rate",
    value: "94%",
    change: "Excellent",
    color: "text-green-600",
  },
]

export default function SharePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "nfc":
        return <Zap className="h-3 w-3 text-orange-600" />
      case "proximity":
        return <Radar className="h-3 w-3 text-blue-600" />
      case "qr code":
        return <QrCode className="h-3 w-3 text-green-600" />
      case "manual":
        return <Edit3 className="h-3 w-3 text-purple-600" />
      default:
        return <Share2 className="h-3 w-3 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Share Contacts</h1>
            <p className="text-sm text-gray-500">Choose how to connect with others</p>
          </div>
          <Share2 className="h-6 w-6 text-blue-500" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <p className="text-xs font-medium text-gray-900 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured: NFC Tap-to-Share */}
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">NFC Tap-to-Share</h3>
                  <p className="text-sm text-gray-600">The fastest way to share contacts</p>
                </div>
              </div>
              <Badge className="bg-orange-600 text-white">Recommended</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
              <div className="text-center">
                <div className="font-semibold text-orange-700">⚡ Instant</div>
                <div className="text-gray-600">&lt; 2 seconds</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-700">🔒 Secure</div>
                <div className="text-gray-600">4cm range</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-700">📱 Offline</div>
                <div className="text-gray-600">No internet</div>
              </div>
            </div>

            <Link href="/nfc-share">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <Zap className="h-4 w-4 mr-2" />
                Start NFC Sharing
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Sharing Methods Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Sharing Methods</h2>
          <div className="grid grid-cols-1 gap-4">
            {sharingMethods.map((method) => (
              <Link key={method.id} href={method.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${method.color}`}
                      >
                        {method.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{method.title}</h3>
                          <Badge className={`text-xs ${method.badgeColor} text-white`}>{method.badge}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                        <div className="space-y-1">
                          {method.features.map((feature, index) => (
                            <div key={index} className="text-xs text-gray-500">
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Search Existing Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Share with Existing Contact</CardTitle>
            <CardDescription>Send your contact info to someone you know</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {searchQuery && (
              <div className="text-center text-gray-500 text-sm">Search results would appear here...</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sharing Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest contact sharing sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentShares.map((share) => (
                <div key={share.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-medium text-sm">{share.avatar}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{share.name}</h4>
                      <Badge className={`text-xs ${getStatusColor(share.status)}`}>{share.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        {getMethodIcon(share.method)}
                        <span>{share.method}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(share.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips & Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Sharing Best Practices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Use NFC for face-to-face meetings</span>
                  <p className="text-gray-600 text-xs">Fastest and most secure method for in-person connections</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Enable proximity detection at events</span>
                  <p className="text-gray-600 text-xs">Automatically discover other Linkaroo users nearby</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">QR codes work across all devices</span>
                  <p className="text-gray-600 text-xs">Best option when other person doesn't have NFC</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Manual entry as backup</span>
                  <p className="text-gray-600 text-xs">Always available when technology fails</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Reminder */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-900 mb-1">Your Privacy is Protected</h4>
                <p className="text-xs text-green-700">
                  All sharing methods use masked contact information. Your real phone number is never shared directly
                  with other users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="share" />
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QrCode, Bell, Shield, Users, Clock, Smartphone, MapPin, Brain, Search } from 'lucide-react'
import BottomNav from "@/components/BottomNav"
import NFCQuickShare from "@/components/NFCQuickShare"
import AnimatedBackdrop from "@/components/animated-backdrop"

const contacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastContact: "2 hours ago",
    connectionType: "work",
    hasNFC: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@startup.io",
    phone: "+1 (555) 234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastContact: "1 day ago",
    connectionType: "work",
    hasNFC: true,
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+1 (555) 345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "pending",
    lastContact: "Never",
    connectionType: "personal",
    hasNFC: false,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    email: "alex@company.com",
    phone: "+1 (555) 456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    lastContact: "3 days ago",
    connectionType: "work",
    hasNFC: true,
  },
]

const quickStats = [
  {
    title: "Total Connections",
    value: "24",
    change: "+3 this week",
    icon: <Users className="h-4 w-4" />,
    color: "text-emerald-300",
  },
  {
    title: "Pending Requests",
    value: "5",
    change: "2 new today",
    icon: <Clock className="h-4 w-4" />,
    color: "text-rose-300",
  },
  {
    title: "NFC Shares",
    value: "12",
    change: "+8 this week",
    icon: <Smartphone className="h-4 w-4" />,
    color: "text-amber-300",
  },
  {
    title: "Privacy Score",
    value: "98%",
    change: "Excellent",
    icon: <Shield className="h-4 w-4" />,
    color: "text-sky-300",
  },
]

const quickActions = [
  {
    title: "NFC Share",
    description: "Tap to share instantly",
    icon: <Smartphone className="h-5 w-5" />,
    href: "/nfc-share",
    color: "from-amber-200/70 to-amber-300/70",
    badge: "New",
  },
  {
    title: "QR Code",
    description: "Generate sharing code",
    icon: <QrCode className="h-5 w-5" />,
    href: "/qr-share",
    color: "from-emerald-200/70 to-emerald-300/70",
  },
  {
    title: "AI Insights",
    description: "Smart recommendations",
    icon: <Brain className="h-5 w-5" />,
    href: "/ai-insights",
    color: "from-indigo-200/70 to-indigo-300/70",
  },
  {
    title: "Location",
    description: "Nearby connections",
    icon: <MapPin className="h-5 w-5" />,
    href: "/location",
    color: "from-sky-200/70 to-sky-300/70",
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-300/20 text-emerald-200"
      case "pending":
        return "bg-amber-300/20 text-amber-200"
      default:
        return "bg-white/10 text-white/80"
    }
  }

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-sky-300/20 text-sky-200"
      case "personal":
        return "bg-rose-300/20 text-rose-200"
      default:
        return "bg-white/10 text-white/80"
    }
  }

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackdrop intensity="subtle" />

      {/* Header */}
      <div className="bg-white/10 backdrop-blur border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            <p className="text-sm text-white/70">Manage your secure connections</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/requests">
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px] bg-rose-500">3</Badge>
              </Button>
            </Link>
            <Link href="/profile" className="group">
              <Avatar className="h-8 w-8 ring-1 ring-white/20 group-hover:ring-white/40 transition">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/10 border-white/15 backdrop-blur hover:bg-white/15 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={stat.color}>{stat.icon}</div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-sm font-medium text-white">{stat.title}</p>
                <p className="text-xs text-white/70">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-white">Quick Actions</CardTitle>
            <CardDescription className="text-white/70">Fast access to sharing and connection features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="relative p-4 rounded-lg border border-white/15 bg-gradient-to-br hover:scale-[1.01] transition-all cursor-pointer group"
                    style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` }}
                  >
                    {action.badge && (
                      <Badge className="absolute -top-2 -right-2 text-xs bg-emerald-500 text-white shadow">
                        {action.badge}
                      </Badge>
                    )}
                    <div
                      className={`w-10 h-10 rounded-lg text-slate-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${action.color}`}
                    >
                      {action.icon}
                    </div>
                    <h3 className="font-medium text-sm mb-1 text-white">{action.title}</h3>
                    <p className="text-xs text-white/70">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/15 text-white placeholder:text-white/60"
          />
        </div>

        {/* Contacts List */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-white">Your Connections</CardTitle>
              <CardDescription className="text-white/70">
                {filteredContacts.length} of {contacts.length} contacts
              </CardDescription>
            </div>
            <Link href="/qr-share">
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <QrCode className="h-4 w-4 mr-1" />
                Share QR
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Avatar className="h-10 w-10 ring-1 ring-white/15">
                    <AvatarImage src={contact.avatar || "/placeholder.svg?height=40&width=40&query=avatar%20placeholder"} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate text-white">{contact.name}</p>
                      {contact.hasNFC && (
                        <Badge variant="secondary" className="text-[10px] bg-amber-300/20 text-amber-200 border-amber-200/30">
                          <Smartphone className="h-3 w-3 mr-1" />
                          NFC
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/70 truncate">{contact.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(contact.status)}`}>{contact.status}</Badge>
                      <Badge variant="outline" className={`text-xs border-white/20 ${getConnectionTypeColor(contact.connectionType)}`}>
                        {contact.connectionType}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {contact.hasNFC && (
                      <NFCQuickShare
                        contactName={contact.name}
                        contactPhone={contact.phone}
                        contactEmail={contact.email}
                      />
                    )}
                    <Link href="/qr-share">
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                        <QrCode className="h-4 w-4 mr-1" />
                        QR
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/10 border-white/15 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base text-white">Recent Activity</CardTitle>
            <CardDescription className="text-white/70">Latest connection requests and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-300/15 border border-amber-200/20">
                <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New NFC connection from Sarah Johnson</p>
                  <p className="text-xs text-white/70">2 minutes ago</p>
                </div>
                <Badge className="bg-amber-400 text-slate-900">NFC</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-300/15 border border-emerald-200/20">
                <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Contact request approved by Mike Chen</p>
                  <p className="text-xs text-white/70">1 hour ago</p>
                </div>
                <Badge className="bg-emerald-400 text-slate-900">Approved</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-sky-300/15 border border-sky-200/20">
                <div className="w-2 h-2 bg-sky-300 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">QR code scanned by Emma Davis</p>
                  <p className="text-xs text-white/70">3 hours ago</p>
                </div>
                <Badge className="bg-sky-400 text-slate-900">QR</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab="home" />
    </div>
  )
}

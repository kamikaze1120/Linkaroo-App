"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, QrCode, Bell, Shield, Users, Clock, Smartphone, MapPin, Brain } from "lucide-react"
import Link from "next/link"
import NFCQuickShare from "@/components/NFCQuickShare"

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
    color: "text-blue-600",
  },
  {
    title: "Pending Requests",
    value: "5",
    change: "2 new today",
    icon: <Clock className="h-4 w-4" />,
    color: "text-orange-600",
  },
  {
    title: "NFC Shares",
    value: "12",
    change: "+8 this week",
    icon: <Smartphone className="h-4 w-4" />,
    color: "text-green-600",
  },
  {
    title: "Privacy Score",
    value: "98%",
    change: "Excellent",
    icon: <Shield className="h-4 w-4" />,
    color: "text-purple-600",
  },
]

const quickActions = [
  {
    title: "NFC Share",
    description: "Tap to share instantly",
    icon: <Smartphone className="h-5 w-5" />,
    href: "/nfc-share",
    color: "bg-blue-500",
    badge: "New",
  },
  {
    title: "QR Code",
    description: "Generate sharing code",
    icon: <QrCode className="h-5 w-5" />,
    href: "/share",
    color: "bg-green-500",
  },
  {
    title: "AI Insights",
    description: "Smart recommendations",
    icon: <Brain className="h-5 w-5" />,
    href: "/ai-insights",
    color: "bg-purple-500",
  },
  {
    title: "Location",
    description: "Nearby connections",
    icon: <MapPin className="h-5 w-5" />,
    href: "/location",
    color: "bg-orange-500",
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
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case "work":
        return "bg-blue-100 text-blue-800"
      case "personal":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your secure connections</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/requests">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
              </Button>
            </Link>
            <Link href="/profile">
              <Avatar className="h-8 w-8">
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
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={stat.color}>{stat.icon}</div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Fast access to sharing and connection features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="relative p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group">
                    {action.badge && <Badge className="absolute -top-2 -right-2 text-xs">{action.badge}</Badge>}
                    <div
                      className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                    >
                      {action.icon}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contacts List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Your Connections</CardTitle>
              <CardDescription>
                {filteredContacts.length} of {contacts.length} contacts
              </CardDescription>
            </div>
            <Link href="/share">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{contact.name}</p>
                      {contact.hasNFC && (
                        <Badge variant="secondary" className="text-xs">
                          <Smartphone className="h-3 w-3 mr-1" />
                          NFC
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getStatusColor(contact.status)}`}>{contact.status}</Badge>
                      <Badge variant="outline" className={`text-xs ${getConnectionTypeColor(contact.connectionType)}`}>
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
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      QR
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest connection requests and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New NFC connection from Sarah Johnson</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <Badge variant="secondary">NFC</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Contact request approved by Mike Chen</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
                <Badge variant="secondary">Approved</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">QR code scanned by Emma Davis</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
                <Badge variant="secondary">QR</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

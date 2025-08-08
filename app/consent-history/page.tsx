"use client"

import { useState } from "react"
import { ArrowLeft, Shield, User, Phone, MessageCircle, Eye, Trash2, RotateCcw } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

export default function ConsentHistoryScreen() {
  const [connections, setConnections] = useState([
    {
      id: "conn_001",
      name: "Sarah Mitchell",
      avatar: "SM",
      maskedNumber: "+1 (555) 123-XXXX",
      status: "active",
      approvedAt: Date.now() - 86400000, // 1 day ago
      expiresAt: Date.now() + 518400000, // 6 days from now
      permissions: {
        call: true,
        message: true,
        shareProfile: false,
      },
      lastActivity: Date.now() - 3600000, // 1 hour ago
      activityCount: { calls: 3, messages: 12 },
    },
    {
      id: "conn_002",
      name: "Mike Johnson",
      avatar: "MJ",
      maskedNumber: "+1 (555) 456-XXXX",
      status: "active",
      approvedAt: Date.now() - 172800000, // 2 days ago
      expiresAt: Date.now() + 432000000, // 5 days from now
      permissions: {
        call: false,
        message: true,
        shareProfile: true,
      },
      lastActivity: Date.now() - 7200000, // 2 hours ago
      activityCount: { calls: 0, messages: 8 },
    },
    {
      id: "conn_003",
      name: "Lisa Garcia",
      avatar: "LG",
      maskedNumber: "+1 (555) 789-XXXX",
      status: "expired",
      approvedAt: Date.now() - 864000000, // 10 days ago
      expiresAt: Date.now() - 259200000, // 3 days ago
      permissions: {
        call: true,
        message: true,
        shareProfile: false,
      },
      lastActivity: Date.now() - 259200000, // 3 days ago
      activityCount: { calls: 5, messages: 23 },
    },
  ])

  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)

  const handleRevokeConsent = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === connectionId
          ? {
              ...conn,
              status: "revoked",
              revokedAt: Date.now(),
            }
          : conn,
      ),
    )
  }

  const handleRenewConnection = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === connectionId
          ? {
              ...conn,
              status: "active",
              expiresAt: Date.now() + 604800000, // 7 days from now
              renewedAt: Date.now(),
            }
          : conn,
      ),
    )
  }

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = expiresAt - Date.now()
    if (remaining <= 0) return "Expired"

    const days = Math.floor(remaining / 86400000)
    const hours = Math.floor((remaining % 86400000) / 3600000)

    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "expired":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "revoked":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  if (selectedConnection) {
    const connection = connections.find((conn) => conn.id === selectedConnection)
    if (!connection) return null

    return (
      <div className="min-h-screen pb-20">
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedConnection(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Connection Details</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Connection Info */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="text-center mb-6">
              <div className="w-16 h-16 privacy-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">{connection.avatar}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{connection.name}</h3>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-mono text-sm">{connection.maskedNumber}</span>
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  connection.status,
                )}`}
              >
                {connection.status}
              </div>
            </div>

            {/* Status Details */}
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Connection Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approved:</span>
                    <span className="text-white">{new Date(connection.approvedAt).toLocaleDateString()}</span>
                  </div>
                  {connection.status === "active" && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expires:</span>
                      <span className="text-white">{formatTimeRemaining(connection.expiresAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Activity:</span>
                    <span className="text-white">{new Date(connection.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Granted Permissions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Voice Calls</span>
                    </div>
                    <span className={connection.permissions.call ? "text-green-400" : "text-red-400"}>
                      {connection.permissions.call ? "Allowed" : "Denied"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Text Messages</span>
                    </div>
                    <span className={connection.permissions.message ? "text-green-400" : "text-red-400"}>
                      {connection.permissions.message ? "Allowed" : "Denied"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Profile Sharing</span>
                    </div>
                    <span className={connection.permissions.shareProfile ? "text-green-400" : "text-red-400"}>
                      {connection.permissions.shareProfile ? "Allowed" : "Denied"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Activity Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{connection.activityCount.calls}</div>
                    <div className="text-slate-400 text-sm">Voice Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{connection.activityCount.messages}</div>
                    <div className="text-slate-400 text-sm">Messages</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {connection.status === "active" && (
                  <button
                    onClick={() => handleRevokeConsent(connection.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Revoke Connection</span>
                  </button>
                )}
                {connection.status === "expired" && (
                  <button
                    onClick={() => handleRenewConnection(connection.id)}
                    className="w-full privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Renew Connection</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <Link href="/profile" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Consent Management</h1>
            <p className="text-slate-400 text-sm">Manage your active connections and permissions</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {connections.filter((c) => c.status === "active").length}
            </div>
            <div className="text-xs text-slate-400">Active</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {connections.filter((c) => c.status === "expired").length}
            </div>
            <div className="text-xs text-slate-400">Expired</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {connections.filter((c) => c.status === "revoked").length}
            </div>
            <div className="text-xs text-slate-400">Revoked</div>
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-3">
          {connections.map((connection) => (
            <button
              key={connection.id}
              onClick={() => setSelectedConnection(connection.id)}
              className="w-full bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:bg-slate-700/80 transition-all text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 privacy-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{connection.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold">{connection.name}</h3>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        connection.status,
                      )}`}
                    >
                      {connection.status}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">{connection.maskedNumber}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {connection.activityCount.calls} calls, {connection.activityCount.messages} messages
                    </span>
                    {connection.status === "active" && <span>{formatTimeRemaining(connection.expiresAt)}</span>}
                  </div>
                </div>
                <Eye className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

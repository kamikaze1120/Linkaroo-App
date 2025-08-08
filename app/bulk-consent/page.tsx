"use client"

import { useState } from "react"
import { ArrowLeft, Users, Check, X, Clock, Shield, Search, ChevronDown } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

interface Connection {
  id: string
  name: string
  avatar: string
  maskedNumber: string
  status: "active" | "pending" | "expired" | "revoked"
  permissions: {
    call: boolean
    message: boolean
    shareProfile: boolean
  }
  expiresAt: number
  lastActivity: number
  selected?: boolean
}

export default function BulkConsentScreen() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "conn_001",
      name: "Sarah Mitchell",
      avatar: "SM",
      maskedNumber: "+1 (555) 123-XXXX",
      status: "active",
      permissions: { call: true, message: true, shareProfile: false },
      expiresAt: Date.now() + 518400000,
      lastActivity: Date.now() - 3600000,
    },
    {
      id: "conn_002",
      name: "Mike Johnson",
      avatar: "MJ",
      maskedNumber: "+1 (555) 456-XXXX",
      status: "active",
      permissions: { call: false, message: true, shareProfile: true },
      expiresAt: Date.now() + 432000000,
      lastActivity: Date.now() - 7200000,
    },
    {
      id: "conn_003",
      name: "Lisa Garcia",
      avatar: "LG",
      maskedNumber: "+1 (555) 789-XXXX",
      status: "expired",
      permissions: { call: true, message: true, shareProfile: false },
      expiresAt: Date.now() - 259200000,
      lastActivity: Date.now() - 259200000,
    },
    {
      id: "conn_004",
      name: "David Brown",
      avatar: "DB",
      maskedNumber: "+1 (555) 321-XXXX",
      status: "active",
      permissions: { call: true, message: false, shareProfile: false },
      expiresAt: Date.now() + 345600000,
      lastActivity: Date.now() - 14400000,
    },
    {
      id: "conn_005",
      name: "Emma Wilson",
      avatar: "EW",
      maskedNumber: "+1 (555) 654-XXXX",
      status: "pending",
      permissions: { call: true, message: true, shareProfile: true },
      expiresAt: Date.now() + 1800000,
      lastActivity: 0,
    },
  ])

  const [filter, setFilter] = useState<"all" | "active" | "pending" | "expired">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkAction, setBulkAction] = useState<"extend" | "revoke" | "update_permissions" | null>(null)
  const [bulkPermissions, setBulkPermissions] = useState({
    call: true,
    message: true,
    shareProfile: false,
  })

  const selectedConnections = connections.filter((conn) => conn.selected)
  const filteredConnections = connections.filter((conn) => {
    const matchesFilter = filter === "all" || conn.status === filter
    const matchesSearch =
      conn.name.toLowerCase().includes(searchTerm.toLowerCase()) || conn.maskedNumber.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const toggleConnection = (id: string) => {
    setConnections(connections.map((conn) => (conn.id === id ? { ...conn, selected: !conn.selected } : conn)))
  }

  const selectAll = () => {
    const allSelected = filteredConnections.every((conn) => conn.selected)
    setConnections(
      connections.map((conn) => {
        if (filteredConnections.find((fc) => fc.id === conn.id)) {
          return { ...conn, selected: !allSelected }
        }
        return conn
      }),
    )
  }

  const clearSelection = () => {
    setConnections(connections.map((conn) => ({ ...conn, selected: false })))
  }

  const executeBulkAction = () => {
    const selectedIds = selectedConnections.map((conn) => conn.id)

    switch (bulkAction) {
      case "extend":
        setConnections(
          connections.map((conn) =>
            selectedIds.includes(conn.id)
              ? { ...conn, expiresAt: Date.now() + 604800000, status: "active" as const }
              : conn,
          ),
        )
        break
      case "revoke":
        setConnections(
          connections.map((conn) => (selectedIds.includes(conn.id) ? { ...conn, status: "revoked" as const } : conn)),
        )
        break
      case "update_permissions":
        setConnections(
          connections.map((conn) =>
            selectedIds.includes(conn.id) ? { ...conn, permissions: { ...bulkPermissions } } : conn,
          ),
        )
        break
    }

    clearSelection()
    setShowBulkActions(false)
    setBulkAction(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "expired":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "revoked":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = expiresAt - Date.now()
    if (remaining <= 0) return "Expired"

    const days = Math.floor(remaining / 86400000)
    const hours = Math.floor((remaining % 86400000) / 3600000)

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/consent-history" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Bulk Consent Management</h1>
              <p className="text-slate-400 text-sm">
                {selectedConnections.length > 0
                  ? `${selectedConnections.length} connection${selectedConnections.length !== 1 ? "s" : ""} selected`
                  : "Manage multiple connections at once"}
              </p>
            </div>
          </div>
          <Users className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search connections..."
              className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: "all", label: "All", count: connections.length },
              { key: "active", label: "Active", count: connections.filter((c) => c.status === "active").length },
              { key: "pending", label: "Pending", count: connections.filter((c) => c.status === "pending").length },
              { key: "expired", label: "Expired", count: connections.filter((c) => c.status === "expired").length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  filter === tab.key ? "bg-blue-600 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Selection Controls */}
        {filteredConnections.length > 0 && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAll}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                      filteredConnections.every((conn) => conn.selected)
                        ? "bg-blue-600 border-blue-600"
                        : "border-slate-400"
                    }`}
                  >
                    {filteredConnections.every((conn) => conn.selected) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm font-medium">
                    {filteredConnections.every((conn) => conn.selected) ? "Deselect All" : "Select All"}
                  </span>
                </button>
                {selectedConnections.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              {selectedConnections.length > 0 && (
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center space-x-2 privacy-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  <span className="text-sm font-medium">Bulk Actions</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showBulkActions ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedConnections.length > 0 && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-bold text-lg mb-4">Bulk Actions ({selectedConnections.length} selected)</h3>

            <div className="space-y-4">
              {/* Action Selection */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setBulkAction("extend")}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    bulkAction === "extend"
                      ? "border-green-500 bg-green-500/20 text-green-400"
                      : "border-slate-600 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Extend Connections</h4>
                      <p className="text-sm opacity-75">Add 7 days to selected connections</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setBulkAction("update_permissions")}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    bulkAction === "update_permissions"
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-slate-600 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Update Permissions</h4>
                      <p className="text-sm opacity-75">Change permissions for selected connections</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setBulkAction("revoke")}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    bulkAction === "revoke"
                      ? "border-red-500 bg-red-500/20 text-red-400"
                      : "border-slate-600 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <X className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium">Revoke Connections</h4>
                      <p className="text-sm opacity-75">Permanently revoke selected connections</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Permission Settings for Update Action */}
              {bulkAction === "update_permissions" && (
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-white font-medium">New Permissions</h4>
                  {[
                    { key: "call", label: "Voice Calls", desc: "Allow calling through masked number" },
                    { key: "message", label: "Text Messages", desc: "Allow messaging through masked number" },
                    { key: "shareProfile", label: "Profile Sharing", desc: "Share name and profile picture" },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white font-medium">{perm.label}</h5>
                        <p className="text-slate-400 text-sm">{perm.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setBulkPermissions({
                            ...bulkPermissions,
                            [perm.key]: !bulkPermissions[perm.key as keyof typeof bulkPermissions],
                          })
                        }
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          bulkPermissions[perm.key as keyof typeof bulkPermissions] ? "bg-blue-600" : "bg-slate-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                            bulkPermissions[perm.key as keyof typeof bulkPermissions] ? "right-0.5" : "left-0.5"
                          }`}
                        ></div>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Execute Button */}
              {bulkAction && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setBulkAction(null)
                      setShowBulkActions(false)
                    }}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeBulkAction}
                    className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all ${
                      bulkAction === "revoke"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "privacy-gradient text-white hover:opacity-90"
                    }`}
                  >
                    {bulkAction === "extend" && "Extend Connections"}
                    {bulkAction === "update_permissions" && "Update Permissions"}
                    {bulkAction === "revoke" && "Revoke Connections"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connections List */}
        <div className="space-y-3">
          {filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className={`bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                connection.selected ? "border-blue-500 bg-blue-500/10" : "border-slate-700"
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleConnection(connection.id)}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                    connection.selected ? "bg-blue-600 border-blue-600" : "border-slate-400 hover:border-blue-400"
                  }`}
                >
                  {connection.selected && <Check className="w-3 h-3 text-white" />}
                </button>

                <div className="w-12 h-12 privacy-gradient rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{connection.avatar}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold">{connection.name}</h3>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(connection.status)}`}
                    >
                      {connection.status}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-1">{connection.maskedNumber}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex space-x-3">
                      {connection.permissions.call && <span className="text-green-400">Calls</span>}
                      {connection.permissions.message && <span className="text-blue-400">Messages</span>}
                      {connection.permissions.shareProfile && <span className="text-purple-400">Profile</span>}
                    </div>
                    {connection.status === "active" && (
                      <span className="text-slate-500">Expires: {formatTimeRemaining(connection.expiresAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredConnections.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">No Connections Found</h3>
            <p className="text-slate-400">
              {searchTerm ? "Try adjusting your search terms" : "No connections match the selected filter"}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        {selectedConnections.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">Selection Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Selected:</span>
                <span className="text-white ml-2">{selectedConnections.length} connections</span>
              </div>
              <div>
                <span className="text-slate-400">Active:</span>
                <span className="text-green-400 ml-2">
                  {selectedConnections.filter((c) => c.status === "active").length}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Pending:</span>
                <span className="text-orange-400 ml-2">
                  {selectedConnections.filter((c) => c.status === "pending").length}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Expired:</span>
                <span className="text-red-400 ml-2">
                  {selectedConnections.filter((c) => c.status === "expired").length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

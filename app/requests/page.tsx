"use client"

import { useState } from "react"
import { ArrowLeft, Users, Clock, Filter, Search } from 'lucide-react'
import Link from "next/link"
import ConsentFlow from "@/components/ConsentFlow"
import BottomNav from "@/components/BottomNav"
import AnimatedBackdrop from "@/components/animated-backdrop"

export default function RequestsScreen() {
  const [requests, setRequests] = useState([
    {
      id: "req_001",
      requesterName: "Sarah Mitchell",
      requesterMaskedId: "+1 (555) 123-XXXX",
      requesterAvatar: "SM",
      message: "Hi! I met you at the coffee shop earlier. Would love to stay in touch!",
      timestamp: Date.now() - 300000,
      expiresAt: Date.now() + 1500000,
      requestType: "qr_scan" as const,
      permissions: {
        call: true,
        message: true,
        shareProfile: false,
      },
      status: "pending",
    },
    {
      id: "req_002",
      requesterName: "Mike Johnson",
      requesterMaskedId: "+1 (555) 456-XXXX",
      requesterAvatar: "MJ",
      message: "Hey! We were in the same meeting. Let's connect on Linkaroo for future collaboration.",
      timestamp: Date.now() - 900000,
      expiresAt: Date.now() + 1200000,
      requestType: "qr_scan" as const,
      permissions: {
        call: true,
        message: true,
        shareProfile: true,
      },
      status: "pending",
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")

  const handleApprove = (requestId: string, permissions: any) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved",
              approvedPermissions: permissions,
              respondedAt: Date.now(),
            }
          : req,
      ),
    )
    setSelectedRequest(null)
  }

  const handleReject = (requestId: string, reason: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "rejected",
              rejectionReason: reason,
              respondedAt: Date.now(),
            }
          : req,
      ),
    )
    setSelectedRequest(null)
  }

  const handleBlock = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "blocked",
              respondedAt: Date.now(),
            }
          : req,
      ),
    )
    setSelectedRequest(null)
  }

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true
    return req.status === filter
  })

  const pendingCount = requests.filter((req) => req.status === "pending").length

  if (selectedRequest) {
    const request = requests.find((req) => req.id === selectedRequest)
    if (request) {
      return (
        <div className="relative min-h-screen pb-20">
          <AnimatedBackdrop intensity="subtle" />
          <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Connection Request</h1>
            </div>
          </div>

          <div className="p-4">
            <ConsentFlow
              request={request}
              onApprove={(permissions) => handleApprove(request.id, permissions)}
              onReject={(reason) => handleReject(request.id, reason)}
              onBlock={() => handleBlock(request.id)}
            />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackdrop intensity="subtle" />
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Connection Requests</h1>
              <p className="text-slate-400 text-sm">
                {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: "pending", label: "Pending", count: requests.filter((r) => r.status === "pending").length },
            { key: "all", label: "All", count: requests.length },
            { key: "approved", label: "Approved", count: requests.filter((r) => r.status === "approved").length },
            { key: "rejected", label: "Rejected", count: requests.filter((r) => r.status === "rejected").length },
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

      <div className="px-4 space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">
              {filter === "pending" ? "No Pending Requests" : "No Requests Found"}
            </h3>
            <p className="text-slate-400">
              {filter === "pending"
                ? "When someone scans your QR code, their requests will appear here"
                : "Try adjusting your filter or search terms"}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <button
              key={request.id}
              onClick={() => request.status === "pending" && setSelectedRequest(request.id)}
              className={`w-full bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border transition-all text-left ${
                request.status === "pending"
                  ? "border-slate-700 hover:bg-slate-700/80 cursor-pointer"
                  : "border-slate-600 opacity-75"
              }`}
              disabled={request.status !== "pending"}
            >
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 privacy-gradient rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{request.requesterAvatar}</span>
                  </div>
                  {request.status === "pending" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <Clock className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold">{request.requesterName}</h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          request.status === "pending"
                            ? "bg-orange-500/20 text-orange-400"
                            : request.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : request.status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{request.requesterMaskedId}</p>
                  {request.message && <p className="text-slate-300 text-sm mb-2 line-clamp-2">"{request.message}"</p>}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(request.timestamp).toLocaleString()}</span>
                    {request.status === "pending" && (
                      <span>
                        Expires:{" "}
                        {new Date(request.expiresAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav activeTab="home" />
    </div>
  )
}

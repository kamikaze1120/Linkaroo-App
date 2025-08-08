"use client"

import { useState } from "react"
import { User, Shield, Check, X, Clock } from "lucide-react"

interface ContactRequestProps {
  contact: {
    userName: string
    maskedNumber: string
    userId: string
    timestamp: number
  }
  onApprove: () => void
  onReject: () => void
}

export default function ContactRequest({ contact, onApprove, onReject }: ContactRequestProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending")

  const handleApprove = () => {
    setStatus("approved")
    onApprove()
  }

  const handleReject = () => {
    setStatus("rejected")
    onReject()
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 privacy-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{contact.userName}</h3>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-mono text-sm">{contact.maskedNumber}</span>
        </div>
        <p className="text-slate-400 text-sm">Wants to connect with you</p>
      </div>

      {status === "pending" && (
        <div className="space-y-3">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">Privacy Protection</span>
            </div>
            <p className="text-slate-300 text-sm">
              Your real number will remain hidden. You can revoke this connection anytime.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleReject}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Reject</span>
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Approve</span>
            </button>
          </div>
        </div>
      )}

      {status === "approved" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-green-400 font-bold mb-2">Connection Approved!</h4>
          <p className="text-slate-400 text-sm">You can now message and call each other using masked numbers</p>
        </div>
      )}

      {status === "rejected" && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-red-400 font-bold mb-2">Connection Rejected</h4>
          <p className="text-slate-400 text-sm">The connection request has been declined</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs">
          <Clock className="w-3 h-3" />
          <span>Requested at {formatTime(contact.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

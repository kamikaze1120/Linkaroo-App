"use client"

import { useState, useEffect } from "react"
import { Bell, X, Clock } from "lucide-react"

interface ConsentNotificationProps {
  isVisible: boolean
  onClose: () => void
  onViewRequest: () => void
  request: {
    requesterName: string
    requesterAvatar: string
    timeRemaining: number
  }
}

export default function ConsentNotification({ isVisible, onClose, onViewRequest, request }: ConsentNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(request.timeRemaining)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          onClose()
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isVisible, onClose])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-2xl">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 privacy-gradient rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{request.requesterAvatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Bell className="w-4 h-4 text-blue-400" />
              <h4 className="text-white font-medium">New Connection Request</h4>
            </div>
            <p className="text-slate-300 text-sm mb-2">
              <span className="font-medium">{request.requesterName}</span> wants to connect
            </p>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400 text-xs font-medium">Expires in {formatTime(timeLeft)}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onViewRequest}
                className="flex-1 privacy-gradient text-white text-sm font-medium py-2 px-3 rounded-lg hover:opacity-90 transition-all"
              >
                Review Request
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

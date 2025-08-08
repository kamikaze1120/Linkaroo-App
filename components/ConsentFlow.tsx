"use client"

import { useState, useEffect } from "react"
import { Shield, Check, X, Clock, AlertTriangle, Eye, EyeOff, Info } from "lucide-react"

interface ConsentRequest {
  id: string
  requesterName: string
  requesterMaskedId: string
  requesterAvatar: string
  message?: string
  timestamp: number
  expiresAt: number
  requestType: "qr_scan" | "nearby" | "manual"
  permissions: {
    call: boolean
    message: boolean
    shareProfile: boolean
  }
}

interface ConsentFlowProps {
  request: ConsentRequest
  onApprove: (permissions: any) => void
  onReject: (reason: string) => void
  onBlock: () => void
}

export default function ConsentFlow({ request, onApprove, onReject, onBlock }: ConsentFlowProps) {
  const [step, setStep] = useState<"review" | "permissions" | "confirmation" | "completed">("review")
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null)
  const [permissions, setPermissions] = useState({
    call: true,
    message: true,
    shareProfile: false,
    duration: "7_days", // 1_day, 7_days, 30_days, permanent
  })
  const [rejectReason, setRejectReason] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const updateTimer = () => {
      const remaining = Math.max(0, request.expiresAt - Date.now())
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [request.expiresAt])

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "qr_scan":
        return "QR Code Scan"
      case "nearby":
        return "Nearby Discovery"
      case "manual":
        return "Manual Request"
      default:
        return "Unknown"
    }
  }

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "1_day":
        return "1 Day"
      case "7_days":
        return "7 Days"
      case "30_days":
        return "30 Days"
      case "permanent":
        return "Permanent"
      default:
        return "7 Days"
    }
  }

  const handleApprove = () => {
    setDecision("approve")
    setStep("permissions")
  }

  const handleReject = () => {
    setDecision("reject")
    setStep("confirmation")
  }

  const confirmApproval = () => {
    onApprove({
      ...permissions,
      approvedAt: Date.now(),
      expiresAt: permissions.duration === "permanent" ? null : Date.now() + getDurationMs(permissions.duration),
    })
    setStep("completed")
  }

  const confirmRejection = () => {
    onReject(rejectReason)
    setStep("completed")
  }

  const getDurationMs = (duration: string) => {
    switch (duration) {
      case "1_day":
        return 24 * 60 * 60 * 1000
      case "7_days":
        return 7 * 24 * 60 * 60 * 1000
      case "30_days":
        return 30 * 24 * 60 * 60 * 1000
      default:
        return 7 * 24 * 60 * 60 * 1000
    }
  }

  if (timeRemaining === 0) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-red-400 font-bold text-lg mb-2">Request Expired</h3>
          <p className="text-slate-400">This connection request has expired and is no longer valid.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 privacy-gradient rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">{request.requesterAvatar}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{request.requesterName}</h3>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-mono text-sm">{request.requesterMaskedId}</span>
        </div>
        <p className="text-slate-400 text-sm">Wants to connect with you</p>
      </div>

      {/* Timer */}
      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 mb-6">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-medium text-sm">Expires in {formatTimeRemaining(timeRemaining)}</span>
        </div>
      </div>

      {/* Step 1: Review Request */}
      {step === "review" && (
        <div className="space-y-4">
          {/* Request Details */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Request Details</h4>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="text-white">{getRequestTypeLabel(request.requestType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time:</span>
                <span className="text-white">{new Date(request.timestamp).toLocaleString()}</span>
              </div>
              {showDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Request ID:</span>
                    <span className="text-white font-mono text-xs">{request.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-white">{new Date(request.expiresAt).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Personal Message */}
          {request.message && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Personal Message</h4>
              <p className="text-slate-300 text-sm italic">"{request.message}"</p>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-blue-400 font-medium mb-2">Privacy Protection</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Your real number stays completely hidden</li>
                  <li>• You control what permissions to grant</li>
                  <li>• You can revoke access anytime</li>
                  <li>• All communications are through masked numbers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              <span>Review & Approve</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Set Permissions */}
      {step === "permissions" && decision === "approve" && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="text-white font-bold text-lg mb-2">Set Permissions</h4>
            <p className="text-slate-400 text-sm">Choose what {request.requesterName} can do</p>
          </div>

          {/* Permission Toggles */}
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="text-white font-medium">Voice Calls</h5>
                  <p className="text-slate-400 text-sm">Allow calling through masked number</p>
                </div>
                <button
                  onClick={() => setPermissions((prev) => ({ ...prev, call: !prev.call }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    permissions.call ? "bg-blue-600" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      permissions.call ? "right-0.5" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="text-white font-medium">Text Messages</h5>
                  <p className="text-slate-400 text-sm">Allow messaging through masked number</p>
                </div>
                <button
                  onClick={() => setPermissions((prev) => ({ ...prev, message: !prev.message }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    permissions.message ? "bg-blue-600" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      permissions.message ? "right-0.5" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="text-white font-medium">Profile Sharing</h5>
                  <p className="text-slate-400 text-sm">Share your name and profile picture</p>
                </div>
                <button
                  onClick={() => setPermissions((prev) => ({ ...prev, shareProfile: !prev.shareProfile }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    permissions.shareProfile ? "bg-blue-600" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      permissions.shareProfile ? "right-0.5" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h5 className="text-white font-medium mb-3">Connection Duration</h5>
            <div className="grid grid-cols-2 gap-2">
              {["1_day", "7_days", "30_days", "permanent"].map((duration) => (
                <button
                  key={duration}
                  onClick={() => setPermissions((prev) => ({ ...prev, duration }))}
                  className={`p-3 rounded-lg border transition-all text-sm ${
                    permissions.duration === duration
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-slate-600 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {getDurationLabel(duration)}
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-2">
              {permissions.duration === "permanent"
                ? "Connection will remain active until manually revoked"
                : `Connection will automatically expire after ${getDurationLabel(permissions.duration).toLowerCase()}`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setStep("review")}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={() => setStep("confirmation")}
              className="flex-1 privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all"
              disabled={!permissions.call && !permissions.message}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === "confirmation" && (
        <div className="space-y-4">
          {decision === "approve" ? (
            <>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Confirm Approval</h4>
                <p className="text-slate-400 text-sm">Review your permissions before approving</p>
              </div>

              {/* Permission Summary */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h5 className="text-green-400 font-medium mb-3">Granted Permissions</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-white">Masked number connection</span>
                  </div>
                  {permissions.call && (
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-white">Voice calls allowed</span>
                    </div>
                  )}
                  {permissions.message && (
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-white">Text messages allowed</span>
                    </div>
                  )}
                  {permissions.shareProfile && (
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-white">Profile sharing enabled</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-white">Duration: {getDurationLabel(permissions.duration)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("permissions")}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  onClick={confirmApproval}
                  className="flex-1 privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all"
                >
                  Approve Connection
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Confirm Rejection</h4>
                <p className="text-slate-400 text-sm">Optionally provide a reason for rejection</p>
              </div>

              {/* Rejection Reasons */}
              <div className="space-y-2">
                {[
                  "I don't know this person",
                  "Not interested in connecting",
                  "Suspicious request",
                  "Privacy concerns",
                  "Other",
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRejectReason(reason)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      rejectReason === reason
                        ? "border-red-500 bg-red-500/20 text-red-400"
                        : "border-slate-600 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {/* Block Option */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium text-sm">Block User</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">Prevent this user from sending future connection requests</p>
                <button
                  onClick={onBlock}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
                >
                  Block & Reject
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("review")}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  onClick={confirmRejection}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                >
                  Confirm Rejection
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 4: Completed */}
      {step === "completed" && (
        <div className="text-center">
          {decision === "approve" ? (
            <>
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-green-400 font-bold text-lg mb-2">Connection Approved!</h4>
              <p className="text-slate-400 text-sm mb-4">
                {request.requesterName} can now contact you using your masked number
              </p>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400 text-sm">🔒 Your real number remains private and protected</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-red-400 font-bold text-lg mb-2">Connection Rejected</h4>
              <p className="text-slate-400 text-sm">
                The connection request has been declined and the requester has been notified
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

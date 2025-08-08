"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, X, CheckCircle, AlertCircle, Smartphone } from "lucide-react"

interface NFCQuickShareProps {
  contactName: string
  contactPhone: string
  contactEmail: string
}

export default function NFCQuickShare({ contactName, contactPhone, contactEmail }: NFCQuickShareProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "success" | "error">("idle")

  const handleStartShare = () => {
    setIsSharing(true)
    setShareStatus("sharing")

    // Simulate NFC sharing process
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate
      if (success) {
        setShareStatus("success")
        setTimeout(() => {
          setIsVisible(false)
          setIsSharing(false)
          setShareStatus("idle")
        }, 2000)
      } else {
        setShareStatus("error")
        setTimeout(() => {
          setIsSharing(false)
          setShareStatus("idle")
        }, 3000)
      }
    }, 2000)
  }

  const handleClose = () => {
    if (!isSharing) {
      setIsVisible(false)
      setShareStatus("idle")
    }
  }

  if (!isVisible) {
    return (
      <Button size="sm" onClick={() => setIsVisible(true)} className="bg-orange-600 hover:bg-orange-700">
        <Zap className="h-4 w-4 mr-1" />
        NFC
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center relative">
          {!isSharing && (
            <Button variant="ghost" size="sm" onClick={handleClose} className="absolute right-2 top-2 h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="mb-4">
            {shareStatus === "sharing" && (
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 border-2 border-orange-400 rounded-full animate-ping opacity-20"></div>
                <div
                  className="absolute inset-2 border-2 border-orange-400 rounded-full animate-ping opacity-40"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-4 border-2 border-orange-400 rounded-full animate-ping opacity-60"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div className="absolute inset-6 bg-orange-400 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            {shareStatus === "success" && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}

            {shareStatus === "error" && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            )}

            {shareStatus === "idle" && (
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-orange-600" />
              </div>
            )}
          </div>

          <CardTitle className="text-lg">
            {shareStatus === "sharing" && "Sharing via NFC..."}
            {shareStatus === "success" && "Successfully Shared!"}
            {shareStatus === "error" && "Share Failed"}
            {shareStatus === "idle" && "NFC Quick Share"}
          </CardTitle>

          <CardDescription>
            {shareStatus === "sharing" && "Hold your device near the other person's phone"}
            {shareStatus === "success" && `Shared your contact with ${contactName}`}
            {shareStatus === "error" && "Could not establish NFC connection"}
            {shareStatus === "idle" && `Share your contact with ${contactName}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {shareStatus === "idle" && (
            <>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Contact Information</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span> {contactName}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {contactPhone}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {contactEmail}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleStartShare} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Start NFC Share
                </Button>
                <Button variant="outline" onClick={handleClose} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </>
          )}

          {shareStatus === "sharing" && (
            <div className="text-center space-y-3">
              <div className="flex justify-center space-x-2">
                <Badge className="bg-orange-100 text-orange-800">NFC Active</Badge>
                <Badge className="bg-blue-100 text-blue-800">Encrypted</Badge>
              </div>
              <p className="text-sm text-gray-600">Searching for nearby devices...</p>
            </div>
          )}

          {shareStatus === "success" && (
            <div className="text-center">
              <p className="text-sm text-green-700 mb-3">Your contact information has been securely shared!</p>
              <Badge className="bg-green-100 text-green-800">Connection Established</Badge>
            </div>
          )}

          {shareStatus === "error" && (
            <div className="space-y-3">
              <p className="text-sm text-red-700 text-center">Failed to establish NFC connection. Please try again.</p>
              <div className="flex space-x-2">
                <Button onClick={handleStartShare} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleClose} className="bg-transparent">
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

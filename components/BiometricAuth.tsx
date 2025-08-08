"use client"

import { useState, useEffect } from "react"
import { Fingerprint, Eye, Shield, Lock, CheckCircle, XCircle } from "lucide-react"

interface BiometricAuthProps {
  onSuccess: () => void
  onCancel: () => void
  action?: string
  isVisible: boolean
}

export default function BiometricAuth({ onSuccess, onCancel, action = "authenticate", isVisible }: BiometricAuthProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [availableMethods, setAvailableMethods] = useState<string[]>([])
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authResult, setAuthResult] = useState<"success" | "failed" | null>(null)
  const [fallbackPin, setFallbackPin] = useState("")
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    if ("PublicKeyCredential" in window && "navigator" in window && "credentials" in navigator) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        setIsSupported(available)

        // Mock detection of available methods
        const methods = []
        if (available) {
          methods.push("fingerprint")
          if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")) {
            methods.push("faceId")
          }
        }
        setAvailableMethods(methods)
      } catch (error) {
        console.error("Biometric check failed:", error)
        setIsSupported(false)
      }
    }
  }

  const authenticateWithBiometric = async () => {
    setIsAuthenticating(true)
    setAuthResult(null)

    try {
      // Simulate biometric authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock success/failure (90% success rate)
      const success = Math.random() > 0.1

      if (success) {
        setAuthResult("success")
        setTimeout(() => {
          onSuccess()
        }, 1000)
      } else {
        setAuthResult("failed")
        setTimeout(() => {
          setShowFallback(true)
          setIsAuthenticating(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Biometric authentication failed:", error)
      setAuthResult("failed")
      setTimeout(() => {
        setShowFallback(true)
        setIsAuthenticating(false)
      }, 1500)
    }
  }

  const authenticateWithPin = () => {
    if (fallbackPin === "1234") {
      // Mock PIN
      onSuccess()
    } else {
      alert("Incorrect PIN. Try again.")
      setFallbackPin("")
    }
  }

  const getBiometricIcon = () => {
    if (availableMethods.includes("faceId")) {
      return <Eye className="w-16 h-16 text-blue-400" />
    }
    return <Fingerprint className="w-16 h-16 text-blue-400" />
  }

  const getBiometricLabel = () => {
    if (availableMethods.includes("faceId")) {
      return "Face ID"
    }
    return "Fingerprint"
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700">
        {!showFallback ? (
          <div className="text-center">
            <div className="mb-6">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Secure Authentication</h2>
              <p className="text-slate-400">
                {action === "authenticate" ? "Verify your identity to continue" : `Authenticate to ${action}`}
              </p>
            </div>

            {isSupported ? (
              <div className="space-y-6">
                <div className="relative">
                  <div
                    className={`mx-auto mb-4 transition-all duration-300 ${isAuthenticating ? "animate-pulse" : ""} ${
                      authResult === "success"
                        ? "text-green-400"
                        : authResult === "failed"
                          ? "text-red-400"
                          : "text-blue-400"
                    }`}
                  >
                    {authResult === "success" ? (
                      <CheckCircle className="w-16 h-16 mx-auto" />
                    ) : authResult === "failed" ? (
                      <XCircle className="w-16 h-16 mx-auto" />
                    ) : (
                      getBiometricIcon()
                    )}
                  </div>

                  {authResult === "success" && <p className="text-green-400 font-medium">Authentication Successful!</p>}
                  {authResult === "failed" && <p className="text-red-400 font-medium">Authentication Failed</p>}
                  {!authResult && !isAuthenticating && (
                    <p className="text-slate-300 mb-6">Use {getBiometricLabel()} to authenticate</p>
                  )}
                  {isAuthenticating && !authResult && <p className="text-blue-400 font-medium">Authenticating...</p>}
                </div>

                {!authResult && (
                  <div className="space-y-4">
                    <button
                      onClick={authenticateWithBiometric}
                      disabled={isAuthenticating}
                      className="w-full privacy-gradient text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {isAuthenticating ? "Authenticating..." : `Use ${getBiometricLabel()}`}
                    </button>

                    <button
                      onClick={() => setShowFallback(true)}
                      className="w-full text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      Use PIN instead
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Lock className="w-16 h-16 text-slate-600 mx-auto" />
                <p className="text-slate-400 mb-4">Biometric authentication not available</p>
                <button
                  onClick={() => setShowFallback(true)}
                  className="w-full privacy-gradient text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all"
                >
                  Use PIN Authentication
                </button>
              </div>
            )}

            <button onClick={onCancel} className="w-full mt-4 text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Enter PIN</h2>
            <p className="text-slate-400 mb-6">Enter your 4-digit PIN to continue</p>

            <div className="space-y-4">
              <div className="flex justify-center space-x-2 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      fallbackPin.length > index ? "bg-blue-400 border-blue-400" : "border-slate-600"
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((num, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (num === "⌫") {
                        setFallbackPin((prev) => prev.slice(0, -1))
                      } else if (num !== "" && fallbackPin.length < 4) {
                        const newPin = fallbackPin + num
                        setFallbackPin(newPin)
                        if (newPin.length === 4) {
                          setTimeout(() => authenticateWithPin(), 100)
                        }
                      }
                    }}
                    disabled={num === ""}
                    className={`h-12 rounded-lg font-bold text-lg transition-all ${
                      num === "" ? "invisible" : "bg-slate-700 hover:bg-slate-600 text-white active:bg-slate-500"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFallback(false)}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Back to biometric
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

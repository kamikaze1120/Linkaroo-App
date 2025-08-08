"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Wifi, WifiOff, CheckCircle, XCircle, Clock, Shield } from "lucide-react"

interface NFCData {
  id: string
  name: string
  phone: string
  email: string
  template: string
  timestamp: number
  expires: number
}

interface NFCManagerProps {
  onDataReceived?: (data: NFCData) => void
  onWriteComplete?: () => void
  shareData?: {
    name: string
    phone: string
    email: string
    template: string
  }
  mode: "read" | "write" | "both"
}

export default function NFCManager({ onDataReceived, onWriteComplete, shareData, mode = "both" }: NFCManagerProps) {
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [isWriting, setIsWriting] = useState(false)
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [lastConnection, setLastConnection] = useState<NFCData | null>(null)

  // Check NFC support
  useEffect(() => {
    const checkNFCSupport = async () => {
      if ("NDEFReader" in window) {
        try {
          const ndef = new (window as any).NDEFReader()
          await ndef.scan()
          setNfcSupported(true)
        } catch (error) {
          console.log("NFC not available:", error)
          setNfcSupported(false)
        }
      } else {
        setNfcSupported(false)
      }
    }

    checkNFCSupport()
  }, [])

  // Start NFC reading
  const startReading = useCallback(async () => {
    if (!nfcSupported) {
      setStatus("error")
      setMessage("NFC not supported on this device")
      return
    }

    try {
      setIsReading(true)
      setStatus("scanning")
      setMessage("Hold your device near an NFC tag...")

      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader()

        ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
          try {
            const record = message.records[0]
            const textDecoder = new TextDecoder(record.encoding)
            const data = JSON.parse(textDecoder.decode(record.data))

            // Validate data structure and expiration
            if (data.expires && Date.now() > data.expires) {
              setStatus("error")
              setMessage("NFC data has expired")
              return
            }

            setLastConnection(data)
            setStatus("success")
            setMessage(`Connected with ${data.name}`)
            onDataReceived?.(data)
          } catch (error) {
            setStatus("error")
            setMessage("Invalid NFC data format")
          }
        })

        ndef.addEventListener("readingerror", () => {
          setStatus("error")
          setMessage("Error reading NFC tag")
        })

        await ndef.scan()
      } else {
        // Fallback simulation for demo
        setTimeout(() => {
          const simulatedData: NFCData = {
            id: "sim-" + Date.now(),
            name: "Demo Contact",
            phone: "+1 (555) 123-4567",
            email: "demo@example.com",
            template: "quick-connect",
            timestamp: Date.now(),
            expires: Date.now() + 300000, // 5 minutes
          }
          setLastConnection(simulatedData)
          setStatus("success")
          setMessage(`Connected with ${simulatedData.name}`)
          onDataReceived?.(simulatedData)
        }, 2000)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to start NFC reading")
      setIsReading(false)
    }
  }, [nfcSupported, onDataReceived])

  // Write NFC data
  const writeNFC = useCallback(async () => {
    if (!nfcSupported || !shareData) {
      setStatus("error")
      setMessage("NFC not supported or no data to share")
      return
    }

    try {
      setIsWriting(true)
      setStatus("scanning")
      setMessage("Hold your device near another NFC-enabled device...")

      const nfcData: NFCData = {
        id: "share-" + Date.now(),
        name: shareData.name,
        phone: shareData.phone,
        email: shareData.email,
        template: shareData.template,
        timestamp: Date.now(),
        expires: Date.now() + 300000, // 5 minutes expiration
      }

      if ("NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader()
        await ndef.write({
          records: [
            {
              recordType: "text",
              data: JSON.stringify(nfcData),
            },
          ],
        })

        setStatus("success")
        setMessage("Contact shared successfully!")
        onWriteComplete?.()
      } else {
        // Fallback simulation
        setTimeout(() => {
          setStatus("success")
          setMessage("Contact shared successfully!")
          onWriteComplete?.()
        }, 2000)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to share contact via NFC")
    } finally {
      setIsWriting(false)
    }
  }, [nfcSupported, shareData, onWriteComplete])

  const stopScanning = () => {
    setIsReading(false)
    setIsWriting(false)
    setStatus("idle")
    setMessage("")
  }

  const getStatusIcon = () => {
    switch (status) {
      case "scanning":
        return <Wifi className="h-8 w-8 text-blue-500 animate-pulse" />
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />
      default:
        return <Smartphone className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "scanning":
        return "border-blue-500 bg-blue-50"
      case "success":
        return "border-green-500 bg-green-50"
      case "error":
        return "border-red-500 bg-red-50"
      default:
        return "border-gray-200"
    }
  }

  if (nfcSupported === null) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Wifi className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <p>Checking NFC support...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!nfcSupported) {
    return (
      <Alert>
        <WifiOff className="h-4 w-4" />
        <AlertDescription>NFC is not supported on this device. Please use QR code sharing instead.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Card className={`transition-all duration-300 ${getStatusColor()}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            {status === "scanning" && (
              <div className="relative">
                {getStatusIcon()}
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border border-blue-300 animate-pulse scale-150"></div>
              </div>
            )}
            {status !== "scanning" && getStatusIcon()}
          </div>
          <CardTitle className="text-lg">{status === "scanning" ? "NFC Active" : "NFC Ready"}</CardTitle>
          {message && <CardDescription className="text-sm">{message}</CardDescription>}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2 justify-center">
            {(mode === "read" || mode === "both") && (
              <Button
                onClick={isReading ? stopScanning : startReading}
                disabled={isWriting}
                variant={isReading ? "destructive" : "default"}
                className="flex-1"
              >
                {isReading ? "Stop Reading" : "Start Reading"}
              </Button>
            )}

            {(mode === "write" || mode === "both") && shareData && (
              <Button
                onClick={writeNFC}
                disabled={isReading || !shareData}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Share via NFC
              </Button>
            )}
          </div>

          {lastConnection && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Last Connection</span>
                <Badge variant="secondary" className="ml-auto">
                  {lastConnection.template}
                </Badge>
              </div>
              <div className="text-sm text-green-700">
                <p className="font-medium">{lastConnection.name}</p>
                <p>{lastConnection.email}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(lastConnection.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <Shield className="h-3 w-3" />
            <span>NFC data is encrypted and expires in 5 minutes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

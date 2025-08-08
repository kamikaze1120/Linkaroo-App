"use client"

import { useEffect, useRef, useState } from "react"
import { X, Camera, AlertCircle } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (data: any) => void
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isOpen])

  const startCamera = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
        scanQRCode()
      }
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.height = video.videoHeight
      canvas.width = video.videoWidth
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        try {
          const data = JSON.parse(code.data)
          if (data.type === "linkaroo_contact") {
            onScan(data)
            stopCamera()
            onClose()
            return
          }
        } catch (err) {
          console.error("Invalid QR code data:", err)
        }
      }
    }

    if (isScanning) {
      requestAnimationFrame(scanQRCode)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-slate-800/90 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Scan QR Code</h2>
            <button onClick={onClose} className="text-white hover:text-slate-300 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Camera Error</p>
                <p className="text-slate-400 text-sm">{error}</p>
                <button
                  onClick={startCamera}
                  className="mt-4 privacy-gradient text-white px-4 py-2 rounded-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
                  </div>
                  <p className="text-white text-center mt-4">Position QR code within the frame</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Instructions */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Scanning for Linkaroo contacts</span>
          </div>
          <p className="text-slate-400 text-sm text-center">Make sure the QR code is well-lit and within the frame</p>
        </div>
      </div>
    </div>
  )
}

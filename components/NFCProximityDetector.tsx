"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Smartphone, Wifi, Signal, Users, Zap, MapPin, Clock, Shield, AlertCircle } from "lucide-react"

interface NearbyDevice {
  id: string
  name: string
  avatar?: string
  distance: number
  signalStrength: "excellent" | "good" | "fair" | "weak"
  lastSeen: number
  deviceType: "android" | "iphone" | "unknown"
  status: "available" | "busy" | "away" | "hidden"
  mutualConnections?: number
  template?: string
  isLinkarooUser: boolean
}

interface NFCProximityDetectorProps {
  isActive: boolean
  onDeviceConnect: (device: NearbyDevice) => void
  userLocation?: { lat: number; lng: number }
}

export default function NFCProximityDetector({ isActive, onDeviceConnect, userLocation }: NFCProximityDetectorProps) {
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string>("")
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mock nearby devices for demonstration
  const mockDevices: NearbyDevice[] = [
    {
      id: "device_001",
      name: "Sarah's iPhone",
      avatar: "/placeholder.svg?height=40&width=40",
      distance: 2.5,
      signalStrength: "excellent",
      lastSeen: Date.now() - 15000,
      deviceType: "iphone",
      status: "available",
      mutualConnections: 3,
      template: "work",
      isLinkarooUser: true,
    },
    {
      id: "device_002",
      name: "Mike's Galaxy",
      avatar: "/placeholder.svg?height=40&width=40",
      distance: 4.1,
      signalStrength: "good",
      lastSeen: Date.now() - 30000,
      deviceType: "android",
      status: "available",
      mutualConnections: 1,
      template: "quick-connect",
      isLinkarooUser: true,
    },
    {
      id: "device_003",
      name: "Emma's Phone",
      distance: 6.8,
      signalStrength: "fair",
      lastSeen: Date.now() - 45000,
      deviceType: "unknown",
      status: "busy",
      mutualConnections: 0,
      isLinkarooUser: false,
    },
    {
      id: "device_004",
      name: "Alex's iPhone",
      avatar: "/placeholder.svg?height=40&width=40",
      distance: 1.8,
      signalStrength: "excellent",
      lastSeen: Date.now() - 8000,
      deviceType: "iphone",
      status: "available",
      mutualConnections: 5,
      template: "family",
      isLinkarooUser: true,
    },
    {
      id: "device_005",
      name: "Jordan's Pixel",
      distance: 9.2,
      signalStrength: "weak",
      lastSeen: Date.now() - 120000,
      deviceType: "android",
      status: "away",
      mutualConnections: 0,
      isLinkarooUser: true,
    },
  ]

  useEffect(() => {
    if (isActive) {
      startProximityScanning()
    } else {
      stopProximityScanning()
    }

    return () => stopProximityScanning()
  }, [isActive])

  const startProximityScanning = () => {
    setIsScanning(true)
    setScanError("")

    // Simulate initial device discovery
    setTimeout(() => {
      setNearbyDevices(mockDevices.slice(0, 2))
    }, 1000)

    // Simulate periodic device updates
    scanIntervalRef.current = setInterval(() => {
      simulateDeviceUpdates()
    }, 3000)
  }

  const stopProximityScanning = () => {
    setIsScanning(false)
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
  }

  const simulateDeviceUpdates = () => {
    setNearbyDevices((prevDevices) => {
      const updatedDevices = [...prevDevices]

      // Randomly add/remove devices
      const shouldAddDevice = Math.random() > 0.7 && updatedDevices.length < 4
      const shouldRemoveDevice = Math.random() > 0.8 && updatedDevices.length > 1

      if (shouldAddDevice) {
        const availableDevices = mockDevices.filter((device) => !updatedDevices.find((d) => d.id === device.id))
        if (availableDevices.length > 0) {
          const newDevice = availableDevices[Math.floor(Math.random() * availableDevices.length)]
          updatedDevices.push({
            ...newDevice,
            lastSeen: Date.now(),
            distance: Math.random() * 8 + 1,
          })
        }
      }

      if (shouldRemoveDevice) {
        updatedDevices.splice(Math.floor(Math.random() * updatedDevices.length), 1)
      }

      // Update existing devices
      return updatedDevices.map((device) => ({
        ...device,
        distance: Math.max(0.5, device.distance + (Math.random() - 0.5) * 2),
        lastSeen: device.lastSeen + Math.random() * 30000,
        signalStrength: getSignalStrength(device.distance),
      }))
    })
  }

  const getSignalStrength = (distance: number): "excellent" | "good" | "fair" | "weak" => {
    if (distance <= 2) return "excellent"
    if (distance <= 4) return "good"
    if (distance <= 7) return "fair"
    return "weak"
  }

  const getSignalIcon = (strength: string) => {
    const baseClass = "h-4 w-4"
    switch (strength) {
      case "excellent":
        return <Signal className={`${baseClass} text-green-500`} />
      case "good":
        return <Signal className={`${baseClass} text-blue-500`} />
      case "fair":
        return <Signal className={`${baseClass} text-yellow-500`} />
      case "weak":
        return <Signal className={`${baseClass} text-red-500`} />
      default:
        return <Signal className={`${baseClass} text-gray-400`} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-red-100 text-red-800"
      case "away":
        return "bg-yellow-100 text-yellow-800"
      case "hidden":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "iphone":
        return "📱"
      case "android":
        return "🤖"
      default:
        return "📱"
    }
  }

  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)}m`
  }

  const formatLastSeen = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const handleConnectDevice = (device: NearbyDevice) => {
    if (!device.isLinkarooUser) {
      setScanError("This device is not running Linkaroo")
      return
    }

    if (device.status !== "available") {
      setScanError(`${device.name} is currently ${device.status}`)
      return
    }

    setSelectedDevice(device.id)
    onDeviceConnect(device)

    // Simulate connection attempt
    setTimeout(() => {
      setSelectedDevice(null)
    }, 2000)
  }

  const linkarooDevices = nearbyDevices.filter((device) => device.isLinkarooUser)
  const otherDevices = nearbyDevices.filter((device) => !device.isLinkarooUser)

  return (
    <div className="space-y-4">
      {/* Scanning Status */}
      <Card className={`transition-all duration-300 ${isScanning ? "border-blue-500 bg-blue-50" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Wifi className={`h-5 w-5 ${isScanning ? "text-blue-600" : "text-gray-400"}`} />
                {isScanning && (
                  <div className="absolute -inset-1 border border-blue-500 rounded-full animate-ping"></div>
                )}
              </div>
              <div>
                <CardTitle className="text-base">
                  {isScanning ? "Scanning for Nearby Devices" : "Proximity Detection"}
                </CardTitle>
                <CardDescription className="text-sm">
                  {isScanning ? `Found ${nearbyDevices.length} devices nearby` : "Enable to find nearby Linkaroo users"}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isScanning ? "default" : "outline"}>{isScanning ? "Active" : "Inactive"}</Badge>
          </div>
        </CardHeader>

        {scanError && (
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{scanError}</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Linkaroo Users Nearby */}
      {linkarooDevices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <span>Linkaroo Users ({linkarooDevices.length})</span>
            </CardTitle>
            <CardDescription>Ready to connect via NFC tap-to-share</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {linkarooDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={device.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {device.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{device.name}</h4>
                      <span className="text-xs">{getDeviceIcon(device.deviceType)}</span>
                      {device.template && (
                        <Badge variant="outline" className="text-xs">
                          {device.template}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{formatDistance(device.distance)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getSignalIcon(device.signalStrength)}
                        <span className="capitalize">{device.signalStrength}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatLastSeen(device.lastSeen)}</span>
                      </div>
                    </div>

                    {device.mutualConnections! > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-600">{device.mutualConnections} mutual connections</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getStatusColor(device.status)}`}>{device.status}</Badge>
                    <Button
                      size="sm"
                      onClick={() => handleConnectDevice(device)}
                      disabled={selectedDevice === device.id || device.status !== "available"}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {selectedDevice === device.id ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Connecting</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>Connect</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Devices Nearby */}
      {otherDevices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-gray-600" />
              <span>Other Devices ({otherDevices.length})</span>
            </CardTitle>
            <CardDescription>Devices without Linkaroo installed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {otherDevices.map((device) => (
                <div key={device.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span>{getDeviceIcon(device.deviceType)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{device.name}</h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{formatDistance(device.distance)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getSignalIcon(device.signalStrength)}
                        <span className="capitalize">{device.signalStrength}</span>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" disabled className="text-xs bg-transparent">
                    No Linkaroo
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Devices Found */}
      {isScanning && nearbyDevices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Wifi className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="font-medium text-gray-900 mb-2">Looking for nearby devices...</h3>
            <p className="text-sm text-gray-500">Make sure other Linkaroo users have NFC sharing enabled</p>
          </CardContent>
        </Card>
      )}

      {!isScanning && nearbyDevices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No devices nearby</h3>
            <p className="text-sm text-gray-500 mb-4">Start scanning to find other Linkaroo users around you</p>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Privacy Protected</h4>
              <p className="text-xs text-blue-700">
                Device detection uses encrypted local discovery. No personal information is shared until you choose to
                connect.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

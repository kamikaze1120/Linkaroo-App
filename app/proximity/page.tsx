"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Radar, Settings, Users, MapPin, Smartphone, Shield } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import NFCProximityDetector from "@/components/NFCProximityDetector"
import ConsentFlow from "@/components/ConsentFlow"

interface ProximitySettings {
  enabled: boolean
  maxDistance: number
  showOnlyLinkaroo: boolean
  autoConnect: boolean
  showMutualConnections: boolean
  notifyOnNewDevices: boolean
  backgroundScanning: boolean
}

interface ConnectionRequest {
  id: string
  requesterName: string
  requesterMaskedId: string
  requesterAvatar: string
  message: string
  timestamp: number
  expiresAt: number
  requestType: "proximity" | "nfc" | "qr"
  permissions: {
    call: boolean
    message: boolean
    shareProfile: boolean
  }
  deviceInfo?: {
    type: string
    distance: number
    signalStrength: string
  }
}

export default function ProximityPage() {
  const [settings, setSettings] = useState<ProximitySettings>({
    enabled: false,
    maxDistance: 10,
    showOnlyLinkaroo: true,
    autoConnect: false,
    showMutualConnections: true,
    notifyOnNewDevices: true,
    backgroundScanning: false,
  })

  const [pendingRequest, setPendingRequest] = useState<ConnectionRequest | null>(null)
  const [connectionHistory, setConnectionHistory] = useState([
    {
      id: "conn_001",
      name: "Sarah Johnson",
      timestamp: Date.now() - 300000,
      method: "proximity",
      distance: "2.5m",
      status: "connected",
    },
    {
      id: "conn_002",
      name: "Mike Chen",
      timestamp: Date.now() - 600000,
      method: "proximity",
      distance: "4.1m",
      status: "connected",
    },
    {
      id: "conn_003",
      name: "Emma Davis",
      timestamp: Date.now() - 900000,
      method: "proximity",
      distance: "6.8m",
      status: "rejected",
    },
  ])

  const handleSettingChange = (key: keyof ProximitySettings, value: boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDeviceConnect = (device: any) => {
    // Convert device info to connection request
    const request: ConnectionRequest = {
      id: `prox_${Date.now()}`,
      requesterName: device.name,
      requesterMaskedId: "+1 (555) XXX-XXXX",
      requesterAvatar: device.avatar || "",
      message: `Connection request via proximity detection (${device.distance.toFixed(1)}m away)`,
      timestamp: Date.now(),
      expiresAt: Date.now() + 300000, // 5 minutes
      requestType: "proximity",
      permissions: {
        call: device.template === "work" || device.template === "family",
        message: true,
        shareProfile: device.template === "family",
      },
      deviceInfo: {
        type: device.deviceType,
        distance: device.distance,
        signalStrength: device.signalStrength,
      },
    }

    setPendingRequest(request)
  }

  const handleApproveRequest = (permissions: any) => {
    if (pendingRequest) {
      console.log("Approved proximity connection:", permissions)
      setConnectionHistory((prev) => [
        ...prev,
        {
          id: pendingRequest.id,
          name: pendingRequest.requesterName,
          timestamp: Date.now(),
          method: "proximity",
          distance: pendingRequest.deviceInfo?.distance.toFixed(1) + "m" || "Unknown",
          status: "connected",
        },
      ])
      setPendingRequest(null)
    }
  }

  const handleRejectRequest = (reason: string) => {
    if (pendingRequest) {
      console.log("Rejected proximity connection:", reason)
      setConnectionHistory((prev) => [
        ...prev,
        {
          id: pendingRequest.id,
          name: pendingRequest.requesterName,
          timestamp: Date.now(),
          method: "proximity",
          distance: pendingRequest.deviceInfo?.distance.toFixed(1) + "m" || "Unknown",
          status: "rejected",
        },
      ])
      setPendingRequest(null)
    }
  }

  const handleBlockUser = () => {
    if (pendingRequest) {
      console.log("Blocked proximity user")
      setPendingRequest(null)
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/nfc-share">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Proximity Detection</h1>
              <p className="text-sm text-gray-500">Find nearby Linkaroo users</p>
            </div>
          </div>
          <Radar className="h-6 w-6 text-blue-500" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Proximity Toggle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radar className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Proximity Scanning</CardTitle>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
              />
            </div>
            <CardDescription>
              {settings.enabled ? "Actively scanning for nearby Linkaroo users" : "Enable to detect other users nearby"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Proximity Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Detection Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Detection Range</label>
                <Badge variant="outline">{settings.maxDistance}m</Badge>
              </div>
              <Slider
                value={[settings.maxDistance]}
                onValueChange={(value) => handleSettingChange("maxDistance", value[0])}
                max={50}
                min={1}
                step={1}
                className="w-full"
                disabled={!settings.enabled}
              />
              <p className="text-xs text-gray-500">Detect devices within {settings.maxDistance} meters</p>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-4">
              {[
                {
                  key: "showOnlyLinkaroo" as keyof ProximitySettings,
                  label: "Show Only Linkaroo Users",
                  description: "Hide devices without Linkaroo installed",
                },
                {
                  key: "autoConnect" as keyof ProximitySettings,
                  label: "Auto-Connect to Known Contacts",
                  description: "Automatically connect with existing contacts",
                },
                {
                  key: "showMutualConnections" as keyof ProximitySettings,
                  label: "Show Mutual Connections",
                  description: "Display shared contacts with nearby users",
                },
                {
                  key: "notifyOnNewDevices" as keyof ProximitySettings,
                  label: "New Device Notifications",
                  description: "Get notified when new devices are detected",
                },
                {
                  key: "backgroundScanning" as keyof ProximitySettings,
                  label: "Background Scanning",
                  description: "Continue scanning when app is minimized",
                },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{setting.label}</h4>
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  </div>
                  <Switch
                    checked={settings[setting.key] as boolean}
                    onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                    disabled={!settings.enabled}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proximity Detector */}
        <NFCProximityDetector isActive={settings.enabled} onDeviceConnect={handleDeviceConnect} />

        {/* Connection Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <span>Connection Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {connectionHistory.filter((c) => c.status === "connected").length}
                </div>
                <div className="text-xs text-gray-500">Connected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {connectionHistory.filter((c) => c.method === "proximity").length}
                </div>
                <div className="text-xs text-gray-500">Via Proximity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    (connectionHistory.filter((c) => c.status === "connected").length /
                      Math.max(connectionHistory.length, 1)) *
                      100,
                  )}
                  %
                </div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Proximity Connections</CardTitle>
            <CardDescription>Latest connection attempts via proximity detection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectionHistory.slice(0, 5).map((connection) => (
                <div key={connection.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{connection.name}</h4>
                      <Badge className={`text-xs ${getStatusColor(connection.status)}`}>{connection.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{connection.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Radar className="h-3 w-3" />
                        <span className="capitalize">{connection.method}</span>
                      </div>
                      <span>{formatTimeAgo(connection.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {connectionHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Radar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No proximity connections yet</p>
                  <p className="text-xs">Enable scanning to start discovering nearby users</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How Proximity Detection Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Local Device Discovery</h4>
                  <p className="text-xs text-gray-600">
                    Uses Bluetooth Low Energy and WiFi Direct to detect nearby devices
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Linkaroo Identification</h4>
                  <p className="text-xs text-gray-600">
                    Identifies which devices are running Linkaroo with encrypted handshake
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Secure Connection</h4>
                  <p className="text-xs text-gray-600">Establishes encrypted connection for contact sharing requests</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Mutual Consent</h4>
                  <p className="text-xs text-gray-600">Both users must approve the connection before contact sharing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Battery Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Privacy Protected</h4>
                  <p className="text-xs text-blue-700">
                    Device detection uses encrypted local protocols. No location data is transmitted to servers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Smartphone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Battery Optimized</h4>
                  <p className="text-xs text-blue-700">
                    Uses low-power scanning protocols. Disable background scanning to save battery.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Request Modal */}
      {pendingRequest && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <ConsentFlow
              request={pendingRequest}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onBlock={handleBlockUser}
            />
          </div>
        </div>
      )}

      <BottomNav activeTab="share" />
    </div>
  )
}

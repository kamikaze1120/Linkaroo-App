"use client"

import { useState } from "react"
import { ArrowLeft, Cloud, Smartphone, Shield, Download, Upload, RefreshCw, Check } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import BiometricAuth from "@/components/BiometricAuth"

interface BackupData {
  connections: number
  templates: number
  settings: number
  analytics: number
  lastBackup: number
  size: string
}

interface SyncDevice {
  id: string
  name: string
  type: "phone" | "tablet" | "desktop"
  lastSync: number
  status: "online" | "offline" | "syncing"
  platform: string
}

export default function BackupSyncScreen() {
  const [backupData, setBackupData] = useState<BackupData>({
    connections: 45,
    templates: 8,
    settings: 12,
    analytics: 30,
    lastBackup: Date.now() - 86400000, // 1 day ago
    size: "2.4 MB",
  })

  const [syncDevices, setSyncDevices] = useState<SyncDevice[]>([
    {
      id: "dev_001",
      name: "John's iPhone",
      type: "phone",
      lastSync: Date.now() - 3600000, // 1 hour ago
      status: "online",
      platform: "iOS 17.2",
    },
    {
      id: "dev_002",
      name: "John's iPad",
      type: "tablet",
      lastSync: Date.now() - 7200000, // 2 hours ago
      status: "offline",
      platform: "iPadOS 17.2",
    },
    {
      id: "dev_003",
      name: "Work MacBook",
      type: "desktop",
      lastSync: Date.now() - 14400000, // 4 hours ago
      status: "online",
      platform: "macOS 14.2",
    },
  ])

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    includeAnalytics: true,
    includeMessages: false,
    encryptBackup: true,
    cloudProvider: "icloud",
    maxBackups: 30,
  })

  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authAction, setAuthAction] = useState("")
  const [backupProgress, setBackupProgress] = useState(0)

  const cloudProviders = [
    { id: "icloud", name: "iCloud", icon: "☁️", available: true },
    { id: "google", name: "Google Drive", icon: "📁", available: true },
    { id: "dropbox", name: "Dropbox", icon: "📦", available: false },
    { id: "onedrive", name: "OneDrive", icon: "💾", available: false },
  ]

  const performBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup progress
    const steps = [
      { name: "Encrypting connections", progress: 25 },
      { name: "Compressing data", progress: 50 },
      { name: "Uploading to cloud", progress: 75 },
      { name: "Verifying backup", progress: 100 },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setBackupProgress(step.progress)
    }

    setBackupData((prev) => ({
      ...prev,
      lastBackup: Date.now(),
    }))

    setIsBackingUp(false)
    setBackupProgress(0)
  }

  const performSync = async () => {
    setIsSyncing(true)

    // Update device statuses
    setSyncDevices((prev) =>
      prev.map((device) => ({
        ...device,
        status: device.status === "online" ? "syncing" : device.status,
      })),
    )

    await new Promise((resolve) => setTimeout(resolve, 3000))

    setSyncDevices((prev) =>
      prev.map((device) => ({
        ...device,
        status: device.status === "syncing" ? "online" : device.status,
        lastSync: device.status === "syncing" ? Date.now() : device.lastSync,
      })),
    )

    setIsSyncing(false)
  }

  const restoreFromBackup = () => {
    setAuthAction("restore backup")
    setShowAuth(true)
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
    if (authAction === "restore backup") {
      alert("Backup restored successfully!")
    }
    setAuthAction("")
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "phone":
        return "📱"
      case "tablet":
        return "📱"
      case "desktop":
        return "💻"
      default:
        return "📱"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "offline":
        return "text-slate-400"
      case "syncing":
        return "text-blue-400"
      default:
        return "text-slate-400"
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/profile" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Backup & Sync</h1>
              <p className="text-slate-400 text-sm">Secure cloud backup and device synchronization</p>
            </div>
          </div>
          <Cloud className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Backup Status */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Cloud className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-bold text-lg">Cloud Backup</h3>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                backupData.lastBackup > Date.now() - 86400000
                  ? "bg-green-500/20 text-green-400"
                  : "bg-orange-500/20 text-orange-400"
              }`}
            >
              {backupData.lastBackup > Date.now() - 86400000 ? "Up to date" : "Needs backup"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">{backupData.size}</div>
              <div className="text-slate-400 text-sm">Backup Size</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">{formatTimeAgo(backupData.lastBackup)}</div>
              <div className="text-slate-400 text-sm">Last Backup</div>
            </div>
          </div>

          {/* Backup Contents */}
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-3">Backup Contents</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Connections:</span>
                <span className="text-white">{backupData.connections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Templates:</span>
                <span className="text-white">{backupData.templates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settings:</span>
                <span className="text-white">{backupData.settings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Analytics:</span>
                <span className="text-white">{backupData.analytics} days</span>
              </div>
            </div>
          </div>

          {/* Backup Progress */}
          {isBackingUp && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span>Backing up...</span>
                <span>{backupProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${backupProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Backup Actions */}
          <div className="flex space-x-3">
            <button
              onClick={performBackup}
              disabled={isBackingUp}
              className="flex-1 privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{isBackingUp ? "Backing up..." : "Backup Now"}</span>
            </button>
            <button
              onClick={restoreFromBackup}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Restore</span>
            </button>
          </div>
        </div>

        {/* Cloud Provider Selection */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Cloud Provider</h3>
          <div className="grid grid-cols-2 gap-3">
            {cloudProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() =>
                  provider.available &&
                  setBackupSettings({
                    ...backupSettings,
                    cloudProvider: provider.id,
                  })
                }
                disabled={!provider.available}
                className={`p-4 rounded-lg border transition-all text-left ${
                  backupSettings.cloudProvider === provider.id
                    ? "border-blue-500 bg-blue-500/20 text-blue-400"
                    : provider.available
                      ? "border-slate-600 text-slate-300 hover:border-slate-500"
                      : "border-slate-700 text-slate-500 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    {!provider.available && <p className="text-xs opacity-75">Coming soon</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Device Sync */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-bold text-lg">Device Sync</h3>
            </div>
            <button
              onClick={performSync}
              disabled={isSyncing}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync All"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {syncDevices.map((device) => (
              <div key={device.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getDeviceIcon(device.type)}</span>
                    <div>
                      <h4 className="text-white font-medium">{device.name}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-slate-400">{device.platform}</span>
                        <span className="text-slate-500">•</span>
                        <span className={getStatusColor(device.status)}>
                          {device.status === "syncing" ? "Syncing..." : device.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm">{formatTimeAgo(device.lastSync)}</div>
                    {device.status === "online" && <Check className="w-4 h-4 text-green-400 ml-auto mt-1" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Backup Settings</h3>
          <div className="space-y-4">
            {[
              { key: "autoBackup", label: "Automatic Backup", desc: "Automatically backup data daily" },
              { key: "includeAnalytics", label: "Include Analytics", desc: "Backup usage analytics and insights" },
              { key: "includeMessages", label: "Include Messages", desc: "Backup message history (encrypted)" },
              { key: "encryptBackup", label: "Encrypt Backup", desc: "Use end-to-end encryption for backups" },
            ].map((setting) => (
              <div key={setting.key} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium">{setting.label}</h5>
                    <p className="text-slate-400 text-sm">{setting.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setBackupSettings({
                        ...backupSettings,
                        [setting.key]: !backupSettings[setting.key as keyof typeof backupSettings],
                      })
                    }
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      backupSettings[setting.key as keyof typeof backupSettings] ? "bg-blue-600" : "bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        backupSettings[setting.key as keyof typeof backupSettings] ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            ))}

            {/* Backup Frequency */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Backup Frequency</h5>
                  <p className="text-slate-400 text-sm">How often to create automatic backups</p>
                </div>
                <select
                  value={backupSettings.backupFrequency}
                  onChange={(e) =>
                    setBackupSettings({
                      ...backupSettings,
                      backupFrequency: e.target.value,
                    })
                  }
                  className="px-3 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-green-400 font-medium mb-2">End-to-End Encryption</h4>
              <p className="text-slate-300 text-sm">
                All backups are encrypted with your device's secure enclave before leaving your device. Even cloud
                providers cannot access your data without your biometric authentication.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Authentication Modal */}
      <BiometricAuth
        isVisible={showAuth}
        onSuccess={handleAuthSuccess}
        onCancel={() => setShowAuth(false)}
        action={authAction}
      />

      <BottomNav activeTab="profile" />
    </div>
  )
}

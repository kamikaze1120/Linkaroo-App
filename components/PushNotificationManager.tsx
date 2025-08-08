"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff } from "lucide-react"

interface NotificationSettings {
  connectionRequests: boolean
  messageAlerts: boolean
  callAlerts: boolean
  expirationWarnings: boolean
  emergencyAlerts: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [settings, setSettings] = useState<NotificationSettings>({
    connectionRequests: true,
    messageAlerts: true,
    callAlerts: true,
    expirationWarnings: true,
    emergencyAlerts: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  })

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === "granted") {
        // Register service worker for push notifications
        const registration = await navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker registered:", registration)

        // Show welcome notification
        showNotification("Linkaroo Notifications", {
          body: "You'll now receive secure connection alerts",
          icon: "/icon-192.png",
          badge: "/badge-72.png",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
    }
  }

  const showNotification = (title: string, options: NotificationOptions) => {
    if (permission === "granted") {
      new Notification(title, {
        ...options,
        tag: "linkaroo-notification",
        requireInteraction: true,
      })
    }
  }

  const sendTestNotification = () => {
    showNotification("Test Notification", {
      body: "This is a test notification from Linkaroo",
      icon: "/icon-192.png",
    })
  }

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateQuietHours = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value },
    }))
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Push Notifications</h3>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            permission === "granted"
              ? "bg-green-500/20 text-green-400"
              : permission === "denied"
                ? "bg-red-500/20 text-red-400"
                : "bg-orange-500/20 text-orange-400"
          }`}
        >
          {permission === "granted" ? "Enabled" : permission === "denied" ? "Blocked" : "Not Set"}
        </div>
      </div>

      {!isSupported && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">Push notifications are not supported in this browser.</p>
        </div>
      )}

      {permission === "default" && (
        <div className="text-center mb-6">
          <p className="text-slate-400 text-sm mb-4">Enable notifications to receive real-time connection alerts</p>
          <button
            onClick={requestPermission}
            className="privacy-gradient text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {permission === "granted" && (
        <div className="space-y-4">
          {/* Notification Types */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Notification Types</h4>
            {[
              { key: "connectionRequests", label: "Connection Requests", desc: "New contact sharing requests" },
              { key: "messageAlerts", label: "Message Alerts", desc: "New messages from connections" },
              { key: "callAlerts", label: "Call Alerts", desc: "Incoming calls from connections" },
              { key: "expirationWarnings", label: "Expiration Warnings", desc: "Connection expiry reminders" },
              { key: "emergencyAlerts", label: "Emergency Alerts", desc: "Emergency contact notifications" },
            ].map((item) => (
              <div key={item.key} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium">{item.label}</h5>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      updateSetting(
                        item.key as keyof NotificationSettings,
                        !settings[item.key as keyof NotificationSettings],
                      )
                    }
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings[item.key as keyof NotificationSettings] ? "bg-blue-600" : "bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings[item.key as keyof NotificationSettings] ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quiet Hours */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="text-white font-medium">Quiet Hours</h5>
                <p className="text-slate-400 text-sm">Disable notifications during specific hours</p>
              </div>
              <button
                onClick={() => updateQuietHours("enabled", !settings.quietHours.enabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.quietHours.enabled ? "bg-blue-600" : "bg-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.quietHours.enabled ? "right-0.5" : "left-0.5"
                  }`}
                ></div>
              </button>
            </div>
            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Start Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => updateQuietHours("start", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">End Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => updateQuietHours("end", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Test Notification */}
          <button
            onClick={sendTestNotification}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all"
          >
            Send Test Notification
          </button>
        </div>
      )}

      {permission === "denied" && (
        <div className="text-center">
          <BellOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-medium mb-2">Notifications Blocked</p>
          <p className="text-slate-400 text-sm mb-4">
            To enable notifications, please allow them in your browser settings
          </p>
          <button
            onClick={() => window.open("chrome://settings/content/notifications", "_blank")}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            Open Browser Settings
          </button>
        </div>
      )}
    </div>
  )
}

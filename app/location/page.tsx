"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Wifi, Users, Shield, Navigation } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

interface GeofenceZone {
  id: string
  name: string
  type: "home" | "work" | "custom"
  latitude: number
  longitude: number
  radius: number
  actions: {
    autoAccept: boolean
    autoReject: boolean
    changeAvailability: boolean
    notifyContacts: boolean
  }
  activeConnections: string[]
  isActive: boolean
}

export default function LocationFeaturesScreen() {
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geofences, setGeofences] = useState<GeofenceZone[]>([
    {
      id: "geo_001",
      name: "Home",
      type: "home",
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100,
      actions: {
        autoAccept: true,
        autoReject: false,
        changeAvailability: true,
        notifyContacts: false,
      },
      activeConnections: ["family", "friends"],
      isActive: true,
    },
    {
      id: "geo_002",
      name: "Office",
      type: "work",
      latitude: 37.7849,
      longitude: -122.4094,
      radius: 50,
      actions: {
        autoAccept: false,
        autoReject: true,
        changeAvailability: true,
        notifyContacts: true,
      },
      activeConnections: ["work"],
      isActive: true,
    },
  ])

  const [nearbyDevices, setNearbyDevices] = useState([
    { id: "dev_001", name: "Sarah's iPhone", distance: 15, rssi: -45, lastSeen: Date.now() - 30000 },
    { id: "dev_002", name: "Mike's Android", distance: 8, rssi: -38, lastSeen: Date.now() - 60000 },
    { id: "dev_003", name: "Lisa's Phone", distance: 25, rssi: -52, lastSeen: Date.now() - 120000 },
  ])

  const [locationSettings, setLocationSettings] = useState({
    enableGeofencing: true,
    enableNearbyDetection: true,
    shareLocationInEmergency: true,
    preciseLocation: false,
    backgroundLocation: true,
    locationHistory: false,
  })

  const [showCreateGeofence, setShowCreateGeofence] = useState(false)
  const [newGeofence, setNewGeofence] = useState<Partial<GeofenceZone>>({
    name: "",
    type: "custom",
    radius: 100,
    actions: {
      autoAccept: false,
      autoReject: false,
      changeAvailability: false,
      notifyContacts: false,
    },
    activeConnections: [],
    isActive: true,
  })

  useEffect(() => {
    checkLocationPermission()
    if (locationSettings.enableNearbyDetection) {
      simulateNearbyDevices()
    }
  }, [locationSettings.enableNearbyDetection])

  const checkLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        })
        setLocationPermission("granted")
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      } catch (error) {
        setLocationPermission("denied")
      }
    }
  }

  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        setLocationPermission("granted")
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      } catch (error) {
        setLocationPermission("denied")
      }
    }
  }

  const simulateNearbyDevices = () => {
    const interval = setInterval(() => {
      setNearbyDevices((prev) =>
        prev.map((device) => ({
          ...device,
          distance: Math.max(5, device.distance + (Math.random() - 0.5) * 10),
          rssi: Math.max(-80, Math.min(-30, device.rssi + (Math.random() - 0.5) * 10)),
          lastSeen: Date.now() - Math.random() * 300000,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }

  const createGeofence = () => {
    if (!currentLocation || !newGeofence.name) return

    const geofence: GeofenceZone = {
      id: `geo_${Date.now()}`,
      name: newGeofence.name,
      type: newGeofence.type || "custom",
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      radius: newGeofence.radius || 100,
      actions: newGeofence.actions || {
        autoAccept: false,
        autoReject: false,
        changeAvailability: false,
        notifyContacts: false,
      },
      activeConnections: newGeofence.activeConnections || [],
      isActive: true,
    }

    setGeofences([...geofences, geofence])
    setNewGeofence({
      name: "",
      type: "custom",
      radius: 100,
      actions: {
        autoAccept: false,
        autoReject: false,
        changeAvailability: false,
        notifyContacts: false,
      },
      activeConnections: [],
      isActive: true,
    })
    setShowCreateGeofence(false)
  }

  const toggleGeofence = (id: string) => {
    setGeofences(geofences.map((geo) => (geo.id === id ? { ...geo, isActive: !geo.isActive } : geo)))
  }

  const deleteGeofence = (id: string) => {
    setGeofences(geofences.filter((geo) => geo.id !== id))
  }

  const getZoneIcon = (type: string) => {
    switch (type) {
      case "home":
        return "🏠"
      case "work":
        return "🏢"
      default:
        return "📍"
    }
  }

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    }
    return `${(distance / 1000).toFixed(1)}km`
  }

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return "Excellent"
    if (rssi > -60) return "Good"
    if (rssi > -70) return "Fair"
    return "Weak"
  }

  if (showCreateGeofence) {
    return (
      <div className="min-h-screen pb-20">
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateGeofence(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Create Geofence</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Zone Name</label>
                <input
                  type="text"
                  value={newGeofence.name}
                  onChange={(e) => setNewGeofence({ ...newGeofence, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter zone name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Zone Type</label>
                <select
                  value={newGeofence.type}
                  onChange={(e) => setNewGeofence({ ...newGeofence, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Radius (meters)</label>
                <input
                  type="number"
                  value={newGeofence.radius}
                  onChange={(e) => setNewGeofence({ ...newGeofence, radius: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="10"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Automatic Actions</label>
                <div className="space-y-3">
                  {[
                    {
                      key: "autoAccept",
                      label: "Auto-Accept Requests",
                      desc: "Automatically accept connection requests in this zone",
                    },
                    {
                      key: "autoReject",
                      label: "Auto-Reject Requests",
                      desc: "Automatically reject connection requests in this zone",
                    },
                    {
                      key: "changeAvailability",
                      label: "Change Availability",
                      desc: "Update your availability status in this zone",
                    },
                    {
                      key: "notifyContacts",
                      label: "Notify Contacts",
                      desc: "Notify selected contacts when entering this zone",
                    },
                  ].map((action) => (
                    <div key={action.key} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-white font-medium">{action.label}</h5>
                          <p className="text-slate-400 text-sm">{action.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setNewGeofence({
                              ...newGeofence,
                              actions: {
                                ...newGeofence.actions!,
                                [action.key]: !newGeofence.actions![action.key as keyof typeof newGeofence.actions],
                              },
                            })
                          }
                          className={`w-12 h-6 rounded-full relative transition-colors ${
                            newGeofence.actions![action.key as keyof typeof newGeofence.actions]
                              ? "bg-blue-600"
                              : "bg-slate-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              newGeofence.actions![action.key as keyof typeof newGeofence.actions]
                                ? "right-0.5"
                                : "left-0.5"
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateGeofence(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createGeofence}
                  className="flex-1 privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all"
                  disabled={!newGeofence.name || !currentLocation}
                >
                  Create Geofence
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-white">Location Features</h1>
              <p className="text-slate-400 text-sm">Geofencing and proximity-based automation</p>
            </div>
          </div>
          <MapPin className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Permission */}
        {locationPermission !== "granted" && (
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="text-center">
              <Navigation className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-orange-400 font-bold text-lg mb-2">Location Access Required</h3>
              <p className="text-slate-300 text-sm mb-4">
                Enable location access to use geofencing and proximity features
              </p>
              <button
                onClick={requestLocationPermission}
                className="privacy-gradient text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all"
              >
                Enable Location Access
              </button>
            </div>
          </div>
        )}

        {/* Current Location */}
        {currentLocation && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-bold text-lg">Current Location</h3>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Latitude:</span>
                  <span className="text-white ml-2">{currentLocation.lat.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Longitude:</span>
                  <span className="text-white ml-2">{currentLocation.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Settings */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Location Settings</h3>
          <div className="space-y-4">
            {[
              {
                key: "enableGeofencing",
                label: "Enable Geofencing",
                desc: "Automatically trigger actions based on location",
              },
              {
                key: "enableNearbyDetection",
                label: "Nearby Device Detection",
                desc: "Detect other Linkaroo users nearby",
              },
              {
                key: "shareLocationInEmergency",
                label: "Emergency Location Sharing",
                desc: "Share precise location during emergencies",
              },
              { key: "preciseLocation", label: "Precise Location", desc: "Use GPS for more accurate positioning" },
              {
                key: "backgroundLocation",
                label: "Background Location",
                desc: "Allow location access when app is closed",
              },
              { key: "locationHistory", label: "Location History", desc: "Store location history for analytics" },
            ].map((setting) => (
              <div key={setting.key} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium">{setting.label}</h5>
                    <p className="text-slate-400 text-sm">{setting.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setLocationSettings({
                        ...locationSettings,
                        [setting.key]: !locationSettings[setting.key as keyof typeof locationSettings],
                      })
                    }
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      locationSettings[setting.key as keyof typeof locationSettings] ? "bg-blue-600" : "bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        locationSettings[setting.key as keyof typeof locationSettings] ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geofence Zones */}
        {locationSettings.enableGeofencing && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Geofence Zones ({geofences.length})</h3>
              <button
                onClick={() => setShowCreateGeofence(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                disabled={!currentLocation}
              >
                Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {geofences.map((zone) => (
                <div key={zone.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getZoneIcon(zone.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-white font-medium">{zone.name}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              zone.isActive ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"
                            }`}
                          >
                            {zone.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">Radius: {formatDistance(zone.radius)}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {zone.actions.autoAccept && (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">Auto-Accept</span>
                          )}
                          {zone.actions.autoReject && (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">Auto-Reject</span>
                          )}
                          {zone.actions.changeAvailability && (
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Availability</span>
                          )}
                          {zone.actions.notifyContacts && (
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Notify</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleGeofence(zone.id)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          zone.isActive
                            ? "bg-orange-600 hover:bg-orange-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {zone.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => deleteGeofence(zone.id)}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs font-medium transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Devices */}
        {locationSettings.enableNearbyDetection && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center space-x-3 mb-4">
              <Wifi className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-bold text-lg">Nearby Devices</h3>
            </div>

            <div className="space-y-3">
              {nearbyDevices.map((device) => (
                <div key={device.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="text-white font-medium">{device.name}</h4>
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span>{formatDistance(device.distance)} away</span>
                          <span>Signal: {getSignalStrength(device.rssi)}</span>
                          <span>Last seen: {Math.floor((Date.now() - device.lastSeen) / 60000)}m ago</span>
                        </div>
                      </div>
                    </div>
                    <button className="privacy-gradient text-white px-3 py-1 rounded text-xs font-medium hover:opacity-90 transition-all">
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {nearbyDevices.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h4 className="text-white font-medium mb-2">No Nearby Devices</h4>
                <p className="text-slate-400 text-sm">Other Linkaroo users will appear here when they're nearby</p>
              </div>
            )}
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Location Privacy</h4>
              <p className="text-slate-300 text-sm">
                Your precise location is never shared with other users. Geofencing and nearby detection work locally on
                your device to protect your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  User,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  Brain,
  Cloud,
  MapPin,
  Layers,
} from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import PushNotificationManager from "@/components/PushNotificationManager"

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
  })

  const [showRealNumber, setShowRealNumber] = useState(false)

  const activeConnections = [
    { name: "Sarah M.", maskedNumber: "+1 (555) 123-XXXX", duration: "5 days" },
    { name: "Mike J.", maskedNumber: "+1 (555) 456-XXXX", duration: "2 days" },
    { name: "Lisa K.", maskedNumber: "+1 (555) 789-XXXX", duration: "1 day" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-white">Profile & Privacy</h1>
        </div>

        {/* Profile Picture & Masked ID */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 text-center">
          <div className="w-24 h-24 privacy-gradient rounded-full flex items-center justify-center mx-auto mb-4 secure-glow">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{profileData.name}</h2>
          <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
            <p className="text-slate-400 text-sm mb-1">Your Masked Number</p>
            <p className="text-blue-400 font-mono text-lg">+1 (555) 999-XXXX</p>
          </div>
        </div>

        {/* Real Contact Info */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Your Real Information</h3>
            <Shield className="w-5 h-5 text-green-400" />
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Real Phone Number</label>
              <div className="relative">
                <input
                  type={showRealNumber ? "tel" : "password"}
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowRealNumber(!showRealNumber)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showRealNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">🔒 Always masked when shared</p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button className="w-full privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all">
              Update Profile
            </button>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Advanced Features</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/analytics" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <TrendingUp className="w-6 h-6 text-blue-400 mb-2" />
              <h4 className="text-white font-medium text-sm">Analytics</h4>
              <p className="text-slate-400 text-xs">Connection insights</p>
            </Link>
            <Link href="/emergency" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
              <h4 className="text-white font-medium text-sm">Emergency</h4>
              <p className="text-slate-400 text-xs">Emergency contacts</p>
            </Link>
            <Link href="/scheduling" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <Clock className="w-6 h-6 text-green-400 mb-2" />
              <h4 className="text-white font-medium text-sm">Scheduling</h4>
              <p className="text-slate-400 text-xs">Availability hours</p>
            </Link>
            <Link href="/bulk-consent" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <Users className="w-6 h-6 text-purple-400 mb-2" />
              <h4 className="text-white font-medium text-sm">Bulk Actions</h4>
              <p className="text-slate-400 text-xs">Manage multiple</p>
            </Link>
            <Link href="/templates" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <Layers className="w-6 h-6 text-orange-400 mb-2" />
              <h4 className="text-white font-medium text-sm">Templates</h4>
              <p className="text-slate-400 text-xs">Connection presets</p>
            </Link>
            <Link href="/location" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <MapPin className="w-6 h-6 text-cyan-400 mb-2" />
              <h4 className="text-white font-medium text-sm">Location</h4>
              <p className="text-slate-400 text-xs">Geofencing</p>
            </Link>
            <Link href="/ai-insights" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <Brain className="w-6 h-6 text-pink-400 mb-2" />
              <h4 className="text-white font-medium text-sm">AI Insights</h4>
              <p className="text-slate-400 text-xs">Smart recommendations</p>
            </Link>
            <Link href="/backup-sync" className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all">
              <Cloud className="w-6 h-6 text-indigo-400 mb-2" />
              <h4 className="text-white font-medium text-sm">Backup & Sync</h4>
              <p className="text-slate-400 text-xs">Cloud storage</p>
            </Link>
          </div>
        </div>

        {/* Notifications Settings */}
        <PushNotificationManager />

        {/* Active Connections Management */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Active Connections ({activeConnections.length})</h3>
          <div className="space-y-3">
            {activeConnections.map((connection, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{connection.name}</p>
                  <p className="text-slate-400 text-sm">{connection.maskedNumber}</p>
                  <p className="text-slate-500 text-xs">Connected for {connection.duration}</p>
                </div>
                <button className="p-2 bg-red-600/20 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-accept nearby requests</p>
                <p className="text-slate-400 text-sm">Automatically accept requests from nearby devices</p>
              </div>
              <button className="w-12 h-6 bg-slate-600 rounded-full relative transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Connection timeout</p>
                <p className="text-slate-400 text-sm">Auto-revoke connections after 7 days</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <Link href="/">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </Link>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

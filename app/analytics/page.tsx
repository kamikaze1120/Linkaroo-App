"use client"

import { useState } from "react"
import { ArrowLeft, TrendingUp, Users, Phone, MessageCircle, Clock, BarChart3, PieChart } from 'lucide-react'
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import AnimatedBackdrop from "@/components/animated-backdrop"

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  const analyticsData = {
    "7d": {
      totalConnections: 12,
      activeConnections: 8,
      newConnections: 3,
      totalCalls: 24,
      totalMessages: 156,
      averageConnectionDuration: 4.2,
      peakHours: [14, 15, 16, 19, 20],
      connectionMethods: { qr: 60, nearby: 25, nfc: 15 },
      dailyActivity: [
        { date: "Mon", calls: 4, messages: 23, connections: 1 },
        { date: "Tue", calls: 2, messages: 18, connections: 0 },
        { date: "Wed", calls: 6, messages: 31, connections: 2 },
        { date: "Thu", calls: 3, messages: 22, connections: 0 },
        { date: "Fri", calls: 5, messages: 28, connections: 0 },
        { date: "Sat", calls: 2, messages: 19, connections: 0 },
        { date: "Sun", calls: 2, messages: 15, connections: 0 },
      ],
    },
    "30d": {
      totalConnections: 45,
      activeConnections: 32,
      newConnections: 12,
      totalCalls: 89,
      totalMessages: 567,
      averageConnectionDuration: 12.8,
      peakHours: [9, 10, 14, 15, 19, 20],
      connectionMethods: { qr: 55, nearby: 30, nfc: 15 },
      dailyActivity: [
        { date: "Week 1", calls: 18, messages: 142, connections: 4 },
        { date: "Week 2", calls: 23, messages: 156, connections: 3 },
        { date: "Week 3", calls: 21, messages: 134, connections: 2 },
        { date: "Week 4", calls: 27, messages: 135, connections: 3 },
      ],
    },
    "90d": {
      totalConnections: 128,
      activeConnections: 67,
      newConnections: 28,
      totalCalls: 234,
      totalMessages: 1456,
      averageConnectionDuration: 18.5,
      peakHours: [9, 10, 11, 14, 15, 19, 20, 21],
      connectionMethods: { qr: 50, nearby: 35, nfc: 15 },
      dailyActivity: [
        { date: "Month 1", calls: 67, messages: 423, connections: 8 },
        { date: "Month 2", calls: 89, messages: 567, connections: 12 },
        { date: "Month 3", calls: 78, messages: 466, connections: 8 },
      ],
    },
  }

  const data = analyticsData[timeRange]

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d":
        return "Last 7 Days"
      case "30d":
        return "Last 30 Days"
      case "90d":
        return "Last 90 Days"
      default:
        return "Last 30 Days"
    }
  }

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackdrop intensity="subtle" />
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Connection Analytics</h1>
              <p className="text-slate-400 text-sm">Insights into your connection patterns</p>
            </div>
          </div>
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                timeRange === range ? "bg-blue-600 text-white" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {getTimeRangeLabel(range)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Total Connections</span>
            </div>
            <div className="text-2xl font-bold text-white">{data.totalConnections}</div>
            <div className="text-green-400 text-xs">+{data.newConnections} new</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Total Calls</span>
            </div>
            <div className="text-2xl font-bold text-white">{data.totalCalls}</div>
            <div className="text-slate-400 text-xs">
              {(data.totalCalls / data.totalConnections).toFixed(1)} avg/connection
            </div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">Total Messages</span>
            </div>
            <div className="text-2xl font-bold text-white">{data.totalMessages}</div>
            <div className="text-slate-400 text-xs">
              {(data.totalMessages / data.totalConnections).toFixed(1)} avg/connection
            </div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-slate-400 text-sm">Avg Duration</span>
            </div>
            <div className="text-2xl font-bold text-white">{data.averageConnectionDuration}</div>
            <div className="text-slate-400 text-xs">days per connection</div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Activity Overview</h3>
          </div>
          <div className="space-y-4">
            {data.dailyActivity.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">{day.date}</span>
                  <div className="flex space-x-4 text-xs">
                    <span className="text-green-400">{day.calls} calls</span>
                    <span className="text-purple-400">{day.messages} messages</span>
                    <span className="text-blue-400">{day.connections} new</span>
                  </div>
                </div>
                <div className="flex space-x-1 h-2">
                  <div
                    className="bg-green-500 rounded-full"
                    style={{ width: `${(day.calls / Math.max(...data.dailyActivity.map((d) => d.calls))) * 100}%` }}
                  ></div>
                  <div
                    className="bg-purple-500 rounded-full"
                    style={{
                      width: `${(day.messages / Math.max(...data.dailyActivity.map((d) => d.messages))) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="bg-blue-500 rounded-full"
                    style={{
                      width: `${(day.connections / Math.max(...data.dailyActivity.map((d) => d.connections))) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Methods */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Connection Methods</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">QR Code Scan</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{data.connectionMethods.qr}%</div>
                <div className="w-20 h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${data.connectionMethods.qr}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Nearby Discovery</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{data.connectionMethods.nearby}%</div>
                <div className="w-20 h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${data.connectionMethods.nearby}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-slate-300">NFC Tap</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{data.connectionMethods.nfc}%</div>
                <div className="w-20 h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${data.connectionMethods.nfc}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Peak Activity Hours</h3>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-center">
                <div
                  className={`h-8 rounded-sm mb-1 ${data.peakHours.includes(i) ? "bg-blue-500" : "bg-slate-700"}`}
                ></div>
                <div className="text-xs text-slate-400">{i.toString().padStart(2, "0")}</div>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-3">
            Most active hours: {data.peakHours.map((h) => `${h}:00`).join(", ")}
          </p>
        </div>

        {/* Privacy Insights */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold text-lg mb-3">🔒 Privacy Insights</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Real numbers protected:</span>
              <span className="text-blue-400 font-medium">{data.totalConnections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Active masked connections:</span>
              <span className="text-blue-400 font-medium">{data.activeConnections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Privacy score:</span>
              <span className="text-green-400 font-medium">Excellent</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav activeTab="home" />
    </div>
  )
}

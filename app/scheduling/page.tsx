"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Calendar, Users, Plus, Edit, Trash2, Moon, Sun } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

interface Schedule {
  id: string
  name: string
  type: "availability" | "quiet_hours" | "work_hours" | "custom"
  days: string[]
  startTime: string
  endTime: string
  connections: string[]
  active: boolean
}

export default function SchedulingScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "sch_001",
      name: "Work Hours",
      type: "work_hours",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      startTime: "09:00",
      endTime: "17:00",
      connections: ["all"],
      active: true,
    },
    {
      id: "sch_002",
      name: "Quiet Hours",
      type: "quiet_hours",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      startTime: "22:00",
      endTime: "08:00",
      connections: ["all"],
      active: true,
    },
    {
      id: "sch_003",
      name: "Weekend Availability",
      type: "availability",
      days: ["saturday", "sunday"],
      startTime: "10:00",
      endTime: "20:00",
      connections: ["family", "friends"],
      active: true,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    name: "",
    type: "availability",
    days: [],
    startTime: "09:00",
    endTime: "17:00",
    connections: ["all"],
    active: true,
  })

  const dayLabels = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  }

  const connectionOptions = [
    { value: "all", label: "All Connections" },
    { value: "family", label: "Family" },
    { value: "friends", label: "Friends" },
    { value: "work", label: "Work Contacts" },
    { value: "emergency", label: "Emergency Only" },
  ]

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case "work_hours":
        return <Clock className="w-5 h-5 text-blue-400" />
      case "quiet_hours":
        return <Moon className="w-5 h-5 text-purple-400" />
      case "availability":
        return <Sun className="w-5 h-5 text-green-400" />
      default:
        return <Calendar className="w-5 h-5 text-orange-400" />
    }
  }

  const getScheduleColor = (type: string) => {
    switch (type) {
      case "work_hours":
        return "border-blue-500/30 bg-blue-500/10"
      case "quiet_hours":
        return "border-purple-500/30 bg-purple-500/10"
      case "availability":
        return "border-green-500/30 bg-green-500/10"
      default:
        return "border-orange-500/30 bg-orange-500/10"
    }
  }

  const toggleDay = (day: string) => {
    const currentDays = newSchedule.days || []
    const updatedDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day]
    setNewSchedule({ ...newSchedule, days: updatedDays })
  }

  const addSchedule = () => {
    const schedule: Schedule = {
      id: `sch_${Date.now()}`,
      name: newSchedule.name || "New Schedule",
      type: newSchedule.type || "availability",
      days: newSchedule.days || [],
      startTime: newSchedule.startTime || "09:00",
      endTime: newSchedule.endTime || "17:00",
      connections: newSchedule.connections || ["all"],
      active: true,
    }
    setSchedules([...schedules, schedule])
    setNewSchedule({
      name: "",
      type: "availability",
      days: [],
      startTime: "09:00",
      endTime: "17:00",
      connections: ["all"],
      active: true,
    })
    setShowAddForm(false)
  }

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((schedule) => (schedule.id === id ? { ...schedule, active: !schedule.active } : schedule)),
    )
  }

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  if (showAddForm) {
    return (
      <div className="min-h-screen pb-20">
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Create Schedule</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <form className="space-y-6">
              {/* Schedule Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Schedule Name</label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter schedule name"
                />
              </div>

              {/* Schedule Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Schedule Type</label>
                <select
                  value={newSchedule.type}
                  onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="availability">Availability Hours</option>
                  <option value="work_hours">Work Hours</option>
                  <option value="quiet_hours">Quiet Hours</option>
                  <option value="custom">Custom Schedule</option>
                </select>
              </div>

              {/* Days Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Active Days</label>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(dayLabels).map(([day, label]) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        newSchedule.days?.includes(day)
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Connection Groups */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Apply to Connections</label>
                <div className="space-y-2">
                  {connectionOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const current = newSchedule.connections || []
                        const updated = current.includes(option.value)
                          ? current.filter((c) => c !== option.value)
                          : [...current, option.value]
                        setNewSchedule({ ...newSchedule, connections: updated })
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        newSchedule.connections?.includes(option.value)
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addSchedule}
                  className="flex-1 privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all"
                  disabled={!newSchedule.name || !newSchedule.days?.length}
                >
                  Create Schedule
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
              <h1 className="text-2xl font-bold text-white">Connection Scheduling</h1>
              <p className="text-slate-400 text-sm">Control when connections can reach you</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Status */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Current Status</h3>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h4 className="text-green-400 font-medium">Available</h4>
                <p className="text-slate-300 text-sm">All connections can reach you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Schedules */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">
              Active Schedules ({schedules.filter((s) => s.active).length})
            </h3>
            <Users className="w-5 h-5 text-blue-400" />
          </div>

          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`rounded-lg p-4 border ${getScheduleColor(schedule.type)} ${
                  !schedule.active ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getScheduleIcon(schedule.type)}
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{schedule.name}</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-300 text-sm">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {schedule.days.map((day) => (
                          <span key={day} className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                            {dayLabels[day as keyof typeof dayLabels]}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs">Applies to: {schedule.connections.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        schedule.active ? "bg-blue-600" : "bg-slate-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                          schedule.active ? "right-1" : "left-1"
                        }`}
                      ></div>
                    </button>
                    <button
                      onClick={() => setEditingSchedule(schedule.id)}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {schedules.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h4 className="text-white font-medium mb-2">No Schedules Created</h4>
              <p className="text-slate-400 text-sm mb-4">Create schedules to control when connections can reach you</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="privacy-gradient text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-all"
              >
                Create First Schedule
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:bg-slate-700/80 transition-all text-left">
            <Moon className="w-6 h-6 text-purple-400 mb-2" />
            <h4 className="text-white font-medium mb-1">Do Not Disturb</h4>
            <p className="text-slate-400 text-xs">Block all connections temporarily</p>
          </button>
          <button className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:bg-slate-700/80 transition-all text-left">
            <Sun className="w-6 h-6 text-green-400 mb-2" />
            <h4 className="text-white font-medium mb-1">Always Available</h4>
            <p className="text-slate-400 text-xs">Override all schedules</p>
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">🔒 Scheduling Privacy</h4>
          <p className="text-slate-300 text-sm">
            Schedules control when connections can reach you, but emergency contacts can always override these settings.
          </p>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

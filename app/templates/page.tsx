"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Edit, Trash2, Copy, Users, Briefcase, Heart, Shield, Star } from 'lucide-react'
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

interface ConnectionTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  permissions: {
    call: boolean
    message: boolean
    shareProfile: boolean
  }
  duration: string
  autoApprove: boolean
  tags: string[]
  usageCount: number
}

export default function ConnectionTemplatesScreen() {
  const [templates, setTemplates] = useState<ConnectionTemplate[]>([
    {
      id: "temp_001",
      name: "Family & Close Friends",
      description: "Full access for trusted family members and close friends",
      icon: "heart",
      color: "bg-red-500",
      permissions: { call: true, message: true, shareProfile: true },
      duration: "permanent",
      autoApprove: false,
      tags: ["family", "friends", "trusted"],
      usageCount: 12,
    },
    {
      id: "temp_002",
      name: "Work Colleagues",
      description: "Professional contacts with business hours restrictions",
      icon: "briefcase",
      color: "bg-blue-500",
      permissions: { call: true, message: true, shareProfile: false },
      duration: "30_days",
      autoApprove: false,
      tags: ["work", "professional", "business"],
      usageCount: 8,
    },
    {
      id: "temp_003",
      name: "Casual Acquaintances",
      description: "Limited access for people you've just met",
      icon: "users",
      color: "bg-green-500",
      permissions: { call: false, message: true, shareProfile: false },
      duration: "7_days",
      autoApprove: false,
      tags: ["casual", "new", "limited"],
      usageCount: 15,
    },
    {
      id: "temp_004",
      name: "Emergency Contacts",
      description: "Special permissions for emergency situations",
      icon: "shield",
      color: "bg-orange-500",
      permissions: { call: true, message: true, shareProfile: true },
      duration: "permanent",
      autoApprove: true,
      tags: ["emergency", "priority", "always"],
      usageCount: 3,
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<ConnectionTemplate>>({
    name: "",
    description: "",
    icon: "users",
    color: "bg-blue-500",
    permissions: { call: true, message: true, shareProfile: false },
    duration: "7_days",
    autoApprove: false,
    tags: [],
  })

  const iconOptions = [
    { value: "heart", icon: Heart, label: "Heart" },
    { value: "briefcase", icon: Briefcase, label: "Briefcase" },
    { value: "users", icon: Users, label: "Users" },
    { value: "shield", icon: Shield, label: "Shield" },
    { value: "star", icon: Star, label: "Star" },
  ]

  const colorOptions = [
    { value: "bg-red-500", label: "Red" },
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
  ]

  const getIcon = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName)
    return iconOption ? iconOption.icon : Users
  }

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "1_day":
        return "1 Day"
      case "7_days":
        return "7 Days"
      case "30_days":
        return "30 Days"
      case "permanent":
        return "Permanent"
      default:
        return "7 Days"
    }
  }

  const createTemplate = () => {
    const template: ConnectionTemplate = {
      id: `temp_${Date.now()}`,
      name: newTemplate.name || "New Template",
      description: newTemplate.description || "",
      icon: newTemplate.icon || "users",
      color: newTemplate.color || "bg-blue-500",
      permissions: newTemplate.permissions || { call: true, message: true, shareProfile: false },
      duration: newTemplate.duration || "7_days",
      autoApprove: newTemplate.autoApprove || false,
      tags: newTemplate.tags || [],
      usageCount: 0,
    }
    setTemplates([...templates, template])
    setNewTemplate({
      name: "",
      description: "",
      icon: "users",
      color: "bg-blue-500",
      permissions: { call: true, message: true, shareProfile: false },
      duration: "7_days",
      autoApprove: false,
      tags: [],
    })
    setShowCreateForm(false)
  }

  const duplicateTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      const duplicate: ConnectionTemplate = {
        ...template,
        id: `temp_${Date.now()}`,
        name: `${template.name} (Copy)`,
        usageCount: 0,
      }
      setTemplates([...templates, duplicate])
    }
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
  }

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      // Update usage count
      setTemplates(templates.map((t) => (t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t)))

      // In a real app, this would apply the template to a connection request
      alert(`Applied template "${template.name}" to connection request!`)
    }
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen pb-20">
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Create Template</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <form className="space-y-6">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter template name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                  placeholder="Describe when to use this template"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Icon</label>
                <div className="grid grid-cols-5 gap-3">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewTemplate({ ...newTemplate, icon: option.value })}
                      className={`p-4 rounded-lg border transition-all ${
                        newTemplate.icon === option.value
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <option.icon className="w-6 h-6 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Color</label>
                <div className="grid grid-cols-6 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewTemplate({ ...newTemplate, color: option.value })}
                      className={`w-12 h-12 rounded-lg ${option.value} transition-all ${
                        newTemplate.color === option.value
                          ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800"
                          : "hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Default Permissions</label>
                <div className="space-y-3">
                  {[
                    { key: "call", label: "Voice Calls", desc: "Allow calling through masked number" },
                    { key: "message", label: "Text Messages", desc: "Allow messaging through masked number" },
                    { key: "shareProfile", label: "Profile Sharing", desc: "Share name and profile picture" },
                  ].map((perm) => (
                    <div key={perm.key} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-white font-medium">{perm.label}</h5>
                          <p className="text-slate-400 text-sm">{perm.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setNewTemplate({
                              ...newTemplate,
                              permissions: {
                                ...newTemplate.permissions!,
                                [perm.key]: !newTemplate.permissions![perm.key as keyof typeof newTemplate.permissions],
                              },
                            })
                          }
                          className={`w-12 h-6 rounded-full relative transition-colors ${
                            newTemplate.permissions![perm.key as keyof typeof newTemplate.permissions]
                              ? "bg-blue-600"
                              : "bg-slate-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              newTemplate.permissions![perm.key as keyof typeof newTemplate.permissions]
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

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Duration</label>
                <select
                  value={newTemplate.duration}
                  onChange={(e) => setNewTemplate({ ...newTemplate, duration: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="1_day">1 Day</option>
                  <option value="7_days">7 Days</option>
                  <option value="30_days">30 Days</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>

              {/* Auto Approve */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium">Auto-Approve</h5>
                    <p className="text-slate-400 text-sm">Automatically approve requests using this template</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewTemplate({ ...newTemplate, autoApprove: !newTemplate.autoApprove })}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      newTemplate.autoApprove ? "bg-blue-600" : "bg-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        newTemplate.autoApprove ? "right-0.5" : "left-0.5"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createTemplate}
                  className="flex-1 privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all"
                  disabled={!newTemplate.name}
                >
                  Create Template
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
        <div className="flex items-center space-x-3">
          <Link href="/profile" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Connection Templates</h1>
            <p className="text-slate-400 text-sm">Preset permissions for different types of contacts</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Templates Grid */}
        <div className="space-y-4">
          {templates.map((template) => {
            const IconComponent = getIcon(template.icon)
            return (
              <div
                key={template.id}
                className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
                      <p className="text-slate-400 text-sm mb-3">{template.description}</p>

                      {/* Usage Stats */}
                      <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
                        <span>Used {template.usageCount} times</span>
                        <span>•</span>
                        <span>Duration: {getDurationLabel(template.duration)}</span>
                        {template.autoApprove && (
                          <>
                            <span>•</span>
                            <span className="text-green-400">Auto-approve</span>
                          </>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.map((tag, index) => (
                          <span key={index} className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Permissions */}
                      <div className="flex space-x-4 text-xs">
                        {template.permissions.call && <span className="text-green-400">📞 Calls</span>}
                        {template.permissions.message && <span className="text-blue-400">💬 Messages</span>}
                        {template.permissions.shareProfile && <span className="text-purple-400">👤 Profile</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => applyTemplate(template.id)}
                      className="privacy-gradient text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => duplicateTemplate(template.id)}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                      onClick={() => setEditingTemplate(template.id)}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">No Templates Created</h3>
            <p className="text-slate-400 mb-4">Create templates to quickly apply permission sets to new connections</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="privacy-gradient text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-all"
            >
              Create First Template
            </button>
          </div>
        )}

        {/* Quick Templates */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Quick Apply</h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.slice(0, 4).map((template) => {
              const IconComponent = getIcon(template.icon)
              return (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${template.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{template.name}</h4>
                      <p className="text-slate-400 text-xs">Used {template.usageCount} times</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium mb-2">🔒 Template Privacy</h4>
              <p className="text-slate-300 text-sm">
                Templates provide default settings but can always be customized for individual connections. Your privacy
                preferences are always respected.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

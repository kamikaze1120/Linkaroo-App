"use client"

import { useState } from "react"
import { ArrowLeft, AlertTriangle, Phone, MessageCircle, Plus, Trash2, Shield } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  maskedNumber: string
  priority: number
  autoShare: boolean
  location: boolean
  medicalInfo: boolean
}

export default function EmergencyContactsScreen() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: "em_001",
      name: "Dr. Sarah Johnson",
      relationship: "Primary Doctor",
      phone: "+1 (555) 123-4567",
      maskedNumber: "+1 (555) 911-0001",
      priority: 1,
      autoShare: true,
      location: true,
      medicalInfo: true,
    },
    {
      id: "em_002",
      name: "Mike Wilson",
      relationship: "Emergency Contact",
      phone: "+1 (555) 987-6543",
      maskedNumber: "+1 (555) 911-0002",
      priority: 2,
      autoShare: true,
      location: true,
      medicalInfo: false,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    priority: 1,
    autoShare: true,
    location: true,
    medicalInfo: false,
  })

  const [emergencySettings, setEmergencySettings] = useState({
    autoActivate: true,
    locationSharing: true,
    medicalInfoSharing: false,
    emergencyTimeout: 30, // minutes
    requireConfirmation: true,
  })

  const addEmergencyContact = () => {
    const contact: EmergencyContact = {
      id: `em_${Date.now()}`,
      ...newContact,
      maskedNumber: `+1 (555) 911-${String(emergencyContacts.length + 1).padStart(4, "0")}`,
    }
    setEmergencyContacts([...emergencyContacts, contact])
    setNewContact({
      name: "",
      relationship: "",
      phone: "",
      priority: 1,
      autoShare: true,
      location: true,
      medicalInfo: false,
    })
    setShowAddForm(false)
  }

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter((contact) => contact.id !== id))
  }

  const triggerEmergencyMode = () => {
    // This would trigger emergency sharing in a real app
    alert("Emergency mode activated! Your emergency contacts have been notified with your location and status.")
  }

  if (showAddForm) {
    return (
      <div className="min-h-screen pb-20">
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Add Emergency Contact</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Relationship</label>
                <select
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="">Select relationship</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Primary Doctor">Primary Doctor</option>
                  <option value="Emergency Contact">Emergency Contact</option>
                  <option value="Spouse/Partner">Spouse/Partner</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority Level</label>
                <select
                  value={newContact.priority}
                  onChange={(e) => setNewContact({ ...newContact, priority: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value={1}>Priority 1 (Highest)</option>
                  <option value={2}>Priority 2 (High)</option>
                  <option value={3}>Priority 3 (Medium)</option>
                  <option value={4}>Priority 4 (Low)</option>
                </select>
              </div>

              {/* Emergency Permissions */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Emergency Permissions</h4>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium">Auto-Share in Emergency</h5>
                      <p className="text-slate-400 text-sm">
                        Automatically share your contact when emergency is triggered
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewContact({ ...newContact, autoShare: !newContact.autoShare })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        newContact.autoShare ? "bg-red-600" : "bg-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          newContact.autoShare ? "right-0.5" : "left-0.5"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium">Location Sharing</h5>
                      <p className="text-slate-400 text-sm">Share your real-time location in emergencies</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewContact({ ...newContact, location: !newContact.location })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        newContact.location ? "bg-red-600" : "bg-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          newContact.location ? "right-0.5" : "left-0.5"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium">Medical Information</h5>
                      <p className="text-slate-400 text-sm">Share medical info and emergency details</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewContact({ ...newContact, medicalInfo: !newContact.medicalInfo })}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        newContact.medicalInfo ? "bg-red-600" : "bg-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          newContact.medicalInfo ? "right-0.5" : "left-0.5"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>

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
                  onClick={addEmergencyContact}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                  disabled={!newContact.name || !newContact.phone || !newContact.relationship}
                >
                  Add Contact
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
              <h1 className="text-2xl font-bold text-white">Emergency Contacts</h1>
              <p className="text-slate-400 text-sm">Special contacts for emergency situations</p>
            </div>
          </div>
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Emergency Trigger */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
          <div className="text-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-red-400 font-bold text-lg mb-2">Emergency Mode</h3>
            <p className="text-slate-300 text-sm mb-4">
              Instantly share your contact and location with emergency contacts
            </p>
          </div>
          <button
            onClick={triggerEmergencyMode}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg"
          >
            🚨 ACTIVATE EMERGENCY MODE
          </button>
        </div>

        {/* Emergency Settings */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4">Emergency Settings</h3>
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Auto-Activate</h5>
                  <p className="text-slate-400 text-sm">Automatically trigger when phone detects emergency</p>
                </div>
                <button
                  onClick={() =>
                    setEmergencySettings({ ...emergencySettings, autoActivate: !emergencySettings.autoActivate })
                  }
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    emergencySettings.autoActivate ? "bg-red-600" : "bg-slate-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      emergencySettings.autoActivate ? "right-0.5" : "left-0.5"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">Emergency Timeout</h5>
                  <p className="text-slate-400 text-sm">Auto-deactivate emergency mode after</p>
                </div>
                <select
                  value={emergencySettings.emergencyTimeout}
                  onChange={(e) =>
                    setEmergencySettings({ ...emergencySettings, emergencyTimeout: Number.parseInt(e.target.value) })
                  }
                  className="px-3 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts List */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Emergency Contacts ({emergencyContacts.length})</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-white font-medium">{contact.name}</h4>
                      <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                        Priority {contact.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">{contact.relationship}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-3 h-3 text-red-400" />
                      <span className="text-red-400 font-mono text-sm">{contact.maskedNumber}</span>
                    </div>
                    <div className="flex space-x-4 text-xs">
                      {contact.autoShare && <span className="text-green-400">Auto-Share</span>}
                      {contact.location && <span className="text-blue-400">Location</span>}
                      {contact.medicalInfo && <span className="text-purple-400">Medical</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                      <Phone className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => removeEmergencyContact(contact.id)}
                      className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {emergencyContacts.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h4 className="text-white font-medium mb-2">No Emergency Contacts</h4>
              <p className="text-slate-400 text-sm mb-4">Add trusted contacts for emergency situations</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
              >
                Add First Contact
              </button>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">🔒 Emergency Privacy</h4>
          <p className="text-slate-300 text-sm">
            Emergency contacts receive special permissions to bypass normal privacy protections. Your real contact
            information may be shared during active emergencies.
          </p>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

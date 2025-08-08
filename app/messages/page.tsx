"use client"

import { useState } from "react"
import { Search, Send, ArrowLeft, MoreVertical, Phone, Shield } from 'lucide-react'
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import AnimatedBackdrop from "@/components/animated-backdrop"

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const chats = [
    {
      id: 1,
      name: "Sarah M.",
      maskedNumber: "+1 (555) 123-XXXX",
      lastMessage: "Thanks for sharing your contact!",
      time: "2:30 PM",
      unread: 2,
      avatar: "SM",
      status: "active",
    },
    {
      id: 2,
      name: "Mike J.",
      maskedNumber: "+1 (555) 456-XXXX",
      lastMessage: "When does the connection expire?",
      time: "1:15 PM",
      unread: 0,
      avatar: "MJ",
      status: "active",
    },
    {
      id: 3,
      name: "Lisa K.",
      maskedNumber: "+1 (555) 789-XXXX",
      lastMessage: "Perfect! Talk to you soon.",
      time: "11:45 AM",
      unread: 1,
      avatar: "LK",
      status: "active",
    },
    {
      id: 4,
      name: "David R.",
      maskedNumber: "+1 (555) 321-XXXX",
      lastMessage: "Connection expired",
      time: "Yesterday",
      unread: 0,
      avatar: "DR",
      status: "expired",
    },
  ]

  const messages = [
    { id: 1, text: "Hi! I got your contact through Linkaroo", sender: "user", time: "2:25 PM" },
    { id: 2, text: "Hello! Yes, I approved the connection. Nice to meet you!", sender: "me", time: "2:26 PM" },
    { id: 3, text: "Great! This masked number system is really cool", sender: "user", time: "2:27 PM" },
    { id: 4, text: "I know right? Our real numbers stay private 🔒", sender: "me", time: "2:28 PM" },
    { id: 5, text: "Thanks for sharing your contact!", sender: "user", time: "2:30 PM" },
  ]

  if (selectedChat) {
    const chat = chats.find((c) => c.id === selectedChat)

    return (
      <div className="relative min-h-screen pb-20">
        <AnimatedBackdrop intensity="subtle" />
        {/* Chat Header */}
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 privacy-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{chat?.avatar}</span>
              </div>
              <div>
                <h2 className="text-white font-semibold">{chat?.name}</h2>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 text-green-400" />
                  <p className="text-slate-400 text-sm">{chat?.maskedNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Phone className="w-4 h-4 text-white" />
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Connection Status Banner */}
        <div className="bg-green-900/20 border-b border-green-500/30 p-3">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Secure connection active</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === "me" ? "privacy-gradient text-white" : "bg-slate-700 text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === "me" ? "text-blue-100" : "text-slate-400"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a secure message..."
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button className="w-12 h-12 privacy-gradient rounded-full flex items-center justify-center hover:opacity-90 transition-all secure-glow">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackdrop intensity="subtle" />
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
        <h1 className="text-2xl font-bold text-white">Secure Messages</h1>
        <p className="text-slate-400 text-sm">All conversations are through masked numbers</p>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="px-4 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => (chat.status === "active" ? setSelectedChat(chat.id) : null)}
            className={`w-full bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 transition-all text-left border ${
              chat.status === "active"
                ? "border-slate-700 hover:bg-slate-700/80"
                : "border-red-500/30 bg-red-900/10 opacity-60"
            }`}
            disabled={chat.status !== "active"}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    chat.status === "active" ? "privacy-gradient" : "bg-slate-600"
                  }`}
                >
                  <span className="text-white font-bold">{chat.avatar}</span>
                </div>
                {chat.unread > 0 && chat.status === "active" && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{chat.unread}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-semibold">{chat.name}</h3>
                  <div className="flex items-center space-x-2">
                    {chat.status === "active" && <Shield className="w-3 h-3 text-green-400" />}
                    <span className="text-slate-400 text-sm">{chat.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-slate-500 text-xs">{chat.maskedNumber}</p>
                </div>
                <p className={`text-sm truncate ${chat.status === "active" ? "text-slate-400" : "text-red-400"}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <BottomNav activeTab="messages" />
    </div>
  )
}

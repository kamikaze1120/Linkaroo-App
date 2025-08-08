"use client"

import { useState } from "react"
import { Eye, EyeOff, Shield, Lock } from "lucide-react"
import Link from "next/link"

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 privacy-gradient rounded-full mb-4 secure-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Linkaroo</h1>
          <p className="text-slate-400">Safe Contact Sharing</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 safety-border">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Sign In</h2>

          <form className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Link href="/dashboard">
              <button
                type="button"
                className="w-full privacy-gradient text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 secure-glow"
              >
                Sign In Securely
              </button>
            </Link>
          </form>

          {/* Create Account Link */}
          <div className="text-center mt-6">
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Don't have an account? Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/forgot-password" className="text-slate-400 hover:text-white transition-colors">
            Forgot Password?
          </Link>
        </div>

        {/* Privacy Notice */}
        <div className="text-center mt-4 p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-sm text-slate-300">Your privacy is protected</span>
          </div>
          <p className="text-xs text-slate-400">All contacts are masked and require mutual consent</p>
        </div>
      </div>
    </div>
  )
}

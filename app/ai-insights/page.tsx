"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Brain, TrendingUp, Shield, Lightbulb, Target, Zap } from "lucide-react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"

interface AIInsight {
  id: string
  type: "recommendation" | "warning" | "optimization" | "trend"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
  category: "privacy" | "connections" | "usage" | "security"
  actionable: boolean
  actions?: string[]
  data?: any
}

export default function AIInsightsScreen() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    generateAIInsights()
  }, [])

  const generateAIInsights = async () => {
    setIsLoading(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockInsights: AIInsight[] = [
      {
        id: "ai_001",
        type: "recommendation",
        title: "Optimize Connection Duration",
        description:
          "You have 5 connections expiring in the next 2 days. Based on your usage patterns, 3 of them show high activity and should be extended.",
        confidence: 92,
        impact: "high",
        category: "connections",
        actionable: true,
        actions: ["Extend high-activity connections", "Set up auto-renewal"],
        data: { connectionsExpiring: 5, highActivity: 3 },
      },
      {
        id: "ai_002",
        type: "warning",
        title: "Unusual Connection Request Pattern",
        description:
          "You've received 8 connection requests in the last hour, which is 400% above your normal rate. This might indicate spam or unwanted attention.",
        confidence: 87,
        impact: "high",
        category: "security",
        actionable: true,
        actions: ["Enable stricter filtering", "Review recent requests", "Activate quiet mode"],
        data: { requestsLastHour: 8, normalRate: 2 },
      },
      {
        id: "ai_003",
        type: "optimization",
        title: "Peak Usage Hours Identified",
        description:
          "Your connections are most active between 2-4 PM and 7-9 PM. Consider setting availability schedules to optimize your response times.",
        confidence: 95,
        impact: "medium",
        category: "usage",
        actionable: true,
        actions: ["Create availability schedule", "Set up auto-responses"],
        data: { peakHours: ["14:00-16:00", "19:00-21:00"] },
      },
      {
        id: "ai_004",
        type: "trend",
        title: "Connection Quality Improving",
        description:
          "Your average connection duration has increased by 40% this month, indicating stronger, more meaningful connections.",
        confidence: 89,
        impact: "low",
        category: "connections",
        actionable: false,
        data: { durationIncrease: 40, timeframe: "month" },
      },
      {
        id: "ai_005",
        type: "recommendation",
        title: "Privacy Score Enhancement",
        description:
          "Enable location-based auto-reject to improve your privacy score from 85% to 95%. This will automatically decline requests from unfamiliar locations.",
        confidence: 91,
        impact: "medium",
        category: "privacy",
        actionable: true,
        actions: ["Enable location filtering", "Review privacy settings"],
        data: { currentScore: 85, potentialScore: 95 },
      },
      {
        id: "ai_006",
        type: "optimization",
        title: "Template Usage Opportunity",
        description:
          "You manually set similar permissions 12 times this week. Creating a 'Work Colleague' template could save you 2-3 minutes per connection.",
        confidence: 88,
        impact: "low",
        category: "usage",
        actionable: true,
        actions: ["Create work template", "Set up quick apply shortcuts"],
        data: { manualSettings: 12, timeSaved: "2-3 minutes" },
      },
    ]

    setInsights(mockInsights)
    setIsLoading(false)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <Lightbulb className="w-5 h-5 text-blue-400" />
      case "warning":
        return <Shield className="w-5 h-5 text-red-400" />
      case "optimization":
        return <Target className="w-5 h-5 text-green-400" />
      case "trend":
        return <TrendingUp className="w-5 h-5 text-purple-400" />
      default:
        return <Brain className="w-5 h-5 text-slate-400" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "recommendation":
        return "border-blue-500/30 bg-blue-500/10"
      case "warning":
        return "border-red-500/30 bg-red-500/10"
      case "optimization":
        return "border-green-500/30 bg-green-500/10"
      case "trend":
        return "border-purple-500/30 bg-purple-500/10"
      default:
        return "border-slate-500/30 bg-slate-500/10"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-orange-400"
      case "low":
        return "text-green-400"
      default:
        return "text-slate-400"
    }
  }

  const filteredInsights = insights.filter(
    (insight) => selectedCategory === "all" || insight.category === selectedCategory,
  )

  const executeAction = (insightId: string, action: string) => {
    // In a real app, this would execute the suggested action
    alert(`Executing: ${action}`)

    // Remove the insight after action is taken
    setInsights(insights.filter((i) => i.id !== insightId))
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
              <h1 className="text-2xl font-bold text-white">AI Insights</h1>
              <p className="text-slate-400 text-sm">Smart recommendations for better connections</p>
            </div>
          </div>
          <Brain className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* AI Status */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Linkaroo AI Assistant</h3>
              <p className="text-slate-300 text-sm">Analyzing your connection patterns...</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              <span className="text-blue-400 text-sm ml-2">Processing insights...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{insights.length}</div>
                <div className="text-slate-400 text-xs">Total Insights</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{insights.filter((i) => i.actionable).length}</div>
                <div className="text-slate-400 text-xs">Actionable</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
                </div>
                <div className="text-slate-400 text-xs">Avg Confidence</div>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        {!isLoading && (
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: "all", label: "All Insights", count: insights.length },
              { key: "privacy", label: "Privacy", count: insights.filter((i) => i.category === "privacy").length },
              {
                key: "connections",
                label: "Connections",
                count: insights.filter((i) => i.category === "connections").length,
              },
              { key: "usage", label: "Usage", count: insights.filter((i) => i.category === "usage").length },
              { key: "security", label: "Security", count: insights.filter((i) => i.category === "security").length },
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category.key
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        )}

        {/* Insights List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 animate-pulse"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-700 rounded w-full"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className={`bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-bold text-lg">{insight.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="text-slate-400 text-xs">{insight.confidence}% confident</span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mb-4">{insight.description}</p>

                    {/* Confidence Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>AI Confidence</span>
                        <span>{insight.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${insight.confidence}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    {insight.actionable && insight.actions && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-sm">Suggested Actions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {insight.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => executeAction(insight.id, action)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all flex items-center space-x-1"
                            >
                              <Zap className="w-3 h-3" />
                              <span>{action}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Data Visualization */}
                    {insight.data && (
                      <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                        <h5 className="text-slate-300 font-medium text-xs mb-2">Supporting Data:</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(insight.data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredInsights.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">No Insights Available</h3>
            <p className="text-slate-400">
              {selectedCategory === "all"
                ? "AI is still learning your patterns. Check back later for personalized insights."
                : "No insights found for this category. Try selecting a different filter."}
            </p>
          </div>
        )}

        {/* AI Learning Notice */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Brain className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-purple-400 font-medium mb-2">AI Learning & Privacy</h4>
              <p className="text-slate-300 text-sm">
                All AI analysis happens locally on your device. Your connection patterns and insights never leave your
                phone, ensuring complete privacy while providing personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav activeTab="profile" />
    </div>
  )
}

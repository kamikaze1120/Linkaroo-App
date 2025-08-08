import { Home, Share, MessageCircle, User, TrendingUp } from "lucide-react"
import Link from "next/link"

interface BottomNavProps {
  activeTab: "home" | "share" | "messages" | "analytics" | "profile"
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home", href: "/dashboard" },
    { id: "share", icon: Share, label: "Share", href: "/share" },
    { id: "messages", icon: MessageCircle, label: "Messages", href: "/messages" },
    { id: "analytics", icon: TrendingUp, label: "Analytics", href: "/analytics" },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <Link key={item.id} href={item.href}>
              <div
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                  isActive ? "text-blue-400 bg-blue-500/20" : "text-slate-400 hover:text-white"
                }`}
              >
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? "text-blue-400" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

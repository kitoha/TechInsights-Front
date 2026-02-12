"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/button"

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { name: "Feed", href: "/", icon: Home },
    { name: "Trending", href: "/trending", icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    )},
    { name: "Saved", href: "/saved", icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
    )},
  ]

  const topics = [
    { name: "FrontEnd", href: "/?category=FrontEnd" },
    { name: "BackEnd", href: "/?category=BackEnd" },
    { name: "AI", href: "/?category=AI" },
    { name: "Big Data", href: "/?category=Big Data" },
    { name: "Infra", href: "/?category=Infra" },
    { name: "Architecture", href: "/?category=Architecture" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-background flex flex-col z-50 transition-transform duration-300 ease-in-out
        w-60 lg:translate-x-0 border-r border-border/30
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Section */}
        <div className="px-6 py-6 pb-4">
          <Link href="/" className="flex items-center space-x-2.5" onClick={onClose}>
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">TechInsights</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Menu Section */}
          <div className="space-y-0.5">
            <h3 className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-3">Menu</h3>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  <span className="text-[13px] font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Topics Section */}
          <div className="space-y-0.5">
            <h3 className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-3">Topics</h3>
            {topics.map((topic) => (
              <Link
                key={topic.name}
                href={topic.href}
                onClick={onClose}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-all duration-200"
              >
                <span className="text-muted-foreground/50 text-sm font-medium">#</span>
                <span className="text-[13px] font-medium">{topic.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="p-4 pt-0">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <h4 className="text-[12px] font-bold text-foreground">Newsletter</h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Get daily tech insights in your inbox.
            </p>
            <Button variant="default" className="w-full h-8 text-[11px] font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              Subscribe
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

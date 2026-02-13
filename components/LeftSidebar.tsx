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
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
    )},
    { name: "Companies", href: "/companies", icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
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
        <div className="h-20 px-6 flex items-center border-b border-border/30">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background text-base font-bold">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">TechInsights</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
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
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
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
                className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-200"
              >
                <span className="text-muted-foreground/50 text-sm font-medium">#</span>
                <span className="text-[13px] font-medium">{topic.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="p-4 pt-0">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-900/40 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="text-[13px] font-bold text-foreground/95">Newsletter</h4>
            </div>
            <p className="text-[12px] text-muted-foreground/80 leading-relaxed mb-4">
              Get daily tech insights delivered to your inbox.
            </p>
            <Button variant="default" className="w-full h-9 text-[12px] font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
              Subscribe Now
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

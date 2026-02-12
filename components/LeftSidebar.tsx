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
    { name: "AI & ML", href: "/?category=AI" },
    { name: "DevOps", href: "/?category=Infra" },
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
        w-64 lg:translate-x-0 border-r border-border/40
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Section */}
        <div className="p-8 pb-4">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black text-lg font-bold">T</span>
            </div>
            <span className="text-xl font-black tracking-tight text-foreground">TechInsights</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
          {/* Menu Section */}
          <div className="space-y-1">
            <h3 className="px-4 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Menu</h3>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-accent-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-[14px]">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Topics Section */}
          <div className="space-y-1">
            <h3 className="px-4 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Topics</h3>
            {topics.map((topic) => (
              <Link
                key={topic.name}
                href={topic.href}
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                <div className="w-4 h-4 flex items-center justify-center opacity-40">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
                <span className="text-[14px] font-medium">{topic.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="p-6 pt-0">
          <div className="bg-accent/30 rounded-2xl p-6 border border-border/50">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <h4 className="text-[13px] font-black uppercase tracking-wider">Newsletter</h4>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
              Daily tech insights delivered to your inbox.
            </p>
            <Button variant="outline" className="w-full h-9 text-[12px] font-bold rounded-lg border-border/60 hover:bg-background">
              Subscribe
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

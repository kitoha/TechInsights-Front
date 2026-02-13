"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { name: "Feed", href: "/", icon: Home },
    { name: "Trending", href: "/?sortBy=POPULARITY", icon: (props: any) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    )},
    { name: "Saved", href: "/profile", icon: (props: any) => (
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
        w-56 lg:translate-x-0 border-r border-border/40 lg:top-16
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Mobile Logo Section - only visible on mobile */}
        <div className="h-16 px-5 flex items-center lg:hidden border-b border-border/40">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background text-sm font-bold">T</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">TechInsights</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {/* Menu Section */}
          <div className="space-y-0.5">
            <h3 className="px-3 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Menu</h3>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-[12px]">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Topics Section */}
          <div className="space-y-0.5">
            <h3 className="px-3 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Topics</h3>
            {topics.map((topic) => (
              <Link
                key={topic.name}
                href={topic.href}
                onClick={onClose}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/70 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current/60" />
                <span className="text-[12px]">{topic.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}

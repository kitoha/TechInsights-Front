"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"
import type { ComponentType, SVGProps } from "react"

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

type MenuIconProps = SVGProps<SVGSVGElement>;
type MenuItem = {
  name: string;
  href: string;
  icon: ComponentType<MenuIconProps>;
};

export function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  const pathname = usePathname()

  const menuItems: MenuItem[] = [
    { name: "Feed", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: (props: MenuIconProps) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
    )},
    { name: "Companies", href: "/companies", icon: (props: MenuIconProps) => (
      <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
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
        fixed left-0 top-0 h-screen bg-gray-50 dark:bg-gray-950 flex flex-col z-50 transition-transform duration-300 ease-in-out
        w-56 lg:translate-x-0 border-r border-gray-300 dark:border-gray-700 lg:top-14 shadow-lg lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Mobile Logo Section - only visible on mobile */}
        <div className="h-14 px-5 flex items-center lg:hidden border-b border-gray-300 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background text-xs font-bold">T</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">TechInsights</span>
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
                      ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-muted-foreground hover:bg-white dark:hover:bg-gray-900"
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
                className="flex items-center space-x-2.5 px-3 py-2 rounded-md text-muted-foreground hover:bg-white dark:hover:bg-gray-900 transition-colors"
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

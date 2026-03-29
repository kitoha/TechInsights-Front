"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Home } from "lucide-react"
import type { ComponentType, SVGProps } from "react"
import type { TopicLink } from "@/lib/categories/api"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { LoginModal } from "@/components/auth/LoginModal"
import { LogIn } from "lucide-react"

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  topOffsetClassName?: string;
  topics?: TopicLink[];
}

type MenuIconProps = SVGProps<SVGSVGElement>;
type MenuItem = {
  name: string;
  href: string;
  icon: ComponentType<MenuIconProps>;
};

export function LeftSidebar({ isOpen, onClose, topOffsetClassName = "lg:top-14", topics = [] }: LeftSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")
  const { isLoggedIn, isLoading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const menuItems: MenuItem[] = [
    { name: "Feed", href: "/", icon: Home },
    {
      name: "Categories", href: "/categories", icon: (props: MenuIconProps) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      )
    },
    {
      name: "Companies", href: "/companies", icon: (props: MenuIconProps) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      )
    },
    {
      name: "Opensource", href: "/opensource", icon: (props: MenuIconProps) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
      )
    },
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
        w-56 lg:translate-x-0 border-r border-gray-300 dark:border-gray-700 shadow-lg lg:h-[calc(100vh-var(--layout-top-offset,3.5rem))] lg:shadow-none
        ${topOffsetClassName}
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
            <p className="px-2 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-1.5">Menu</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-foreground/[0.07] text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-md transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                    <item.icon className="w-[15px] h-[15px]" />
                  </span>
                  <span className="text-[12.5px] tracking-[-0.01em]">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40 mx-1" />

          {/* Topics Section */}
          {topics.length > 0 && (
            <div className="space-y-[2px]">
              <p className="px-2 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-1.5">Topics</p>
              {topics.map((topic, i) => {
                const isTopicActive = pathname === "/" && currentCategory && topic.href === `/?category=${currentCategory}`;
                const targetHref = isTopicActive ? "/" : topic.href;

                // Rotate through a curated palette for each topic dot
                const dotColors = [
                  "bg-blue-400", "bg-violet-400", "bg-emerald-400",
                  "bg-amber-400", "bg-rose-400", "bg-cyan-400",
                  "bg-orange-400", "bg-pink-400", "bg-teal-400", "bg-indigo-400",
                ];
                const dotColor = dotColors[i % dotColors.length];

                return (
                  <Link
                    key={topic.name}
                    href={targetHref}
                    onClick={onClose}
                    className={`group flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all duration-150 ${
                      isTopicActive
                        ? "bg-foreground/[0.07] text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                    }`}
                  >
                    <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 transition-all duration-150 ${dotColor} ${
                      isTopicActive ? "opacity-100 scale-110" : "opacity-50 group-hover:opacity-80"
                    }`} />
                    <span className="text-[12.5px] tracking-[-0.01em] truncate">{topic.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Social / Info Section or Login */}
          {mounted && !isLoading && !isLoggedIn && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 lg:hidden">
               <button
                onClick={() => {
                  setShowLoginModal(true)
                  if (onClose) onClose()
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-[12px] font-semibold">Sign In</span>
              </button>
            </div>
          )}
        </div>
      </aside>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}

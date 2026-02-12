"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, Building2, Settings, LogOut, User } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/button"
import { useState } from "react"
import { LoginModal } from "./LoginModal"
import { UserProfileDropdown } from "./UserProfileDropdown"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Categories", href: "/categories", icon: Grid },
  { name: "Companies", href: "/companies", icon: Building2 },
]

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
  const pathname = usePathname()
  const { isLoggedIn, isLoading } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group" onClick={onClose}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground text-xl font-bold">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Tech Insights</span>
          </Link>
          
          {/* Mobile Close Button */}
          <button onClick={onClose} className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">Appearance</span>
          <ThemeToggle />
        </div>

        <div className="pt-2">
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border">
                  <UserProfileDropdown />
                </div>
              ) : (
                <Button
                  variant="default"
                  className="w-full justify-start space-x-3 h-12 rounded-xl"
                  onClick={() => setLoginModalOpen(true)}
                >
                  <User className="w-5 h-5" />
                  <span>Login / Sign up</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </aside>
    </>
  )
}

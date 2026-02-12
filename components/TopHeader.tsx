"use client"

import SearchBar from "./SearchBar"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import Link from "next/link"
import { Button } from "./ui/button"

interface TopHeaderProps {
  onMenuClick?: () => void;
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="h-20 bg-background sticky top-0 z-40 border-b border-border/30 lg:ml-60">
      <div className="h-full flex items-center justify-between px-8">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 md:mx-auto">
          <div className="relative">
            <SearchBar className="w-full h-10 md:h-11 bg-gray-50 dark:bg-gray-900/50 shadow-sm rounded-xl" />
          </div>
        </div>

        {/* Right side: Notification + Theme + Button */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-muted-foreground/70 hover:text-foreground transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <ThemeToggle />
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-10 rounded-xl text-sm shadow-sm">
            Subscribe
          </Button>
        </div>
      </div>
    </header>
  )
}

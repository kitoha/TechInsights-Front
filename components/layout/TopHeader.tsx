"use client"

import SearchBar from "@/components/search/SearchBar"
import { Suspense } from "react"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TopHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopHeader({ onMenuClick, showMenuButton = true }: TopHeaderProps) {
  return (
    <header className="h-14 bg-white dark:bg-gray-900 sticky top-0 z-40 border-b border-gray-300 dark:border-gray-700">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-3">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <Link href="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background text-xs font-bold">T</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">TechInsights</span>
          </Link>
        </div>

        <div className="hidden md:block flex-1 max-w-xl mx-6">
          <Suspense fallback={<div className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/80" />}>
            <SearchBar className="w-full" />
          </Suspense>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button className="hidden sm:inline-flex px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 h-7 rounded-md text-xs shadow-none">
            Subscribe
          </Button>
        </div>
      </div>
    </header>
  )
}

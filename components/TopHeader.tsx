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
    <header className="h-20 bg-background border-b border-border/40 sticky top-0 z-40 px-4 lg:px-12 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 mr-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        {/* Mobile Logo Only */}
        <div className="lg:hidden flex items-center space-x-2">
           <div className="w-7 h-7 bg-black dark:bg-white rounded flex items-center justify-center">
            <span className="text-white dark:text-black text-sm font-bold">T</span>
          </div>
        </div>
      </div>
      
      {/* Centered Search Bar */}
      <div className="flex-[2] max-w-2xl hidden md:block">
        <SearchBar className="w-full" />
      </div>

      <div className="flex items-center justify-end flex-1 space-x-6">
        <div className="hidden lg:flex items-center space-x-6">
          <ThemeToggle />
          <Link href="/login" className="text-[14px] font-bold text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 h-10 rounded-lg text-[13px]">
            Subscribe
          </Button>
        </div>
        {/* Mobile Search Icon Only */}
        <button className="md:hidden p-2 text-muted-foreground">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>
    </header>
  )
}

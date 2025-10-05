"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
              <span className="text-background text-sm font-bold">T</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Tech Insights</span>
          </Link>

          <nav className="hidden md:flex space-x-8 ml-12">
            <Link 
              href="/" 
              className={`hover:text-muted-foreground transition-colors ${
                pathname === "/" 
                  ? "text-foreground font-semibold" 
                  : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className={`hover:text-foreground transition-colors ${
                pathname === "/categories" 
                  ? "text-foreground font-semibold" 
                  : "text-muted-foreground"
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/companies" 
              className={`hover:text-foreground transition-colors ${
                pathname === "/companies" 
                  ? "text-foreground font-semibold" 
                  : "text-muted-foreground"
              }`}
            >
              Companies
            </Link>
          </nav>

          <div className="flex items-center space-x-4 ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

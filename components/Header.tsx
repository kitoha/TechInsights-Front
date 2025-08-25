"use client"

import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
              <span className="text-background text-sm font-bold">T</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Tech Insights</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-foreground hover:text-muted-foreground">
              Home
            </Link>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Categories
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Trending
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Companies
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
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
            
            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="메뉴 열기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 모바일 드롭다운 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/"
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/categories"
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/companies"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/companies"
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Companies
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

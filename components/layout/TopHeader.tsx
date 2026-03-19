"use client"

import SearchBar from "@/components/search/SearchBar"
import { Suspense, useState } from "react"
import { Bookmark, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/LoginModal"
import { UserProfileDropdown } from "@/components/auth/UserProfileDropdown"
import { useAuth } from "@/context/AuthContext"

interface TopHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  compact?: boolean;
  stickyTopClassName?: string;
}

export function TopHeader({
  onMenuClick,
  showMenuButton = true,
  compact = false,
  stickyTopClassName = "top-0",
}: TopHeaderProps) {
  const { isLoggedIn, isLoading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathname = usePathname()
  const isBookmarksPage = pathname?.startsWith("/bookmarks") ?? false

  return (
    <>
      <header className={`${compact ? "h-12" : "h-14"} ${stickyTopClassName} sticky z-40 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700`}>
        <div className={`h-full flex items-center justify-between ${compact ? "px-3 lg:px-5" : "px-4 lg:px-6"}`}>
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

          <div className={`hidden md:block flex-1 ${compact ? "max-w-lg mx-4" : "max-w-xl mx-6"}`}>
            <Suspense fallback={<div className={`${compact ? "h-9" : "h-10"} w-full rounded-full border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/80`} />}>
              <SearchBar className="w-full" />
            </Suspense>
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? null : isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className={`hidden sm:inline-flex gap-1.5 transition-all duration-200 ${compact ? "h-7 px-2.5 text-[11px]" : "h-8 px-3 text-xs"} ${isBookmarksPage ? "border-blue-200/70 bg-blue-50/90 text-blue-600 shadow-sm dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-400" : ""}`}
                  asChild
                >
                  <Link href="/bookmarks" aria-label="북마크" aria-current={isBookmarksPage ? "page" : undefined}>
                    <Bookmark className="size-3.5 shrink-0" fill={isBookmarksPage ? "currentColor" : "none"} strokeWidth={isBookmarksPage ? 0 : 1.75} />
                    <span>Bookmarks</span>
                  </Link>
                </Button>
                <ThemeToggle />
                <UserProfileDropdown />
              </>
            ) : (
              <>
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                  className={`hidden sm:inline-flex px-2 py-1 ${compact ? "text-[11px]" : "text-xs"} text-muted-foreground hover:text-foreground transition-colors`}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}

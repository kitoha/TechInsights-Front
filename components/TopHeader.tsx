"use client"

import SearchBar from "./SearchBar"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

interface TopHeaderProps {
  onMenuClick?: () => void;
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const pathname = usePathname()
  
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"
    if (pathname.startsWith("/categories")) return "Categories"
    if (pathname.startsWith("/companies")) return "Companies"
    if (pathname.startsWith("/company")) return "Company Details"
    if (pathname.startsWith("/post")) return "Post Details"
    if (pathname === "/settings") return "Settings"
    if (pathname === "/profile") return "Profile"
    return "Tech Insights"
  }

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 mr-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-foreground truncate max-w-[120px] sm:max-w-none">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex-1 max-w-xl mx-4 sm:mx-8">
        <SearchBar className="w-full" />
      </div>

      <div className="flex items-center space-x-4">
        {/* 추가적인 전역 액션 버튼들 (알림 등) 배치 가능 */}
      </div>
    </header>
  )
}

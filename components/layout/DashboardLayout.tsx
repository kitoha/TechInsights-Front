"use client"

import { useState } from "react"
import { LeftSidebar } from "@/components/layout/LeftSidebar"
import { TopHeader } from "@/components/layout/TopHeader"
import { usePathname } from "next/navigation"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isPostDetail = pathname.startsWith("/post/")

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {!isPostDetail && (
        <LeftSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
        <TopHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          showMenuButton={!isPostDetail}
        />
        <main className={`flex-1 overflow-y-auto ${isPostDetail ? "" : "lg:ml-56"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

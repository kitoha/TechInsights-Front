"use client"

import { useState } from "react"
import { LeftSidebar } from "@/components/layout/LeftSidebar"
import { TopHeader } from "@/components/layout/TopHeader"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <TopHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto lg:ml-56">
          {children}
        </main>
      </div>
    </div>
  )
}

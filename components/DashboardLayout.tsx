"use client"

import { useState } from "react"
import { LeftSidebar } from "@/components/LeftSidebar"
import { TopHeader } from "@/components/TopHeader"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <TopHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto lg:ml-60">
          {children}
        </main>
      </div>
    </div>
  )
}

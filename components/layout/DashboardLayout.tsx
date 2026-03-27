"use client"

import { Suspense, useState } from "react"
import { LeftSidebar } from "@/components/layout/LeftSidebar"
import { TopHeader } from "@/components/layout/TopHeader"
import { ApiTargetBanner } from "@/components/layout/ApiTargetBanner"
import { isProductionApiTarget } from "@/lib/shared/api"
import { usePathname } from "next/navigation"
import type { TopicLink } from "@/lib/categories/api"

export function DashboardLayout({ children, topics = [] }: { children: React.ReactNode; topics?: TopicLink[] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isPostDetail = pathname.startsWith("/post/")
  const showApiBanner =
    process.env.NEXT_PUBLIC_SHOW_API_BANNER === "true" && isProductionApiTarget()
  const layoutTopOffset = showApiBanner ? "5.5rem" : "3.5rem"

  return (
    <div
      className="flex min-h-screen bg-white dark:bg-gray-900"
      style={{ ["--layout-top-offset" as string]: layoutTopOffset }}
    >
      {!isPostDetail && (
        <Suspense fallback={<div className="hidden lg:block lg:w-56 flex-shrink-0" />}>
          <LeftSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            topOffsetClassName={showApiBanner ? "lg:top-[var(--layout-top-offset)]" : "lg:top-14"}
            topics={topics}
          />
        </Suspense>
      )}
      <div className="flex-1 flex flex-col">
        <ApiTargetBanner />
        <TopHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          showMenuButton={!isPostDetail}
          compact={isPostDetail}
          stickyTopClassName={showApiBanner ? "top-8" : "top-0"}
        />
        <main className={`flex-1 overflow-y-auto ${isPostDetail ? "" : "lg:ml-56"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

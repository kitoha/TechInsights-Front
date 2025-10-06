"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 group"
    >
      {/* 라이트 모드 아이콘 */}
      <Sun className="h-4 w-4 text-yellow-500 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      
      {/* 다크 모드 아이콘 */}
      <Moon className="absolute h-4 w-4 text-blue-500 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      
      {/* 텍스트 */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
        {theme === "light" ? "Light Mode" : "Dark Mode"}
      </span>
      
      {/* 상태 표시 점 */}
      <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-blue-500 transition-colors duration-200"></div>
      
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

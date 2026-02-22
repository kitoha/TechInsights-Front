"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { apiGet } from "@/lib/shared/api"
import { SemanticSearchResponse } from "@/lib/search/types"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SearchBarProps {
  className?: string;
}

interface CacheEntry {
  data: SemanticSearchResponse
  timestamp: number
}

const searchCache = new Map<string, CacheEntry>()
const CACHE_DURATION = 5 * 60 * 1000
const DROPDOWN_SIZE = 5

function getSimilarityLabel(score: number) {
  if (score >= 0.9) return "매우 유사"
  if (score >= 0.7) return "관련 있음"
  return "약한 연관"
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SemanticSearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const searchRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()

  useEffect(() => {
    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    const apiBaseUrl = isProd
      ? "https://api.techinsights.shop"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    const preconnect = document.createElement("link")
    preconnect.rel = "preconnect"
    preconnect.href = apiBaseUrl
    preconnect.crossOrigin = "anonymous"

    const dnsPrefetch = document.createElement("link")
    dnsPrefetch.rel = "dns-prefetch"
    dnsPrefetch.href = apiBaseUrl

    document.head.appendChild(preconnect)
    document.head.appendChild(dnsPrefetch)

    return () => {
      if (document.head.contains(preconnect)) {
        document.head.removeChild(preconnect)
      }
      if (document.head.contains(dnsPrefetch)) {
        document.head.removeChild(dnsPrefetch)
      }
    }
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      setIsOpen(false)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const timeoutId = setTimeout(async () => {
      const trimmedQuery = query.trim().toLowerCase()
      const cached = searchCache.get(trimmedQuery)
      const now = Date.now()

      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setResults(cached.data)
        setIsOpen(true)
        setSelectedIndex(-1)
        setIsLoading(false)
        return
      }

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        setIsLoading(true)
        setError(null)

        const response = await apiGet<SemanticSearchResponse>(
          `/api/v1/search/semantic?query=${encodeURIComponent(query)}&size=${DROPDOWN_SIZE}`,
          { signal: abortController.signal }
        )

        if (!abortController.signal.aborted) {
          setResults(response.data)
          setIsOpen(true)
          setSelectedIndex(-1)

          searchCache.set(trimmedQuery, {
            data: response.data,
            timestamp: now,
          })

          if (searchCache.size > 100) {
            const entries = Array.from(searchCache.entries())
            entries.sort((a, b) => b[1].timestamp - a[1].timestamp)
            const toKeep = entries.slice(0, 50)
            searchCache.clear()
            toKeep.forEach(([key, value]) => searchCache.set(key, value))
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }
        if (!abortController.signal.aborted) {
          setError("검색 중 오류가 발생했습니다.")
          setResults(null)
          setIsOpen(false)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleItemClick = (index: number) => {
    if (!results) return

    const selected = results.results[index]
    if (!selected) return

    router.push(`/post/${selected.post.id}`)
    setIsOpen(false)
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setSelectedIndex(-1)
      return
    }

    const totalItems = results?.results.length || 0

    if (!isOpen || totalItems === 0) {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault()
        router.push(`/search?query=${encodeURIComponent(query)}`)
        setIsOpen(false)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % totalItems)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleItemClick(selectedIndex)
        } else {
          router.push(`/search?query=${encodeURIComponent(query)}`)
          setIsOpen(false)
        }
        break
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform animate-spin text-gray-400" />
        )}
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="AI 검색: 궁금한 내용을 질문해보세요"
          className={`pl-10 pr-10 border-gray-200 text-gray-900 placeholder-gray-500 transition-all duration-200 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${className}`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900">
          {error ? (
            <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : !query.trim() ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">질문을 입력하세요</div>
          ) : results && results.results.length > 0 ? (
            <div>
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 text-xs font-bold text-gray-600 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300">
                AI 검색 미리보기
              </div>
              {results.results.map((item, index) => (
                <div
                  key={item.post.id}
                  className={`flex cursor-pointer items-center gap-3 p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 ${
                    selectedIndex === index ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700" : ""
                  }`}
                  onClick={() => handleItemClick(index)}
                >
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm dark:from-gray-800 dark:to-gray-700">
                    <Image
                      src={`/logos/${item.post.companyLogo}`}
                      alt={item.post.companyName}
                      width={40}
                      height={40}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {item.post.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">{item.post.companyName}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.similarityScore.toFixed(3)} · {getSimilarityLabel(item.similarityScore)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">검색 결과가 없습니다</div>
          )}
        </div>
      )}
    </div>
  )
}

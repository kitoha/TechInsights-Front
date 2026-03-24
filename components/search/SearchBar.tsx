"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search, Loader2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { apiGet, getBackendApiBaseUrl } from "@/lib/shared/api"
import { InstantSearchCompany, InstantSearchPost, InstantSearchResponse, SearchMode } from "@/lib/search/types"
import { isAxiosError } from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

interface SearchBarProps {
  className?: string;
}

interface KeywordCacheEntry {
  data: InstantSearchResponse
  timestamp: number
}

const keywordCache = new Map<string, KeywordCacheEntry>()
const CACHE_DURATION = 5 * 60 * 1000
const MAX_QUERY_LENGTH = 500

function resolveSearchMode(mode?: string | null): SearchMode {
  return mode === "keyword" ? "keyword" : "semantic"
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<SearchMode>("semantic")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [keywordResults, setKeywordResults] = useState<InstantSearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const searchRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMode(resolveSearchMode(searchParams.get("mode")))
  }, [searchParams])

  const activeItemsCount = useMemo(() => {
    if (mode === "semantic") return 0
    const companiesCount = Math.min(keywordResults?.companies?.length || 0, 5)
    const postsCount = Math.min(keywordResults?.posts?.length || 0, 5)
    return companiesCount + postsCount
  }, [mode, keywordResults])

  useEffect(() => {
    const preconnect = document.createElement("link")
    preconnect.rel = "preconnect"
    preconnect.href = getBackendApiBaseUrl()
    preconnect.crossOrigin = "anonymous"

    const dnsPrefetch = document.createElement("link")
    dnsPrefetch.rel = "dns-prefetch"
    dnsPrefetch.href = getBackendApiBaseUrl()

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
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setKeywordResults(null)
      setIsOpen(false)
      setError(null)
      setIsLoading(false)
      return
    }

    if (trimmedQuery.length > MAX_QUERY_LENGTH) {
      setKeywordResults(null)
      setError(`질문은 ${MAX_QUERY_LENGTH}자 이내로 입력해주세요.`)
      setIsOpen(true)
      setIsLoading(false)
      return
    }

    // AI 검색은 입력 완료 후 Enter 시점에만 실행한다.
    if (mode === "semantic") {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      setKeywordResults(null)
      setError(null)
      setSelectedIndex(-1)
      setIsLoading(false)
      setIsOpen(true)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const timeoutId = setTimeout(async () => {
      const normalizedQuery = trimmedQuery.toLowerCase()
      const now = Date.now()

      const cached = keywordCache.get(normalizedQuery)
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setKeywordResults(cached.data)
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

        const response = await apiGet<InstantSearchResponse>(
          `/api/v1/search/instant?query=${encodeURIComponent(trimmedQuery)}`,
          { signal: abortController.signal }
        )

        if (!abortController.signal.aborted) {
          setKeywordResults(response.data)
          setIsOpen(true)
          setSelectedIndex(-1)
          keywordCache.set(normalizedQuery, { data: response.data, timestamp: now })
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }
        if (!abortController.signal.aborted) {
          const status = isAxiosError(err) ? err.response?.status : undefined
          if (status === 400) {
            setError("검색어 조건이 올바르지 않습니다.")
          } else {
            setError("검색 중 오류가 발생했습니다.")
          }
          setKeywordResults(null)
          setIsOpen(true)
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
  }, [query, mode])

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

  const pushSearchPage = () => {
    const trimmed = query.trim()
    if (!trimmed) return

    const params = new URLSearchParams()
    params.set("query", trimmed)
    params.set("mode", mode)

    if (mode === "keyword") {
      params.set("page", "0")
      params.set("sortBy", "RELEVANCE")
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleItemClick = (index: number) => {
    if (!keywordResults) return
    const maxCompanies = Math.min(keywordResults.companies?.length || 0, 5)
    const companies = keywordResults.companies?.slice(0, 5) || []
    const posts = keywordResults.posts?.slice(0, 5) || []

    if (index < maxCompanies) {
      router.push(`/company/${companies[index].id}`)
    } else {
      const postIndex = index - maxCompanies
      router.push(`/post/${posts[postIndex].id}`)
    }

    setIsOpen(false)
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setSelectedIndex(-1)
      return
    }

    if (!isOpen || activeItemsCount === 0) {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault()
        if (query.trim().length > MAX_QUERY_LENGTH) {
          setError(`질문은 ${MAX_QUERY_LENGTH}자 이내로 입력해주세요.`)
          setIsOpen(true)
          return
        }
        pushSearchPage()
        setIsOpen(false)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % activeItemsCount)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev <= 0 ? activeItemsCount - 1 : prev - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleItemClick(selectedIndex)
        } else {
          pushSearchPage()
          setIsOpen(false)
        }
        break
    }
  }

  const renderHighlightedText = (text: string) => {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: text }}
        className="[&_mark]:bg-gradient-to-r [&_mark]:from-blue-400 [&_mark]:to-purple-500 [&_mark]:text-white [&_mark]:px-1.5 [&_mark]:py-0.5 [&_mark]:rounded-md [&_mark]:font-medium [&_mark]:shadow-sm"
      />
    )
  }

  const renderCompanyItem = (company: InstantSearchCompany, index: number) => (
    <div
      key={`company-${company.id}`}
      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 ${
        selectedIndex === index ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700" : ""
      }`}
      onClick={() => handleItemClick(index)}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
        <Image src={`/logos/${company.logoImageName}`} alt={company.name} width={40} height={40} className="object-cover w-full h-full rounded-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{renderHighlightedText(company.highlightedName)}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full inline-block">
          {company.matchedPostCount}개 게시물
        </div>
      </div>
    </div>
  )

  const renderPostItem = (post: InstantSearchPost, index: number) => (
    <div
      key={`post-${post.id}`}
      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 ${
        selectedIndex === index ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700" : ""
      }`}
      onClick={() => handleItemClick(index)}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
        <Image src={`/logos/${post.companyLogo}`} alt={post.companyName} width={40} height={40} className="object-cover w-full h-full rounded-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">{renderHighlightedText(post.highlightedTitle)}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{post.companyName}</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString("ko-KR")}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
        {isLoading && (
          <Loader2 className="absolute right-28 top-1/2 h-4 w-4 -translate-y-1/2 transform animate-spin text-slate-400" />
        )}
        <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2">
          <div
            className="relative flex h-8 w-[110px] items-center overflow-hidden rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 shadow-sm dark:border-slate-700 dark:bg-slate-800/80"
            role="group"
            aria-label="검색 모드 전환"
          >
            <span
              className={`pointer-events-none absolute top-0.5 h-7 w-[52px] rounded-md bg-gradient-to-r from-blue-600 to-blue-500 shadow-sm transition-transform duration-200 ease-out dark:from-blue-500 dark:to-blue-400 ${
                mode === "semantic" ? "translate-x-0.5" : "translate-x-[56px]"
              }`}
            />
            <button
              type="button"
              aria-pressed={mode === "semantic"}
              className={`relative z-10 flex h-7 w-[54px] items-center justify-center rounded-md px-0 text-[11px] font-semibold tracking-tight transition-colors duration-150 ${
                mode === "semantic" ? "text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              }`}
              onClick={() => setMode((prev) => (prev === "semantic" ? "keyword" : "semantic"))}
            >
              <Sparkles
                className={`mr-1 h-3 w-3 transition-opacity duration-150 ${
                  mode === "semantic" ? "opacity-100" : "opacity-70"
                }`}
              />
              AI
            </button>
            <button
              type="button"
              aria-pressed={mode === "keyword"}
              className={`relative z-10 flex h-7 w-[54px] items-center justify-center rounded-md px-0 text-[11px] font-semibold tracking-tight transition-colors duration-150 ${
                mode === "keyword" ? "text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              }`}
              onClick={() => setMode((prev) => (prev === "keyword" ? "semantic" : "keyword"))}
            >
              일반
            </button>
          </div>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={mode === "semantic" ? "AI 검색: 궁금한 내용을 질문해보세요" : "일반 검색: 키워드를 입력해보세요"}
          className={`h-11 rounded-xl border-slate-200 bg-white/80 pl-10 pr-32 text-sm text-slate-700 placeholder:text-slate-500 transition-all duration-300 hover:bg-white focus:border-blue-400/50 focus:ring-4 focus:ring-blue-500/10 focus:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400 ${className}`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900">
          {error ? (
            <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : !query.trim() ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">질문을 입력하세요</div>
          ) : mode === "semantic" ? (
            <div className="p-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                AI 검색은 입력 완료 후 <span className="font-semibold">Enter</span>를 누르면 실행됩니다.
              </div>
            </div>
          ) : mode === "keyword" && keywordResults && (keywordResults.companies?.length > 0 || keywordResults.posts?.length > 0) ? (
            <div>
              {keywordResults.companies && keywordResults.companies.length > 0 && (
                <div>
                  <div className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                    🏢 회사
                  </div>
                  {keywordResults.companies.slice(0, 5).map((company, index) => renderCompanyItem(company, index))}
                </div>
              )}

              {keywordResults.posts && keywordResults.posts.length > 0 && (
                <div>
                  <div className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                    📝 게시물
                  </div>
                  {keywordResults.posts.slice(0, 5).map((post, index) =>
                    renderPostItem(post, Math.min(keywordResults.companies?.length || 0, 5) + index)
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">검색 결과가 없습니다</div>
          )}
        </div>
      )}
    </div>
  )
}

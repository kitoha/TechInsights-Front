"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiGet } from "@/lib/shared/api"
import { InstantSearchCompany, InstantSearchPost, InstantSearchResponse, SearchMode, SemanticSearchResponse } from "@/lib/search/types"
import { isAxiosError } from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

interface SearchBarProps {
  className?: string;
}

interface SemanticCacheEntry {
  data: SemanticSearchResponse
  timestamp: number
}

interface KeywordCacheEntry {
  data: InstantSearchResponse
  timestamp: number
}

const semanticCache = new Map<string, SemanticCacheEntry>()
const keywordCache = new Map<string, KeywordCacheEntry>()
const CACHE_DURATION = 5 * 60 * 1000
const DROPDOWN_SIZE = 5
const MAX_QUERY_LENGTH = 500

function resolveSearchMode(mode?: string | null): SearchMode {
  return mode === "keyword" ? "keyword" : "semantic"
}

function getSimilarityLabel(score: number) {
  if (score >= 0.9) return "매우 유사"
  if (score >= 0.7) return "관련 있음"
  return "약한 연관"
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<SearchMode>("semantic")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [semanticResults, setSemanticResults] = useState<SemanticSearchResponse | null>(null)
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
    if (mode === "semantic") {
      return semanticResults?.results.length || 0
    }
    const companiesCount = Math.min(keywordResults?.companies?.length || 0, 5)
    const postsCount = Math.min(keywordResults?.posts?.length || 0, 5)
    return companiesCount + postsCount
  }, [mode, semanticResults, keywordResults])

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
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSemanticResults(null)
      setKeywordResults(null)
      setIsOpen(false)
      setError(null)
      return
    }

    if (trimmedQuery.length > MAX_QUERY_LENGTH) {
      setSemanticResults(null)
      setKeywordResults(null)
      setError(`질문은 ${MAX_QUERY_LENGTH}자 이내로 입력해주세요.`)
      setIsOpen(true)
      setIsLoading(false)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const timeoutId = setTimeout(async () => {
      const normalizedQuery = trimmedQuery.toLowerCase()
      const now = Date.now()

      if (mode === "semantic") {
        const cached = semanticCache.get(normalizedQuery)
        if (cached && now - cached.timestamp < CACHE_DURATION) {
          setSemanticResults(cached.data)
          setKeywordResults(null)
          setIsOpen(true)
          setSelectedIndex(-1)
          setIsLoading(false)
          return
        }
      } else {
        const cached = keywordCache.get(normalizedQuery)
        if (cached && now - cached.timestamp < CACHE_DURATION) {
          setKeywordResults(cached.data)
          setSemanticResults(null)
          setIsOpen(true)
          setSelectedIndex(-1)
          setIsLoading(false)
          return
        }
      }

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        setIsLoading(true)
        setError(null)

        if (mode === "semantic") {
          const response = await apiGet<SemanticSearchResponse>(
            `/api/v1/search/semantic?query=${encodeURIComponent(query)}&size=${DROPDOWN_SIZE}`,
            { signal: abortController.signal }
          )

          if (!abortController.signal.aborted) {
            setSemanticResults(response.data)
            setKeywordResults(null)
            setIsOpen(true)
            setSelectedIndex(-1)
            semanticCache.set(normalizedQuery, { data: response.data, timestamp: now })
          }
        } else {
          const response = await apiGet<InstantSearchResponse>(
            `/api/v1/search/instant?query=${encodeURIComponent(query)}`,
            { signal: abortController.signal }
          )

          if (!abortController.signal.aborted) {
            setKeywordResults(response.data)
            setSemanticResults(null)
            setIsOpen(true)
            setSelectedIndex(-1)
            keywordCache.set(normalizedQuery, { data: response.data, timestamp: now })
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }
        if (!abortController.signal.aborted) {
          const status = isAxiosError(err) ? err.response?.status : undefined
          if (status === 400) {
            setError(mode === "semantic"
              ? "요청 조건이 올바르지 않습니다. 질문(1~500자)을 확인해주세요."
              : "검색어 조건이 올바르지 않습니다."
            )
          } else {
            setError("검색 중 오류가 발생했습니다.")
          }
          setSemanticResults(null)
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
    if (mode === "semantic") {
      const selected = semanticResults?.results[index]
      if (!selected) return
      router.push(`/post/${selected.post.id}`)
    } else {
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
      <div className="mb-2 flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "semantic" ? "default" : "outline"}
          className="h-7 px-3 text-xs"
          onClick={() => setMode("semantic")}
        >
          AI 검색
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "keyword" ? "default" : "outline"}
          className="h-7 px-3 text-xs"
          onClick={() => setMode("keyword")}
        >
          일반 검색
        </Button>
      </div>

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
          placeholder={mode === "semantic" ? "AI 검색: 궁금한 내용을 질문해보세요" : "일반 검색: 키워드를 입력해보세요"}
          className={`pl-10 pr-10 border-gray-200 text-gray-900 placeholder-gray-500 transition-all duration-200 hover:shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg dark:border-gray-700 dark:text-white dark:placeholder-gray-400 ${className}`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-2xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900">
          {error ? (
            <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : !query.trim() ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">질문을 입력하세요</div>
          ) : mode === "semantic" && semanticResults && semanticResults.results.length > 0 ? (
            <div>
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 text-xs font-bold text-gray-600 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300">
                AI 검색 미리보기
              </div>
              {semanticResults.results.map((item, index) => (
                <div
                  key={item.post.id}
                  className={`flex cursor-pointer items-center gap-3 p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 ${
                    selectedIndex === index ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700" : ""
                  }`}
                  onClick={() => handleItemClick(index)}
                >
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm dark:from-gray-800 dark:to-gray-700">
                    <Image src={`/logos/${item.post.companyLogo}`} alt={item.post.companyName} width={40} height={40} className="h-full w-full rounded-xl object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.post.title}</div>
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
                  {keywordResults.posts.slice(0, 5).map((post, index) => renderPostItem(post, (keywordResults.companies?.length || 0) + index))}
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

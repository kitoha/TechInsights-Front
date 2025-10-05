"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { apiGet } from "@/lib/api"
import { InstantSearchResponse, InstantSearchCompany, InstantSearchPost } from "@/lib/searchTypes"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<InstantSearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Debounce 검색
  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      setIsOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await apiGet<InstantSearchResponse>(
          `/api/v1/search/instant?query=${encodeURIComponent(query)}`
        )
        setResults(response.data)
        setIsOpen(true)
        setSelectedIndex(-1)
      } catch {
        setError("검색 중 오류가 발생했습니다.")
        setResults(null)
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // 외부 클릭 시 드롭다운 닫기
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !results) return

    const maxCompanies = Math.min(results.companies?.length || 0, 5)
    const maxPosts = Math.min(results.posts?.length || 0, 5)
    const totalItems = maxCompanies + maxPosts
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % totalItems)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1)
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleItemClick(selectedIndex)
        } else {
          // 엔터 시 전체 검색 페이지로 이동
          router.push(`/search?query=${encodeURIComponent(query)}`)
          setIsOpen(false)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleItemClick = (index: number) => {
    if (!results) return

    const maxCompanies = Math.min(results.companies?.length || 0, 5)
    const companies = results.companies?.slice(0, 5) || []
    const posts = results.posts?.slice(0, 5) || []
    
    if (index < maxCompanies) {
      router.push(`/company/${companies[index].id}`)
    } else {
      const postIndex = index - maxCompanies
      router.push(`/post/${posts[postIndex].id}`)
    }
    setIsOpen(false)
    setQuery("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
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
        selectedIndex === index ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700' : ''
      }`}
      onClick={() => handleItemClick(index)}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
        <Image 
          src={`/logos/${company.logoImageName}`} 
          alt={company.name} 
          width={40} 
          height={40} 
          className="object-cover w-full h-full rounded-xl" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {renderHighlightedText(company.highlightedName)}
        </div>
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
        selectedIndex === index ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700' : ''
      }`}
      onClick={() => handleItemClick(index)}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
        <Image 
          src={`/logos/${post.companyLogo}`} 
          alt={post.companyName} 
          width={40} 
          height={40} 
          className="object-cover w-full h-full rounded-xl" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
          {renderHighlightedText(post.highlightedTitle)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{post.companyName}</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
        )}
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search for posts, topics, or companies"
          className="pl-10 pr-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* 검색 결과 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 backdrop-blur-sm">
          {error ? (
            <div className="p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : !query.trim() ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
              검색어를 입력하세요
            </div>
          ) : results && (results.companies?.length > 0 || results.posts?.length > 0) ? (
            <div>
              {/* 회사 섹션 */}
              {results.companies && results.companies.length > 0 && (
                <div>
                  <div className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                    🏢 회사
                  </div>
                  {results.companies.slice(0, 5).map((company, index) => renderCompanyItem(company, index))}
                </div>
              )}
              
              {/* 게시물 섹션 */}
              {results.posts && results.posts.length > 0 && (
                <div>
                  <div className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                    📝 게시물
                  </div>
                  {results.posts.slice(0, 5).map((post, index) => 
                    renderPostItem(post, (results.companies?.length || 0) + index)
                  )}
                </div>
              )}
            </div>
          ) : results && results.companies?.length === 0 && results.posts?.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
              검색 결과가 없습니다
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

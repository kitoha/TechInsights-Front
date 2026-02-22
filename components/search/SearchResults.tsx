"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchMode, SearchResponse, SemanticSearchResponse, SortBy } from "@/lib/search/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react"
import Image from "next/image"

interface SearchResultsProps {
  query: string;
  mode: SearchMode;
  semanticData: SemanticSearchResponse | null;
  keywordData: SearchResponse | null;
  error: string | null;
  currentPage: number;
  sortBy: SortBy;
}

function getSimilarityMeta(score: number) {
  if (score >= 0.9) {
    return {
      label: "매우 유사",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
    }
  }

  if (score >= 0.7) {
    return {
      label: "관련 있음",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
    }
  }

  return {
    label: "약한 연관",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
  }
}

export default function SearchResults({
  query,
  mode,
  semanticData,
  keywordData,
  error,
  currentPage,
  sortBy,
}: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<string>>(new Set())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const handleModeChange = (nextMode: SearchMode) => {
    if (nextMode === mode) {
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set("mode", nextMode)

    if (nextMode === "semantic") {
      params.delete("page")
      params.delete("sortBy")
      if (!params.get("size")) {
        params.set("size", "10")
      }
    } else {
      params.set("page", "0")
      if (!params.get("sortBy")) {
        params.set("sortBy", "RELEVANCE")
      }
      params.delete("size")
      params.delete("companyId")
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      return
    }

    const params = new URLSearchParams(searchParams)
    params.set("sortBy", newSortBy)
    params.set("page", "0")
    params.set("mode", "keyword")
    router.push(`/search?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    params.set("mode", "keyword")
    router.push(`/search?${params.toString()}`)
  }

  const renderHighlightedText = (text: string) => {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: text }}
        className="[&_mark]:bg-gradient-to-r [&_mark]:from-blue-400 [&_mark]:to-purple-500 [&_mark]:text-white [&_mark]:px-1.5 [&_mark]:py-0.5 [&_mark]:rounded-md [&_mark]:font-medium [&_mark]:shadow-sm"
      />
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">검색 오류</h1>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (mode === "semantic") {
    if (!semanticData) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">검색 중...</p>
        </div>
      )
    }

    const topSimilarity = semanticData.results[0]?.similarityScore ?? 0

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => handleModeChange("semantic")}
          >
            AI 검색
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModeChange("keyword")}
          >
            일반 검색
          </Button>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white hover:bg-blue-600">AI 검색</Badge>
            <p className="text-sm text-blue-900 dark:text-blue-200">
              질문과 관련된 게시글을 AI로 찾아 보여줍니다.
            </p>
          </div>
          <p className="mt-1 text-xs text-blue-800 dark:text-blue-300">
            현재는 답변 생성 없이, 관련 문서 탐색을 제공합니다.
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            &ldquo;{query}&rdquo; AI 검색 결과
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            관련 게시글 {semanticData.totalReturned.toLocaleString()}건 · 처리 시간 {semanticData.processingTimeMs.toLocaleString()}ms
          </p>
        </div>

        {topSimilarity > 0 && topSimilarity < 0.7 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            상위 결과의 유사도가 낮습니다. 질문을 더 구체적으로 입력하면 더 정확한 문서를 찾을 수 있습니다.
          </div>
        )}

        {semanticData.results.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">검색 결과가 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400">질문을 조금 더 구체적으로 바꿔보세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            {semanticData.results.map((result) => {
              const { post } = result
              const similarity = getSimilarityMeta(result.similarityScore)

              return (
                <Card
                  key={post.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => router.push(`/post/${post.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {post.thumbnail && !thumbnailErrors.has(post.id) ? (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            width={120}
                            height={80}
                            className="rounded-lg object-cover"
                            onError={() => {
                              setThumbnailErrors((prev) => new Set(prev).add(post.id))
                            }}
                          />
                        ) : (
                          <Image
                            src={`/logos/${post.companyLogo}`}
                            alt={post.companyName}
                            width={120}
                            height={80}
                            className="rounded-lg object-cover bg-gray-100 p-2 dark:bg-gray-700"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline">#{result.rank}</Badge>
                          <Badge className={similarity.className}>
                            {result.similarityScore.toFixed(3)} · {similarity.label}
                          </Badge>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{post.companyName}</span>
                        </div>

                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h3>

                        {post.preview && (
                          <p className="mb-3 line-clamp-2 text-gray-600 dark:text-gray-400">{post.preview}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.publishedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatViewCount(post.viewCount)}
                          </div>
                          {post.isSummary && (
                            <Badge variant="secondary" className="text-xs">요약</Badge>
                          )}
                        </div>

                        {post.categories.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {post.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">{category}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (!keywordData) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">검색 중...</p>
      </div>
    )
  }

  const { posts, totalCount, totalPages, hasNext } = keywordData

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleModeChange("semantic")}
        >
          AI 검색
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => handleModeChange("keyword")}
        >
          일반 검색
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">일반 검색</Badge>
          <p className="text-sm text-gray-700 dark:text-gray-200">키워드 기반으로 게시글을 검색합니다.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">&ldquo;{query}&rdquo; 검색 결과</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">총 {totalCount.toLocaleString()}개의 결과</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === "RELEVANCE" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("RELEVANCE")}
          >
            관련도순
          </Button>
          <Button
            variant={sortBy === "LATEST" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("LATEST")}
          >
            최신순
          </Button>
          <Button
            variant={sortBy === "POPULAR" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("POPULAR")}
          >
            인기순
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">검색 결과가 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400">다른 검색어로 시도해보세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/post/${post.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {post.thumbnail && !thumbnailErrors.has(post.id) ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover"
                        onError={() => {
                          setThumbnailErrors((prev) => new Set(prev).add(post.id))
                        }}
                      />
                    ) : (
                      <Image
                        src={`/logos/${post.companyLogo}`}
                        alt={post.companyName}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover bg-gray-100 dark:bg-gray-700 p-2"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Image
                          src={`/logos/${post.companyLogo}`}
                          alt={post.companyName}
                          width={24}
                          height={24}
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{post.companyName}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {renderHighlightedText(post.title)}
                    </h3>

                    {post.preview && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{post.preview}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatViewCount(post.viewCount)}
                      </div>
                      {post.isSummary && (
                        <Badge variant="secondary" className="text-xs">요약</Badge>
                      )}
                    </div>

                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">{category}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5))
              const pageNum = startPage + i

              if (pageNum >= totalPages) return null

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum + 1}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
          >
            다음
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

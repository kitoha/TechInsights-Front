import { Suspense } from "react"
import { SearchMode, SearchResponse, SemanticSearchResponse, SortBy } from "@/lib/search/types"
import { apiGet } from "@/lib/shared/api"
import { isAxiosError } from "axios"
import { redirect } from "next/navigation"
import SearchResults from "@/components/search/SearchResults"

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortBy?: string;
    mode?: string;
    size?: string;
    companyId?: string;
  }>;
}

const DEFAULT_SIZE = 10
const MAX_QUERY_LENGTH = 500
const VALID_SORT_BY: SortBy[] = ["RELEVANCE", "LATEST", "POPULAR"]

function resolveSearchMode(mode?: string): SearchMode {
  return mode === "keyword" ? "keyword" : "semantic"
}

function resolveSortBy(sortBy?: string): SortBy {
  return sortBy && VALID_SORT_BY.includes(sortBy as SortBy) ? (sortBy as SortBy) : "RELEVANCE"
}

function getValidationError(mode: SearchMode, query: string, size: number): string | null {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return "질문을 입력해주세요."
  }

  if (trimmedQuery.length > MAX_QUERY_LENGTH) {
    return `질문은 ${MAX_QUERY_LENGTH}자 이내로 입력해주세요.`
  }

  if (mode === "semantic" && (!Number.isInteger(size) || size < 1 || size > 20)) {
    return "결과 개수(size)는 1~20 범위에서 요청해주세요."
  }

  return null
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params?.query || ""
  const mode = resolveSearchMode(params?.mode)
  const page = Number(params?.page) || 0
  const sortBy = resolveSortBy(params?.sortBy)
  const size = params?.size === undefined ? DEFAULT_SIZE : Number(params.size)
  const companyId = params?.companyId

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 text-sm font-semibold">
                AI 검색
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              질문을 입력하세요
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              기존 검색과 AI 검색을 전환해서 사용할 수 있습니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI 검색은 관련 문서를, 일반 검색은 키워드 기반 결과를 제공합니다.
            </p>
          </div>
        </div>
      </div>
    )
  }

  let semanticData: SemanticSearchResponse | null = null
  let keywordData: SearchResponse | null = null
  let error: string | null = null

  const validationError = getValidationError(mode, query, size)
  if (validationError) {
    error = validationError
  } else {
    try {
      if (mode === "semantic") {
        const companyIdParam = companyId ? `&companyId=${encodeURIComponent(companyId)}` : ""
        const response = await apiGet<SemanticSearchResponse>(
          `/api/v1/search/semantic?query=${encodeURIComponent(query)}&size=${size}${companyIdParam}`
        )
        semanticData = response.data
      } else {
        const response = await apiGet<SearchResponse>(
          `/api/v1/search?query=${encodeURIComponent(query)}&page=${page}&size=20&sortBy=${sortBy}`
        )
        keywordData = response.data
      }
    } catch (err) {
      const status: number | undefined = isAxiosError(err) ? err.response?.status : undefined
      if (status === 503) {
        redirect("/maintenance.html")
      }
      if (status === 400) {
        error = mode === "semantic"
          ? "요청 조건이 올바르지 않습니다. 질문(1~500자)과 size(1~20)를 확인해주세요."
          : "요청 조건이 올바르지 않습니다. 검색어를 확인해주세요."
      } else {
        error = "검색 중 오류가 발생했습니다."
      }
      console.error("Search error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>검색 중...</div>}>
          <SearchResults
            query={query}
            mode={mode}
            semanticData={semanticData}
            keywordData={keywordData}
            error={error}
            currentPage={page}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import { SearchResponse, SortBy } from "@/lib/search/types"
import { apiGet } from "@/lib/shared/api"
import { isAxiosError } from "axios"
import { redirect } from "next/navigation"
import SearchResults from "@/components/search/SearchResults"

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortBy?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.query || "";
  const page = Number(params?.page) || 0;
  const sortBy = (params?.sortBy as SortBy) || "RELEVANCE";

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
              질문과 관련된 게시글을 AI로 찾아 보여줍니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              현재는 답변 생성 없이, 관련 문서 탐색을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  let searchData: SearchResponse | null = null;
  let error: string | null = null;

  try {
    const response = await apiGet<SearchResponse>(
      `/api/v1/search?query=${encodeURIComponent(query)}&page=${page}&size=20&sortBy=${sortBy}`
    );
    searchData = response.data;
  } catch (err) {
    const status: number | undefined = isAxiosError(err) ? err.response?.status : undefined;
    if (status === 503) {
      redirect('/maintenance.html');
    }
    error = "검색 중 오류가 발생했습니다.";
    console.error('Search error:', err);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>검색 중...</div>}>
          <SearchResults 
            query={query}
            searchData={searchData}
            error={error}
            currentPage={page}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  );
}

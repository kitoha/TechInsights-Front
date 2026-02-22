import { Suspense } from "react"
import { SemanticSearchResponse } from "@/lib/search/types"
import { apiGet } from "@/lib/shared/api"
import { isAxiosError } from "axios"
import { redirect } from "next/navigation"
import SearchResults from "@/components/search/SearchResults"

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    size?: string;
    companyId?: string;
  }>;
}

const DEFAULT_SIZE = 10;
const MAX_QUERY_LENGTH = 500;

function getValidationError(query: string, size: number): string | null {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return "질문을 입력해주세요.";
  }

  if (trimmedQuery.length > MAX_QUERY_LENGTH) {
    return `질문은 ${MAX_QUERY_LENGTH}자 이내로 입력해주세요.`;
  }

  if (!Number.isInteger(size) || size < 1 || size > 20) {
    return "결과 개수(size)는 1~20 범위에서 요청해주세요.";
  }

  return null;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params?.query || "";
  const size = params?.size === undefined ? DEFAULT_SIZE : Number(params.size);
  const companyId = params?.companyId;

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

  let searchData: SemanticSearchResponse | null = null;
  let error: string | null = null;
  const validationError = getValidationError(query, size);

  if (validationError) {
    error = validationError;
  } else {
    try {
      const companyIdParam = companyId ? `&companyId=${encodeURIComponent(companyId)}` : "";
      const response = await apiGet<SemanticSearchResponse>(
        `/api/v1/search/semantic?query=${encodeURIComponent(query)}&size=${size}${companyIdParam}`
      );
      searchData = response.data;
    } catch (err) {
      const status: number | undefined = isAxiosError(err) ? err.response?.status : undefined;
      if (status === 503) {
        redirect('/maintenance.html');
      }
      if (status === 400) {
        error = "요청 조건이 올바르지 않습니다. 질문(1~500자)과 size(1~20)를 확인해주세요.";
      } else {
        error = "검색 중 오류가 발생했습니다.";
      }
      console.error('Search error:', err);
    }
  } 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>검색 중...</div>}>
          <SearchResults 
            query={query}
            searchData={searchData}
            error={error}
          />
        </Suspense>
      </div>
    </div>
  );
}

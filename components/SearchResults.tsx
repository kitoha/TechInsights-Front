"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchResponse, SortBy } from "@/lib/searchTypes"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react"
import Image from "next/image"

interface SearchResultsProps {
  query: string;
  searchData: SearchResponse | null;
  error: string | null;
  currentPage: number;
  sortBy: SortBy;
}

export default function SearchResults({ 
  query, 
  searchData, 
  error, 
  currentPage, 
  sortBy 
}: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<string>>(new Set());

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', newSortBy);
    params.set('page', '0');
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  const renderHighlightedText = (text: string) => {
    return (
      <span 
        dangerouslySetInnerHTML={{ __html: text }}
        className="[&_mark]:bg-gradient-to-r [&_mark]:from-blue-400 [&_mark]:to-purple-500 [&_mark]:text-white [&_mark]:px-1.5 [&_mark]:py-0.5 [&_mark]:rounded-md [&_mark]:font-medium [&_mark]:shadow-sm"
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          검색 오류
        </h1>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!searchData) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">검색 중...</p>
      </div>
    );
  }

  const { posts, totalCount, totalPages, hasNext } = searchData;

  return (
    <div className="space-y-6">
      {/* 검색 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            &ldquo;{query}&rdquo; 검색 결과
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            총 {totalCount.toLocaleString()}개의 결과
          </p>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === "RELEVANCE" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("RELEVANCE")}
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            관련도순
          </Button>
          <Button
            variant={sortBy === "LATEST" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("LATEST")}
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            최신순
          </Button>
          <Button
            variant={sortBy === "POPULAR" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("POPULAR")}
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            인기순
          </Button>
        </div>
      </div>

      {/* 검색 결과 */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            검색 결과가 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            다른 검색어로 시도해보세요
          </p>
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
                  {/* 썸네일 */}
                  <div className="flex-shrink-0">
                    {post.thumbnail && !thumbnailErrors.has(post.id) ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover"
                        onError={() => {
                          setThumbnailErrors((prev) => new Set(prev).add(post.id));
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
                    {/* 회사 정보 */}
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
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {post.companyName}
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {renderHighlightedText(post.title)}
                    </h3>

                    {/* 미리보기 */}
                    {post.preview && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {post.preview}
                      </p>
                    )}

                    {/* 메타 정보 */}
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
                        <Badge variant="secondary" className="text-xs">
                          요약
                        </Badge>
                      )}
                    </div>

                    {/* 카테고리 */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
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

      {/* 페이지네이션 */}
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
              const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
              const pageNum = startPage + i;
              
              if (pageNum >= totalPages) return null;

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
              );
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
  );
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SemanticSearchResponse } from "@/lib/search/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"
import Image from "next/image"

interface SearchResultsProps {
  query: string;
  searchData: SemanticSearchResponse | null;
  error: string | null;
}

function getSimilarityMeta(score: number) {
  if (score >= 0.9) {
    return {
      label: "매우 유사",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
    };
  }

  if (score >= 0.7) {
    return {
      label: "관련 있음",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
    };
  }

  return {
    label: "약한 연관",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
  };
}

export default function SearchResults({
  query,
  searchData,
  error,
}: SearchResultsProps) {
  const router = useRouter();
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const topSimilarity = searchData.results[0]?.similarityScore ?? 0;

  return (
    <div className="space-y-6">
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            &ldquo;{query}&rdquo; AI 검색 결과
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            관련 게시글 {searchData.totalReturned.toLocaleString()}건 · 처리 시간 {searchData.processingTimeMs.toLocaleString()}ms
          </p>
        </div>
      </div>

      {topSimilarity > 0 && topSimilarity < 0.7 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          상위 결과의 유사도가 낮습니다. 질문을 더 구체적으로 입력하면 더 정확한 문서를 찾을 수 있습니다.
        </div>
      )}

      {searchData.results.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            검색 결과가 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            질문을 조금 더 구체적으로 바꿔보세요
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {searchData.results.map((result) => {
            const { post } = result;
            const similarity = getSimilarityMeta(result.similarityScore);

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
                            setThumbnailErrors((prev) => new Set(prev).add(post.id));
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
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {post.companyName}
                        </span>
                      </div>

                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {post.title}
                      </h3>

                      {post.preview && (
                        <p className="mb-3 line-clamp-2 text-gray-600 dark:text-gray-400">
                          {post.preview}
                        </p>
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
                          <Badge variant="secondary" className="text-xs">
                            요약
                          </Badge>
                        )}
                      </div>

                      {post.categories.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
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
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import CategoryBadges from "@/components/CategoryBadges";
import { OptimizedImage } from "@/components/OptimizedImage";
import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";


interface Post {
  id: string;
  companyName: string;
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt: string;
  logoImageName?: string;
  categories?: string[];
   viewCount?: number;
}

interface PostListProps {
  posts: Post[];
  totalPages: number;
  page: number;
  selectedCategory: string;
  categories: string[];
  companyId?: string;
}

const PostList = memo(function PostList({ posts, totalPages, page, selectedCategory, categories, companyId }: PostListProps) {
  const router = useRouter();
  const maxVisible = 5;
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages, start + maxVisible);
  const pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);

  const handleTabClick = useCallback((category: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("category", category);
    params.set("page", "0");
    router.push(`?${params.toString()}`);
  }, [router]);

  const handlePageClick = useCallback((p: number) => {
    const params = new URLSearchParams(window.location.search);
    if (companyId) {
      // 회사 페이지에서는 companyId를 URL 파라미터로 유지
      params.set("page", String(p));
      router.push(`/company/${companyId}?${params.toString()}`);
    } else {
      // 홈페이지에서는 category 파라미터 사용
      params.set("category", selectedCategory);
      params.set("page", String(p));
      router.push(`?${params.toString()}`);
    }
  }, [selectedCategory, companyId, router]);


  return (
    <>
      {/* Category Tabs - 회사별 게시글일 때는 숨김 */}
      {!companyId && (
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={
                "px-4 py-2 rounded-full font-medium transition shadow-sm border cursor-pointer " +
                (selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:text-white dark:border-blue-400"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:hover:border-blue-500")
              }
              onClick={() => handleTabClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      {/* Latest Posts */}
      <section className="mb-12">
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              {companyId ? (
                // 회사별 게시글일 때
                <>
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    게시글이 없습니다
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 text-center max-w-md">
                    해당 회사의 게시글이 존재하지 않습니다.<br />
                    다른 회사의 게시글을 확인해보세요.
                  </p>
                  <div className="mt-6">
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      전체 게시글 보기
                    </button>
                  </div>
                </>
              ) : (
                // 일반 게시글일 때
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg font-medium">데이터가 없습니다.</span>
                </>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="cursor-pointer" onClick={() => handlePageClick(page - 1)} aria-disabled={page <= 0} />
            </PaginationItem>
            {start > 0 && (
              <>
                <PaginationItem>
                  <PaginationLink className="cursor-pointer" onClick={() => handlePageClick(0)}>1</PaginationLink>
                </PaginationItem>
                {start > 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}
            {pageNumbers.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink className="cursor-pointer" onClick={() => handlePageClick(p)} isActive={p === page}>
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {end < totalPages && (
              <>
                {end < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink className="cursor-pointer" onClick={() => handlePageClick(totalPages - 1)}>{totalPages}</PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext className="cursor-pointer" onClick={() => handlePageClick(page + 1)} aria-disabled={page + 1 >= totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </>
  );
});

const PostCard = memo(function PostCard({ post }: { post: Post }) {
  return (
  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
    <CardContent className="px-6 py-0">
      <Link href={`/post/${post.id}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-6 flex flex-col min-h-[150px] justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {post.logoImageName && (
                  <OptimizedImage
                    src={`/logos/${post.logoImageName}`}
                    alt={post.companyName}
                    width={24}
                    height={24}
                    className="object-contain w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  />
                )}
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{post.companyName}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{post.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <CategoryBadges categories={post.categories || []} />
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {(() => {
                      const date = new Date(post.publishedAt);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      return `${year}년${month}월${day}일`;
                    })()}
                  </span>
                </div>

                {typeof post.viewCount === "number" && post.viewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>조회 {post.viewCount.toLocaleString()}회</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-24 flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <OptimizedImage
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={192}
                height={192}
                className="w-full h-full object-cover rounded-lg"
                fallbackSrc={post.logoImageName ? `/logos/${post.logoImageName}` : "/placeholder.svg"}
              />
            </div>
          </div>
        </div>
      </Link>
    </CardContent>
  </Card>
  );
});

export default PostList; 
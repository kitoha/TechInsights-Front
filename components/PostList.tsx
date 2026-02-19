"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import CategoryBadges from "@/components/CategoryBadges";
import { OptimizedImage } from "@/components/OptimizedImage";
import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye } from "lucide-react";


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
  thumbnail?: string;
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

      params.set("page", String(p));

      router.push(`/company/${companyId}?${params.toString()}`);

    } else {

      params.set("category", selectedCategory);

      params.set("page", String(p));

      router.push(`?${params.toString()}`);

    }

  }, [selectedCategory, companyId, router]);





  return (

    <>

      {/* Latest Posts */}

      <section className="mb-12">

        <div className="grid grid-cols-1 gap-6">


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
        <Pagination className="mt-10">
          <PaginationContent className="gap-1.5">
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
  const thumbnail = post.thumbnail || post.image;

  return (
    <Card className="group bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300 dark:hover:border-blue-700 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden">
      <Link href={`/post/${post.id}`}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-5">
            {/* Thumbnail Section */}
            {thumbnail ? (
              <div className="relative w-full md:w-56 h-44 md:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 md:ml-5 md:my-5 rounded-lg">
                <OptimizedImage
                  src={thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackSrc="/placeholder.svg"
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ) : (
              /* Fallback: Company Logo as Background */
              <div className="relative w-full md:w-56 h-44 md:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 md:ml-5 md:my-5 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  {post.logoImageName ? (
                    <OptimizedImage
                      src={`/logos/${post.logoImageName}`}
                      alt={post.companyName}
                      width={112}
                      height={112}
                      className="opacity-20 object-contain"
                      fallbackSrc="/placeholder.svg"
                    />
                  ) : (
                    <div className="text-5xl font-bold text-white/20">
                      {post.companyName[0]}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="flex-1 p-6 md:pr-6 md:py-6 md:pl-0 flex flex-col justify-between min-h-[200px]">
              <div className="space-y-3">
                {/* Header: Company & Date */}
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-background border border-border/50 flex items-center justify-center overflow-hidden">
                    {post.logoImageName ? (
                      <OptimizedImage
                        src={`/logos/${post.logoImageName}`}
                        alt={post.companyName}
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-[9px] font-bold">
                        {post.companyName[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-[13px] font-semibold text-foreground/90">{post.companyName}</span>
                  <span className="text-[13px] text-muted-foreground/50">•</span>
                  <span className="text-[13px] text-muted-foreground/70">
                    {(() => {
                      const date = new Date(post.publishedAt);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      return `${year}년 ${month}월 ${day}일`;
                    })()}
                  </span>
                </div>

                {/* Title: Large & Bold */}
                <h2 className="text-[20px] md:text-[22px] font-bold text-foreground leading-[1.35] tracking-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="text-[14px] md:text-[15px] text-muted-foreground/75 leading-[1.6] line-clamp-2">
                  {post.description}
                </p>
              </div>

              {/* Footer: Tags & Actions */}
              <div className="flex items-center justify-between pt-3 mt-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  {post.categories?.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-[11px] font-semibold rounded-lg text-blue-600 dark:text-blue-400 uppercase tracking-wide hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button className="p-2 text-muted-foreground/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors cursor-pointer">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  </button>
                  <button className="p-2 text-muted-foreground/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors cursor-pointer">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
});

export default PostList; 
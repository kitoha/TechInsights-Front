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

        <div className="grid grid-cols-1 gap-5">


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
    <Card className="group bg-white dark:bg-gray-900 border border-border/40 hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
      <Link href={`/post/${post.id}`}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-3">
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
            <h2 className="text-2xl font-bold text-foreground leading-[1.3] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-[15px] text-muted-foreground/80 leading-relaxed line-clamp-2">
              {post.description}
            </p>

            {/* Footer: Tags & Actions */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                {post.categories?.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold rounded-md text-muted-foreground uppercase tracking-wide"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </button>
                <button className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
});

export default PostList; 
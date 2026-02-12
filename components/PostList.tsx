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
      {/* Category Tabs */}
      {!companyId && (
        <div className="flex flex-wrap gap-2 mb-8 bg-muted/30 p-1.5 rounded-2xl w-fit border border-border/50">
          {categories.map((category) => (
            <button
              key={category}
              className={
                "px-5 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer text-sm " +
                (selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
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
    <Card className="group bg-card hover:bg-accent/5 border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden rounded-2xl">
      <Link href={`/post/${post.id}`}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image Section - Tablet/Desktop Left, Mobile Top */}
            <div className="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
              <OptimizedImage
                src={post.image || (post.logoImageName ? `/logos/${post.logoImageName}` : "/placeholder.svg")}
                alt={post.title}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                fallbackSrc="/placeholder.svg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 bg-background rounded-lg border border-border group-hover:border-primary/30 transition-colors">
                      {post.logoImageName && (
                        <OptimizedImage
                          src={`/logos/${post.logoImageName}`}
                          alt={post.companyName}
                          width={20}
                          height={20}
                          className="object-contain w-5 h-5 rounded-md"
                        />
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">
                      {post.companyName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {typeof post.viewCount === "number" && post.viewCount > 0 && (
                      <div className="flex items-center gap-1.5 border-l border-border pl-3">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.viewCount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-wrap gap-2">
                  {post.categories?.slice(0, 3).map((cat) => (
                    <span 
                      key={cat} 
                      className="px-2.5 py-1 bg-muted text-[11px] font-bold rounded-md text-muted-foreground uppercase tracking-wider border border-border group-hover:border-primary/20 transition-colors"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
"use client";
import Link from "next/link";
import { isAxiosError } from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { togglePostBookmark } from "@/lib/bookmarks";


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
  isFavorite?: boolean;
}

interface PostListProps {
  posts: Post[];
  totalPages: number;
  page: number;
  selectedCategory: string;
  categories: string[];
  companyId?: string;
}

const PostList = memo(function PostList({ posts, totalPages, page, selectedCategory, companyId }: PostListProps) {

  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [displayPosts, setDisplayPosts] = useState(posts);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const maxVisible = 5;

  const start = Math.max(0, page - 2);

  const end = Math.min(totalPages, start + maxVisible);

  const pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);

  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

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

  const handleToggleBookmark = useCallback(async (postId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (pendingIds.includes(postId)) {
      return;
    }

    const targetPost = displayPosts.find((item) => item.id === postId);
    if (!targetPost) {
      return;
    }

    const previousBookmarked = !!targetPost.isFavorite;
    setPendingIds((prev) => [...prev, postId]);
    setDisplayPosts((prev) =>
      prev.map((item) => item.id === postId ? { ...item, isFavorite: !previousBookmarked } : item)
    );

    try {
      const result = await togglePostBookmark(postId);
      setDisplayPosts((prev) =>
        prev.map((item) => item.id === postId ? { ...item, isFavorite: result.bookmarked } : item)
      );
    } catch (error: unknown) {
      setDisplayPosts((prev) =>
        prev.map((item) => item.id === postId ? { ...item, isFavorite: previousBookmarked } : item)
      );
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("[PostList] bookmark toggle failed", error);
      }
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== postId));
    }
  }, [displayPosts, isLoggedIn, pendingIds]);





  return (

    <>

      {/* Latest Posts */}

      <section className="mb-12">

        <div className="grid grid-cols-1 gap-4">


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
            displayPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                disabled={pendingIds.includes(post.id)}
                onToggleBookmark={handleToggleBookmark}
              />
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
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
});

const PostCard = memo(function PostCard({
  post,
  onToggleBookmark,
  disabled = false,
}: {
  post: Post;
  onToggleBookmark: (postId: string) => void;
  disabled?: boolean;
}) {
  const thumbnail = post.thumbnail || post.image;

  return (
    <Card className="group relative bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md">
      {/* Bookmark Ribbon */}
      <div className="absolute top-0 right-6 z-10">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggleBookmark(post.id)}
          className={`relative group/bookmark ${disabled ? "cursor-wait opacity-60" : "cursor-pointer"}`}
          aria-label={post.isFavorite ? `${post.title} 북마크 해제` : `${post.title} 북마크 추가`}
        >
          <svg
            width="28"
            height="38"
            viewBox="0 0 24 32"
            fill="none"
            className={`transition-all duration-300 drop-shadow-sm ${post.isFavorite
              ? "fill-blue-600 stroke-blue-600"
              : "fill-gray-100/80 dark:fill-gray-700/80 stroke-gray-200 dark:stroke-gray-600 group-hover/bookmark:fill-blue-100 dark:group-hover/bookmark:fill-blue-900/30 group-hover/bookmark:stroke-blue-300"
              }`}
          >
            <path d="M0 0H24V32L12 26L0 32V0Z" strokeWidth="1.5" strokeLinejoin="round" />
            <path
              d="M12 7l1.637 3.317L17.29 10.8l-2.645 2.578.625 3.636L12 15.3l-3.27 1.714.625-3.636L6.71 10.8l3.653-.483L12 7z"
              fill={post.isFavorite ? "white" : "currentColor"}
              className={post.isFavorite ? "" : "opacity-40 group-hover/bookmark:opacity-100"}
            />
          </svg>
        </button>
      </div>

      <Link href={`/post/${post.id}`}>
        <CardContent className="p-0">
          <div className="flex items-stretch gap-5 px-5 py-4 h-[130px]">
            {/* Thumbnail */}
            {thumbnail ? (
              <div className="relative w-28 h-full flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <OptimizedImage
                  src={thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackSrc="/placeholder.svg"
                />
              </div>
            ) : (
              <div className="relative w-28 h-full flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                {post.logoImageName ? (
                  <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out">
                    <OptimizedImage
                      src={`/logos/${post.logoImageName}`}
                      alt={post.companyName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <span className="text-3xl font-bold text-blue-200 dark:text-blue-900/30">{post.companyName[0]}</span>
                  </div>
                )}
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white">
                    {post.logoImageName ? (
                      <OptimizedImage
                        src={`/logos/${post.logoImageName}`}
                        alt={post.companyName}
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">
                        {post.companyName[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300 truncate">{post.companyName}</span>
                  <span className="text-[12px] text-gray-400 dark:text-gray-600">•</span>
                  <span className="text-[12px] text-gray-500 dark:text-gray-500">
                    {(() => {
                      const date = new Date(post.publishedAt);
                      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
                    })()}
                  </span>
                  {post.viewCount !== undefined && (
                    <>
                      <span className="text-[12px] text-gray-300 dark:text-gray-700">|</span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <span>{post.viewCount} Views</span>
                      </div>
                    </>
                  )}
                </div>

                <h2 className="text-[18px] md:text-[19px] font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {post.title}
                </h2>

                <p className="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 font-medium opacity-80">
                  {post.description}
                </p>
              </div>

              {/* Bottom: Left Categories */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {post.categories?.slice(0, 3).map((cat) => (
                  <span key={cat} className="px-2.5 py-1 bg-blue-50/50 dark:bg-blue-900/20 text-[10px] font-bold rounded-lg text-blue-600/80 dark:text-blue-400/80 uppercase tracking-tight border border-blue-100/50 dark:border-blue-800/20">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Spacer for Ribbon */}
            <div className="w-12 flex-shrink-0" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
});

export default PostList; 

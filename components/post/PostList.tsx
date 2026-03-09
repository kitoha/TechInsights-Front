"use client";
import { isAxiosError } from "axios";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { togglePostBookmark } from "@/lib/bookmarks";


import { PostCard } from "./PostCard";
import type { Post } from "@/lib/posts/types";


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
  const { bookmarkedPostIds, markPostBookmark } = useBookmarks();
  const [displayPosts, setDisplayPosts] = useState(posts);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const maxVisible = 5;

  const start = Math.max(0, page - 2);

  const end = Math.min(totalPages, start + maxVisible);

  const pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);

  useEffect(() => {
    setDisplayPosts(
      posts.map((post) => ({
        ...post,
        isBookmarked: isLoggedIn ? bookmarkedPostIds.has(post.id) : false,
      }))
    );
  }, [bookmarkedPostIds, isLoggedIn, posts]);

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

    const previousBookmarked = !!targetPost.isBookmarked;
    setPendingIds((prev) => [...prev, postId]);
    setDisplayPosts((prev) =>
      prev.map((item) => item.id === postId ? { ...item, isBookmarked: !previousBookmarked } : item)
    );
    markPostBookmark(postId, !previousBookmarked);

    try {
      const result = await togglePostBookmark(postId);
      setDisplayPosts((prev) =>
        prev.map((item) => item.id === postId ? { ...item, isBookmarked: result.bookmarked } : item)
      );
      markPostBookmark(postId, result.bookmarked);
    } catch (error: unknown) {
      setDisplayPosts((prev) =>
        prev.map((item) => item.id === postId ? { ...item, isBookmarked: previousBookmarked } : item)
      );
      markPostBookmark(postId, previousBookmarked);
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("[PostList] bookmark toggle failed", error);
      }
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== postId));
    }
  }, [displayPosts, isLoggedIn, markPostBookmark, pendingIds]);





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

export default PostList;

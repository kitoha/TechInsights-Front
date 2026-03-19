"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { LoginModal } from "@/components/auth/LoginModal";
import { LoadMoreButton } from "@/components/opensource/LoadMoreButton";
import { RepoCard } from "@/components/opensource/RepoCard";
import { PostCard } from "@/components/post/PostCard";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import {
  fetchBookmarkedPosts,
  fetchBookmarkedRepos,
  fetchBookmarkedPostsCount,
  fetchBookmarkedReposCount,
  toggleGithubBookmark,
  togglePostBookmark,
} from "@/lib/bookmarks";
import { adaptGithubRepo } from "@/lib/opensource";
import type { TrendingRepo } from "@/lib/opensource";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/shared/utils";

type BookmarkTab = "posts" | "repos";

const TAB_BUTTON_STYLES =
  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer";

export function BookmarksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const { markPostBookmark, markRepoBookmark } = useBookmarks();
  const initialTab = searchParams.get("tab") === "repos" ? "repos" : "posts";
  const [tab, setTab] = useState<BookmarkTab>(initialTab);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [bookmarkedRepos, setBookmarkedRepos] = useState<TrendingRepo[]>([]);
  const [postPage, setPostPage] = useState(0);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [postTotalElements, setPostTotalElements] = useState(0);
  const [repoPage, setRepoPage] = useState(0);
  const [repoTotalPages, setRepoTotalPages] = useState(1);
  const [repoTotalElements, setRepoTotalElements] = useState(0);
  const [pendingPostIds, setPendingPostIds] = useState<string[]>([]);
  const [pendingRepoIds, setPendingRepoIds] = useState<string[]>([]);

  const latestRequestId = useRef(0);
  const latestCountRequestId = useRef(0);

  const loadPosts = useCallback(async (page = 0, append = false) => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(false);
    try {
      const result = await fetchBookmarkedPosts({ page });
      if (requestId !== latestRequestId.current) return;
      setBookmarkedPosts((prev) =>
        append ? [...prev, ...result.content.map((post) => ({ ...post, isBookmarked: true }))] : result.content.map((post) => ({ ...post, isBookmarked: true }))
      );
      setPostPage(result.page);
      setPostTotalPages(result.totalPages);
      setPostTotalElements(result.totalElements);
    } catch (error: unknown) {
      if (requestId !== latestRequestId.current) return;
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        setError(true);
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadRepos = useCallback(async (page = 0, append = false) => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(false);
    try {
      const result = await fetchBookmarkedRepos({ page });
      if (requestId !== latestRequestId.current) return;
      const nextRepos = result.content.map((repo) => adaptGithubRepo(repo, { isBookmarked: true }));
      setBookmarkedRepos((prev) => (append ? [...prev, ...nextRepos] : nextRepos));
      setRepoPage(result.page);
      setRepoTotalPages(result.totalPages);
      setRepoTotalElements(result.totalElements);
    } catch (error: unknown) {
      if (requestId !== latestRequestId.current) return;
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        setError(true);
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  const loadCounts = useCallback(async () => {
    if (!isLoggedIn) return;
    const requestId = ++latestCountRequestId.current;
    try {
      const [postCount, repoCount] = await Promise.all([
        fetchBookmarkedPostsCount(),
        fetchBookmarkedReposCount(),
      ]);
      if (requestId !== latestCountRequestId.current) return;
      setPostTotalElements(postCount);
      setRepoTotalElements(repoCount);
    } catch (err: unknown) {
      if (requestId !== latestCountRequestId.current) return;
      if (isAxiosError(err) && err.response?.status === 401) {
        setShowLoginModal(true);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (searchParams.get("tab") === tab) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/bookmarks?${params.toString()}`);
  }, [router, searchParams, tab]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    void loadCounts();
    if (tab === "posts") {
      void loadPosts(0, false);
      return;
    }
    void loadRepos(0, false);
  }, [isLoggedIn, loadCounts, loadPosts, loadRepos, tab]);

  const handleTogglePostBookmark = useCallback(async (postId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (pendingPostIds.includes(postId)) return;

    const postToRestore = bookmarkedPosts.find((post) => post.id === postId);
    if (!postToRestore) return;

    setPendingPostIds((prev) => [...prev, postId]);
    setBookmarkedPosts((prev) => prev.filter((post) => post.id !== postId));
    setPostTotalElements((prev) => Math.max(0, prev - 1));
    markPostBookmark(postId, false);

    try {
      const result = await togglePostBookmark(postId);
      if (result.bookmarked) {
        markPostBookmark(postId, true);
        await loadPosts(0, false);
      }
    } catch (error: unknown) {
      setBookmarkedPosts((prev) => {
        if (prev.some((p) => p.id === postId)) return prev;
        return [...prev, postToRestore];
      });
      setPostTotalElements((prev) => prev + 1);
      markPostBookmark(postId, true);
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("[BookmarksContent] post bookmark toggle failed", error);
      }
    } finally {
      setPendingPostIds((prev) => prev.filter((id) => id !== postId));
    }
  }, [bookmarkedPosts, isLoggedIn, loadPosts, markPostBookmark, pendingPostIds]);

  const handleToggleRepoBookmark = useCallback(async (repoId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (pendingRepoIds.includes(repoId)) return;

    const repoToRestore = bookmarkedRepos.find((repo) => repo.id === repoId);
    if (!repoToRestore) return;

    setPendingRepoIds((prev) => [...prev, repoId]);
    setBookmarkedRepos((prev) => prev.filter((repo) => repo.id !== repoId));
    setRepoTotalElements((prev) => Math.max(0, prev - 1));
    markRepoBookmark(repoId, false);

    try {
      const result = await toggleGithubBookmark(repoId);
      if (result.bookmarked) {
        markRepoBookmark(repoId, true);
        await loadRepos(0, false);
      }
    } catch (error: unknown) {
      setBookmarkedRepos((prev) => {
        if (prev.some((r) => r.id === repoId)) return prev;
        return [...prev, repoToRestore];
      });
      setRepoTotalElements((prev) => prev + 1);
      markRepoBookmark(repoId, true);
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("[BookmarksContent] repo bookmark toggle failed", error);
      }
    } finally {
      setPendingRepoIds((prev) => prev.filter((id) => id !== repoId));
    }
  }, [bookmarkedRepos, isLoggedIn, loadRepos, markRepoBookmark, pendingRepoIds]);

  const handleLoadMore = async () => {
    if (loadingMore) return;

    if (tab === "posts") {
      if (postPage + 1 >= postTotalPages) return;
      setLoadingMore(true);
      try {
        await loadPosts(postPage + 1, true);
      } finally {
        setLoadingMore(false);
      }
    } else {
      if (repoPage + 1 >= repoTotalPages) return;
      setLoadingMore(true);
      try {
        await loadRepos(repoPage + 1, true);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const activeItems = tab === "posts" ? bookmarkedPosts : bookmarkedRepos;
  const hasMore = tab === "posts" ? postPage + 1 < postTotalPages : repoPage + 1 < repoTotalPages;

  if (!isLoggedIn) {
    return (
      <>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">내 북마크</h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            저장한 게시글과 오픈소스 레포지토리를 보려면 로그인이 필요합니다.
          </p>
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer"
          >
            로그인하기
          </button>
        </div>
        <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">내 북마크</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              저장한 게시글과 GitHub 레포지토리를 한곳에서 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("posts")}
              className={cn(
                TAB_BUTTON_STYLES,
                tab === "posts"
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
              )}
            >
              게시글
              <span className="ml-2 text-xs opacity-70">{postTotalElements}</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("repos")}
              className={cn(
                TAB_BUTTON_STYLES,
                tab === "repos"
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
              )}
            >
              GitHub 레포
              <span className="ml-2 text-xs opacity-70">{repoTotalElements}</span>
            </button>
          </div>
        </div>

        <div className="pt-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              <p>북마크 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
              <button
                type="button"
                onClick={() => {
                  void loadCounts();
                  if (tab === "posts") {
                    void loadPosts(0, false);
                    return;
                  }
                  void loadRepos(0, false);
                }}
                className="mt-3 rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-950/40 cursor-pointer"
              >
                다시 시도
              </button>
            </div>
          ) : activeItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tab === "posts" ? "저장한 게시글이 없습니다." : "저장한 GitHub 레포가 없습니다."}
              </p>
            </div>
          ) : tab === "posts" ? (
            <div className="space-y-4">
              {bookmarkedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  disabled={pendingPostIds.includes(post.id)}
                  onToggleBookmark={handleTogglePostBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {bookmarkedRepos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  isFavorite={true}
                  disabled={pendingRepoIds.includes(repo.id)}
                  onToggleFavorite={(id) => {
                    void handleToggleRepoBookmark(id);
                  }}
                />
              ))}
            </div>
          )}

          {hasMore && !loading && !error && activeItems.length > 0 && (
            <div className="mt-8">
              <LoadMoreButton onClick={handleLoadMore} loading={loadingMore} />
            </div>
          )}
        </div>
      </div>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  );
}

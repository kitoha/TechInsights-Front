"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { LoginModal } from "@/components/auth/LoginModal";
import { FeaturedRepoCard } from "@/components/opensource/FeaturedRepoCard";
import { LoadMoreButton } from "@/components/opensource/LoadMoreButton";
import { RepoCard } from "@/components/opensource/RepoCard";
import { useAuth } from "@/context/AuthContext";
import {
  fetchBookmarkedPosts,
  fetchBookmarkedRepos,
  toggleGithubBookmark,
  togglePostBookmark,
} from "@/lib/bookmarks";
import { adaptGithubRepo } from "@/lib/opensource";
import type { TrendingRepo } from "@/lib/opensource";
import type { Post } from "@/lib/posts";
import { cn } from "@/lib/shared/utils";

type BookmarkTab = "posts" | "repos";

const TAB_BUTTON_STYLES =
  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors";

export function BookmarksContent() {
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState<BookmarkTab>("posts");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [bookmarkedRepos, setBookmarkedRepos] = useState<TrendingRepo[]>([]);
  const [postPage, setPostPage] = useState(0);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [repoPage, setRepoPage] = useState(0);
  const [repoTotalPages, setRepoTotalPages] = useState(1);
  const [pendingPostIds, setPendingPostIds] = useState<string[]>([]);
  const [pendingRepoIds, setPendingRepoIds] = useState<string[]>([]);

  const latestRequestId = useRef(0);

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

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    if (tab === "posts") {
      void loadPosts(0, false);
      return;
    }
    void loadRepos(0, false);
  }, [isLoggedIn, loadPosts, loadRepos, tab]);

  const handleTogglePostBookmark = useCallback(async (postId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (pendingPostIds.includes(postId)) return;

    const previousPosts = bookmarkedPosts;
    setPendingPostIds((prev) => [...prev, postId]);
    setBookmarkedPosts((prev) => prev.filter((post) => post.id !== postId));

    try {
      const result = await togglePostBookmark(postId);
      if (result.bookmarked) {
        await loadPosts(0, false);
      }
    } catch (error: unknown) {
      setBookmarkedPosts(previousPosts);
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("[BookmarksContent] post bookmark toggle failed", error);
      }
    } finally {
      setPendingPostIds((prev) => prev.filter((id) => id !== postId));
    }
  }, [bookmarkedPosts, isLoggedIn, loadPosts, pendingPostIds]);

  const handleToggleRepoBookmark = useCallback(async (repoId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (pendingRepoIds.includes(repoId)) return;

    const previousRepos = bookmarkedRepos;
    setPendingRepoIds((prev) => [...prev, repoId]);
    setBookmarkedRepos((prev) => prev.filter((repo) => repo.id !== repoId));

    try {
      const result = await toggleGithubBookmark(repoId);
      if (result.bookmarked) {
        await loadRepos(0, false);
      }
    } catch (error: unknown) {
      setBookmarkedRepos(previousRepos);
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("[BookmarksContent] repo bookmark toggle failed", error);
      }
    } finally {
      setPendingRepoIds((prev) => prev.filter((id) => id !== repoId));
    }
  }, [bookmarkedRepos, isLoggedIn, loadRepos, pendingRepoIds]);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      if (tab === "posts") {
        if (postPage + 1 >= postTotalPages) return;
        await loadPosts(postPage + 1, true);
        return;
      }
      if (repoPage + 1 >= repoTotalPages) return;
      await loadRepos(repoPage + 1, true);
    } finally {
      setLoadingMore(false);
    }
  };

  const activeItems = tab === "posts" ? bookmarkedPosts : bookmarkedRepos;
  const hasMore = tab === "posts" ? postPage + 1 < postTotalPages : repoPage + 1 < repoTotalPages;
  const featuredRepo = tab === "repos" ? bookmarkedRepos[0] : null;
  const gridRepos = tab === "repos" ? bookmarkedRepos.slice(1) : [];

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
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
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
            </button>
          </div>
        </div>

        <div className="pt-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              북마크 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
                <article
                  key={post.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{post.companyName}</span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString("ko-KR")}</span>
                      </div>
                      <Link href={`/post/${post.id}`} className="block">
                        <h2 className="line-clamp-2 text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400">
                          {post.title}
                        </h2>
                        {post.preview && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                            {post.preview}
                          </p>
                        )}
                      </Link>
                    </div>
                    <button
                      type="button"
                      disabled={pendingPostIds.includes(post.id)}
                      onClick={() => {
                        void handleTogglePostBookmark(post.id);
                      }}
                      className={cn(
                        "shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                        pendingPostIds.includes(post.id)
                          ? "cursor-wait opacity-60"
                          : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                      )}
                    >
                      북마크 해제
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {featuredRepo && (
                <FeaturedRepoCard
                  repo={featuredRepo}
                  isFavorite={true}
                  disabled={pendingRepoIds.includes(featuredRepo.id)}
                  onToggleFavorite={(id) => {
                    void handleToggleRepoBookmark(id);
                  }}
                />
              )}
              {gridRepos.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {gridRepos.map((repo) => (
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

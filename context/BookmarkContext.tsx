"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchAllBookmarkedPostIds, fetchAllBookmarkedRepoIds } from "@/lib/bookmarks";
import { useAuth } from "@/context/AuthContext";

interface BookmarkContextValue {
  bookmarkedPostIds: Set<string>;
  bookmarkedRepoIds: Set<string>;
  isLoading: boolean;
  refreshBookmarks: () => Promise<void>;
  markPostBookmark: (postId: string, bookmarked: boolean) => void;
  markRepoBookmark: (repoId: string, bookmarked: boolean) => void;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(new Set());
  const [bookmarkedRepoIds, setBookmarkedRepoIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const refreshBookmarks = useCallback(async () => {

    if (isAuthLoading) return;

    if (!isLoggedIn) {
      setBookmarkedPostIds(new Set());
      setBookmarkedRepoIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [postIds, repoIds] = await Promise.all([
        fetchAllBookmarkedPostIds(),
        fetchAllBookmarkedRepoIds(),
      ]);
      setBookmarkedPostIds(postIds);
      setBookmarkedRepoIds(repoIds);
    } catch (error) {
      console.error("[BookmarkContext] failed to refresh bookmarks", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    void refreshBookmarks();
  }, [refreshBookmarks]);

  const markPostBookmark = useCallback((postId: string, bookmarked: boolean) => {
    setBookmarkedPostIds((prev) => {
      const next = new Set(prev);
      if (bookmarked) {
        next.add(postId);
      } else {
        next.delete(postId);
      }
      return next;
    });
  }, []);

  const markRepoBookmark = useCallback((repoId: string, bookmarked: boolean) => {
    setBookmarkedRepoIds((prev) => {
      const next = new Set(prev);
      if (bookmarked) {
        next.add(repoId);
      } else {
        next.delete(repoId);
      }
      return next;
    });
  }, []);

  const value = useMemo<BookmarkContextValue>(
    () => ({
      bookmarkedPostIds,
      bookmarkedRepoIds,
      isLoading,
      refreshBookmarks,
      markPostBookmark,
      markRepoBookmark,
    }),
    [bookmarkedPostIds, bookmarkedRepoIds, isLoading, refreshBookmarks, markPostBookmark, markRepoBookmark]
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}

export function useBookmarks(): BookmarkContextValue {
  const ctx = useContext(BookmarkContext);
  if (!ctx) {
    throw new Error("useBookmarks must be used within BookmarkProvider");
  }
  return ctx;
}

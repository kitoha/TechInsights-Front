"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchAllBookmarkedPostIds, fetchAllBookmarkedRepoIds } from "@/lib/bookmarks";
import { useAuth } from "@/context/AuthContext";

interface BookmarkContextValue {
  bookmarkedPostIds: Set<string>;
  bookmarkedRepoIds: Set<string>;
  isLoading: boolean;
  isInitialized: boolean;
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
  const [isInitialized, setIsInitialized] = useState(false);
  
  const requestCounter = useRef(0);

  const refreshBookmarks = useCallback(async () => {
    if (isAuthLoading) return;

    const currentRequest = ++requestCounter.current;

    if (!isLoggedIn) {
      setBookmarkedPostIds(new Set());
      setBookmarkedRepoIds(new Set());
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    setIsLoading(true);
    try {
      const [postIds, repoIds] = await Promise.all([
        fetchAllBookmarkedPostIds(),
        fetchAllBookmarkedRepoIds(),
      ]);

      if (currentRequest === requestCounter.current) {
        setBookmarkedPostIds(postIds);
        setBookmarkedRepoIds(repoIds);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("[BookmarkContext] failed to refresh bookmarks", error);
    } finally {
      if (currentRequest === requestCounter.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthLoading, isLoggedIn]);

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
      isInitialized,
      refreshBookmarks,
      markPostBookmark,
      markRepoBookmark,
    }),
    [bookmarkedPostIds, bookmarkedRepoIds, isLoading, isInitialized, refreshBookmarks, markPostBookmark, markRepoBookmark]
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

import { authGet, authPost } from "@/lib/shared/api";
import type {
  BookmarkedPostsResponse,
  BookmarkedReposResponse,
  BookmarkToggleResponse,
} from "./types";

interface BookmarkListParams {
  page?: number;
  size?: number;
}

const DEFAULT_POST_BOOKMARKS_PAGE_SIZE = 10;
const DEFAULT_REPO_BOOKMARKS_PAGE_SIZE = 20;

function normalizePage(page?: number): number {
  return Math.max(0, Math.floor(Number(page) || 0));
}

function normalizeSize(size: number | undefined, fallback: number): number {
  return Math.max(1, Math.floor(Number(size) || fallback));
}

export async function togglePostBookmark(postId: string): Promise<BookmarkToggleResponse> {
  const res = await authPost<BookmarkToggleResponse>(`/api/v1/posts/${postId}/bookmark`);
  return res.data;
}

export async function toggleGithubBookmark(repoId: string): Promise<BookmarkToggleResponse> {
  const res = await authPost<BookmarkToggleResponse>(`/api/v1/github/${repoId}/bookmark`);
  return res.data;
}

export async function fetchBookmarkedPosts({
  page = 0,
  size = DEFAULT_POST_BOOKMARKS_PAGE_SIZE,
}: BookmarkListParams = {}): Promise<BookmarkedPostsResponse> {
  const res = await authGet<BookmarkedPostsResponse>("/api/v1/posts/me/bookmarks", {
    params: {
      page: normalizePage(page),
      size: normalizeSize(size, DEFAULT_POST_BOOKMARKS_PAGE_SIZE),
    },
  });
  return res.data;
}

export async function fetchBookmarkedRepos({
  page = 0,
  size = DEFAULT_REPO_BOOKMARKS_PAGE_SIZE,
}: BookmarkListParams = {}): Promise<BookmarkedReposResponse> {
  const res = await authGet<BookmarkedReposResponse>("/api/v1/github/me/bookmarks", {
    params: {
      page: normalizePage(page),
      size: normalizeSize(size, DEFAULT_REPO_BOOKMARKS_PAGE_SIZE),
    },
  });
  return res.data;
}

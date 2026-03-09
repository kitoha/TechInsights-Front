import { authGet, authPost } from "@/lib/shared/api";
import type {
  BookmarkedPostsResponse,
  BookmarkedReposResponse,
  BookmarkCountResponse,
  BookmarkToggleResponse,
} from "./types";

interface BookmarkListParams {
  page?: number;
  size?: number;
}

const DEFAULT_POST_BOOKMARKS_PAGE_SIZE = 10;
const DEFAULT_REPO_BOOKMARKS_PAGE_SIZE = 20;
const DEFAULT_BOOKMARK_ID_SYNC_PAGE_SIZE = 100;

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

export async function fetchBookmarkedPostsCount(): Promise<number> {
  const res = await authGet<BookmarkCountResponse>("/api/v1/posts/me/bookmarks/count");
  return Number(res.data?.count ?? 0);
}

export async function fetchBookmarkedReposCount(): Promise<number> {
  const res = await authGet<BookmarkCountResponse>("/api/v1/github/me/bookmarks/count");
  return Number(res.data?.count ?? 0);
}

export async function fetchAllBookmarkedPostIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  let page = 0;
  let totalPages = 1;

  do {
    const result = await fetchBookmarkedPosts({
      page,
      size: DEFAULT_BOOKMARK_ID_SYNC_PAGE_SIZE,
    });
    result.content.forEach((post) => {
      ids.add(post.id);
    });
    totalPages = result.totalPages;
    page += 1;
  } while (page < totalPages);

  return ids;
}

export async function fetchAllBookmarkedRepoIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  let page = 0;
  let totalPages = 1;

  do {
    const result = await fetchBookmarkedRepos({
      page,
      size: DEFAULT_BOOKMARK_ID_SYNC_PAGE_SIZE,
    });
    result.content.forEach((repo) => {
      ids.add(repo.id);
    });
    totalPages = result.totalPages;
    page += 1;
  } while (page < totalPages);

  return ids;
}

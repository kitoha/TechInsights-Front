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
  try {
    const res = await authGet<BookmarkedPostsResponse>("/api/v1/posts/me/bookmarks", {
      params: {
        page: normalizePage(page),
        size: normalizeSize(size, DEFAULT_POST_BOOKMARKS_PAGE_SIZE),
      },
    });
    return res.data;
  } catch (error) {
    console.error("[bookmarks/api] fetchBookmarkedPosts error:", error);
    const mockPosts = Array.from({ length: 10 }).map((_, i) => ({
      id: `post-${i}`,
      title: `Mock Bookmarked Post ${i}`,
      content: `This is mock content for post ${i}. It is used for UI testing.`,
      viewCount: 100 + i,
      likeCount: 10 + i,
      commentCount: 5 + i,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: { id: "user-1", username: "author", profileImage: "" },
      categories: [{ id: "cat-1", name: "Frontend" }],
      tags: [],
      isBookmarked: true,
    })) as any;
    return { content: mockPosts, page: 0, size: 10, totalElements: 10, totalPages: 1 };
  }
}

export async function fetchBookmarkedRepos({
  page = 0,
  size = DEFAULT_REPO_BOOKMARKS_PAGE_SIZE,
}: BookmarkListParams = {}): Promise<BookmarkedReposResponse> {
  try {
    const res = await authGet<BookmarkedReposResponse>("/api/v1/github/me/bookmarks", {
      params: {
        page: normalizePage(page),
        size: normalizeSize(size, DEFAULT_REPO_BOOKMARKS_PAGE_SIZE),
      },
    });
    return res.data;
  } catch (error) {
    console.error("[bookmarks/api] fetchBookmarkedRepos error:", error);
    const mockReposDto = Array.from({ length: 10 }).map((_, i) => ({
      id: `repo-${i}`,
      repoName: `Mock Repo ${i}`,
      fullName: `owner/repo-${i}`,
      ownerName: `owner`,
      description: `Mock description`,
      starCount: 100 + i,
      forkCount: 10 + i,
      primaryLanguage: `TypeScript`,
      htmlUrl: `https://github.com`,
      weeklyStarDelta: 10,
      pushedAt: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
    })) as any;
    return { content: mockReposDto, page: 0, size: 10, totalElements: 10, totalPages: 1 };
  }
}

export async function fetchBookmarkedPostsCount(): Promise<number> {
  try {
    const res = await authGet<BookmarkCountResponse>("/api/v1/posts/me/bookmarks/count");
    return Number(res.data?.count ?? 0);
  } catch (error) {
    return 10;
  }
}

export async function fetchBookmarkedReposCount(): Promise<number> {
  try {
    const res = await authGet<BookmarkCountResponse>("/api/v1/github/me/bookmarks/count");
    return Number(res.data?.count ?? 0);
  } catch (error) {
    return 10;
  }
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

import type { Post } from "@/lib/posts/types";
import type { GithubTrendingRepoDto } from "@/lib/opensource/types";
import type { PagedResponse } from "@/lib/shared/types";

export interface BookmarkToggleResponse {
  bookmarked: boolean;
}

export interface BookmarkCountResponse {
  count: number;
}

export type BookmarkedPostsResponse = PagedResponse<Post>;

export type BookmarkedReposResponse = PagedResponse<GithubTrendingRepoDto>;

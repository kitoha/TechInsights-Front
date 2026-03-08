import { redirect } from "next/navigation";
import { PagedResponse } from "@/lib/shared/types";
import { Post, RecommendedPost } from "@/lib/posts/types";
import { fetchBackendJson, isBackendFetchError } from "@/lib/shared/server-fetch";

export async function fetchPosts(
  page: number = 0,
  category: string = "All"
): Promise<{ content: Post[]; totalPages: number }> {
  try {
    const paramsObj = {
      page,
      size: 10,
      ...(category && category !== "All" ? { category } : {}),
    };

    const data = await fetchBackendJson<PagedResponse<Post>>("/api/v1/posts", {
      params: paramsObj,
      revalidate: 60,
    });

    if (data?.content) {
      return {
        content: data.content,
        totalPages: data.totalPages,
      };
    }

    return { content: [], totalPages: 1 };
  } catch (error: unknown) {
    const status = isBackendFetchError(error) ? error.status : undefined;
    if (status === 503) {
      redirect("/maintenance.html");
    }
    console.error("Posts fetch error:", error);
    return { content: [], totalPages: 1 };
  }
}

export async function fetchPostsByCompany(
  companyId: string,
  page: number = 0
): Promise<{ content: Post[]; totalPages: number }> {
  try {
    const paramsObj = {
      page,
      size: 10,
      companyId,
    };

    const data = await fetchBackendJson<PagedResponse<Post>>("/api/v1/posts", {
      params: paramsObj,
      revalidate: 60,
    });

    if (data?.content) {
      return {
        content: data.content,
        totalPages: data.totalPages,
      };
    }

    return { content: [], totalPages: 1 };
  } catch (error: unknown) {
    const status = isBackendFetchError(error) ? error.status : undefined;
    if (status === 503) {
      redirect("/maintenance.html");
    }
    console.error("Company posts fetch error:", error);
    return { content: [], totalPages: 1 };
  }
}

export async function fetchRecommendedPosts(): Promise<RecommendedPost[]> {
  try {
    const data = await fetchBackendJson<{ postId: string; title: string; logoImageName: string }[]>(
      "/api/v1/recommendations",
      { revalidate: 300 },
    );

    if (Array.isArray(data)) {
      return data.map((item) => ({
        postId: item.postId,
        title: item.title,
        logoImageName: item.logoImageName,
      }));
    }

    return [];
  } catch {
    return [];
  }
}

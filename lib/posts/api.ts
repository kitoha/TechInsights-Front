import { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import { apiGet } from "@/lib/shared/api";
import { PagedResponse } from "@/lib/shared/types";
import { Post, RecommendedPost } from "@/lib/posts/types";

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

    const res = await apiGet<PagedResponse<Post>>("/api/v1/posts", { params: paramsObj });

    if (res?.data?.content) {
      return {
        content: res.data.content,
        totalPages: res.data.totalPages,
      };
    }

    return { content: [], totalPages: 1 };
  } catch (error: unknown) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
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

    const res = await apiGet<PagedResponse<Post>>("/api/v1/posts", { params: paramsObj });

    if (res?.data?.content) {
      return {
        content: res.data.content,
        totalPages: res.data.totalPages,
      };
    }

    return { content: [], totalPages: 1 };
  } catch (error: unknown) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 503) {
      redirect("/maintenance.html");
    }
    console.error("Company posts fetch error:", error);
    return { content: [], totalPages: 1 };
  }
}

export async function fetchRecommendedPosts(): Promise<RecommendedPost[]> {
  try {
    const res = await apiGet<{ postId: string; title: string; logoImageName: string }[]>("/api/v1/recommendations");

    if (Array.isArray(res?.data)) {
      return res.data.map((item) => ({
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

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`;
    const paramsObj = {
      page,
      size: 10,
      ...(category && category !== "All" ? { category } : {}),
    };

    const res = await apiGet<PagedResponse<Post>>(url, { params: paramsObj });

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`;
    const paramsObj = {
      page,
      size: 10,
      companyId,
    };

    const res = await apiGet<PagedResponse<Post>>(url, { params: paramsObj });

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/recommendations`;
    const res = await apiGet<{ postId: string; title: string; logoImageName: string }[]>(url);

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

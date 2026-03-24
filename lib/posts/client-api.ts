import { apiGet, apiPost } from "@/lib/shared/api";

export async function fetchPostLikeStatus(postId: string): Promise<{ count: number; liked: boolean }> {
  const res = await apiGet<{ count: number; liked: boolean }>(`/api/v1/posts/${postId}/like`);
  return res.data;
}

export async function togglePostLike(postId: string): Promise<{ liked: boolean }> {
  const res = await apiPost<{ liked: boolean }>(`/api/v1/posts/${postId}/like`);
  return res.data;
}

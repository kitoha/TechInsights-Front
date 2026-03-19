import { fetchBackendJson } from "@/lib/shared/server-fetch";

export interface CategorySummary {
  category: string;
  postCount: number;
  totalViewCount: number;
  latestPostDate: string;
}

export interface TopicLink {
  name: string;
  href: string;
}

export async function fetchTopics(): Promise<TopicLink[]> {
  try {
    const data = await fetchBackendJson<CategorySummary[]>(
      "/api/v1/categories/summary",
      { revalidate: 300 },
    );

    if (!Array.isArray(data)) return [];

    return data
      .filter((c) => c.category.toLowerCase() !== "all")
      .map((c) => ({
        name: c.category,
        href: `/?category=${c.category}`,
      }));
  } catch {
    return [];
  }
}

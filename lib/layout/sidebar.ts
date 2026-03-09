import { fetchCompanies, fetchTrendingCompanies } from "@/lib/companies";
import { fetchRecommendedPosts } from "@/lib/posts";
import type { Company, TrendingPost } from "@/lib/companies";
import type { RecommendedPost } from "@/lib/posts";

export interface SidebarData {
  trendingPosts: TrendingPost[];
  companies: Company[];
  recommendedPosts: RecommendedPost[];
}

export async function fetchSidebarData(): Promise<SidebarData> {
  const [trendingPosts, companies, recommendedPosts] = await Promise.all([
    fetchTrendingCompanies(),
    fetchCompanies(),
    fetchRecommendedPosts(),
  ]);

  return {
    trendingPosts,
    companies,
    recommendedPosts,
  };
}

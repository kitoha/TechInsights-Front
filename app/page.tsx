import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { RankingItem } from "@/components/RankingItem";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import TopCompaniesByPosts from "@/components/TopCompaniesByPosts";
import PostListFade from "@/components/PostListFade";
import AIRecommendedPosts from "@/components/AIRecommendedPosts";
import { Header } from "@/components/Header";
import { apiGet } from "@/lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import SidebarListCard from "@/components/SidebarListCard";

export default async function HomePage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const categories = ["All", "FrontEnd", "BackEnd", "AI", "Big Data", "Infra", "Architecture"];
  const selectedCategory = params?.category || "All";

  let data = { content: [], totalPages: 1 };
  try {
    const apiParams: any = {
      page,
      size: 10,
    };
    if (selectedCategory && selectedCategory !== "All") {
      apiParams.category = selectedCategory;
    }

    const res = await apiGet(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`, {
      params: apiParams
    });
    data = res.data;
  } catch (error) {
    console.error('Posts fetch error:', error);
  }

  const latestPosts = (data.content || []).map((item: any) => ({
    id: item.id,
    companyName: item.companyName || "기타",
    title: item.title,
    description: item.preview?.replace(/<[^>]+>/g, ''),
    image: item.thumbnail || "/placeholder.svg?height=120&width=120",
    url: item.url,
    publishedAt: item.publishedAt,
    logoImageName: item.logoImageName,
    categories: item.categories || [],
  }))

  
  let trendingCompanies = [];
  try {
    const companiesRes = await apiGet(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/top-by-views`, {
      params: {
        page: 0,
        size: 5
      }
    });
    trendingCompanies = companiesRes.data.content || [];
  } catch (error) {
    console.error('Companies fetch error:', error);
  }

  const trendingPosts = trendingCompanies.map((company: any) => ({
    logoImage: `/logos/${company.logoImageName}`,
    title: company.name.length > 20 ? `${company.name.slice(0, 20)}...` : company.name,
    viewCount: company.totalViewCount
  }))

  let companies = [];
  try {
    const companiesRes = await apiGet(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies`, {
      params: {
        page: 0,
        size: 15
      }
    });
    companies = (companiesRes.data.content || []).map((company: any) => ({
      name: company.name,
      logoImage: `/logos/${company.logoImageName}`
    }));
  } catch (error) {
    console.error('Companies fetch error:', error);
  }

  const totalPages = data.totalPages || 1;
  const maxVisible = 5;
  let start = Math.max(0, page - 2);
  let end = Math.min(totalPages, start + maxVisible);
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }
  const pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);

  let recommendedPosts = [];
  try {
    const res = await apiGet("/api/v1/recommendations");
    const colorSets = [
      { color: "bg-gradient-to-br from-blue-50 to-blue-100", borderColor: "border-blue-200" },
      { color: "bg-gradient-to-br from-yellow-50 to-yellow-100", borderColor: "border-yellow-200" },
      { color: "bg-gradient-to-br from-green-50 to-green-100", borderColor: "border-green-200" },
      { color: "bg-gradient-to-br from-gray-50 to-gray-100", borderColor: "border-gray-200" },
      { color: "bg-gradient-to-br from-emerald-50 to-emerald-100", borderColor: "border-emerald-200" },
    ];
    recommendedPosts = res.data.map((item: any, idx: number) => {
      const colorIdx = idx % colorSets.length;
      return {
        title: item.title,
        logo: `/logos/${item.logoImageName}`,
        color: colorSets[colorIdx].color,
        borderColor: colorSets[colorIdx].borderColor,
      };
    });
  } catch (e) {
    recommendedPosts = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for posts, topics, or companies"
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 h-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Category Tabs + Post List (SSR) */}
            <PostListFade
              posts={latestPosts}
              totalPages={totalPages}
              page={page}
              selectedCategory={selectedCategory}
              categories={categories}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI 추천 게시물 */}
            <AIRecommendedPosts posts={recommendedPosts} />
            {/* 게시물 조회 수 랭킹 */}
            <SidebarListCard
              title="게시물 조회 수 랭킹"
              items={trendingPosts}
              itemRender={(post, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={post.logoImage} alt="logo" width={36} height={36} className="object-cover w-full h-full rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                        {post.title}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold ml-2">{post.viewCount}</span>
                  </div>
                </div>
              )}
            />
            {/* Featured Companies */}
            <SidebarListCard
              title="기술 블로그 기업 리스트"
              items={companies}
              itemRender={(company, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={company.logoImage} alt="logo" width={36} height={36} className="object-cover w-full h-full rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                        {company.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            />
            {/* Top Companies by Posts */}
            <SidebarListCard
              title="기술 블로그 TOP 15"
              items={companies}
              itemRender={(company, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={company.logoImage} alt="logo" width={36} height={36} className="object-cover w-full h-full rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                        {company.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

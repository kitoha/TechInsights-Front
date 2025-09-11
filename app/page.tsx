import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import PostListFade from "@/components/PostListFade";
import AIRecommendedPosts from "@/components/AIRecommendedPosts";
import { Header } from "@/components/Header";
import { apiGet } from "@/lib/api";
import SidebarListCard from "@/components/SidebarListCard";
import Image from "next/image";

export interface Post {
  id: string;
  companyName: string;
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt: string;
  logoImageName?: string;
  categories?: string[];
  // 아래는 API 응답에 따라 optional로 추가
  preview?: string;
  thumbnail?: string;
}

export interface Company {
  name: string;
  logoImage: string;
}

export interface TrendingPost {
  logoImage: string;
  title: string;
  viewCount: number;
}

export interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const categories = ["All", "FrontEnd", "BackEnd", "AI", "Big Data", "Infra", "Architecture"];
  const selectedCategory = params?.category || "All";

  let data: { content: Post[]; totalPages: number } = { content: [], totalPages: 1 };
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`;
    const paramsObj = {
      page,
      size: 10,
      ...(selectedCategory && selectedCategory !== "All" ? { category: selectedCategory } : {})
    };
    const res = await apiGet<ApiResponse<Post>>(url, {
      params: paramsObj
    });

    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data) {
      data = {
        content: res.data.content,
        totalPages: res.data.totalPages
      };
    }
  } catch (error) {
    console.error('Posts fetch error:', error);
  }

  const latestPosts: Post[] = (data.content || []).map((item) => ({
    id: item.id,
    companyName: item.companyName || "기타",
    title: item.title,
    description: item.description || item.preview?.replace(/<[^>]+>/g, '') || '',
    image: item.image || item.thumbnail || "/placeholder.svg?height=120&width=120",
    url: item.url,
    publishedAt: item.publishedAt,
    logoImageName: item.logoImageName,
    categories: item.categories || [],
    preview: item.preview,
    thumbnail: item.thumbnail,
  }));

  let trendingCompanies: TrendingPost[] = [];
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/top-by-views`;
    const paramsObj = { page: 0, size: 5 };
    const res = await apiGet<ApiResponse<{logoImageName: string; name: string; totalViewCount: number}>>(url, {
      params: paramsObj
    });
    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data && Array.isArray(res.data.content)) {
      trendingCompanies = res.data.content.map((company): TrendingPost => ({
        logoImage: `/logos/${company.logoImageName}`,
        title: typeof company.name === 'string' ? (company.name.length > 20 ? `${company.name.slice(0, 20)}...` : company.name) : '',
        viewCount: company.totalViewCount ?? 0
      }));
    }
  } catch (error) {
    console.error('Companies fetch error:', error);
  }

  const trendingPosts = trendingCompanies;

  let companies: Company[] = [];
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies`;
    const paramsObj = { page: 0, size: 15 };
    const res = await apiGet<ApiResponse<{name: string; logoImageName: string}>>(url, {
      params: paramsObj
    });
    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data && Array.isArray(res.data.content)) {
      companies = res.data.content.map((company): Company => ({
        name: company.name,
        logoImage: `/logos/${company.logoImageName}`
      }));
    }
  } catch (error) {
    console.error('Companies fetch error:', error);
  }

  const totalPages = data.totalPages || 1;
  const maxVisible = 5;
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages, start + maxVisible);

  let recommendedPosts: Array<{ title: string; logo: string; color: string; borderColor: string }> = [];
  try {
    const url = `/api/v1/recommendations`;
    const res = await apiGet<{title: string; logoImageName: string}[]>(url);
    const colorSets = [
      { color: "bg-gradient-to-br from-blue-50 to-blue-100", borderColor: "border-blue-200" },
      { color: "bg-gradient-to-br from-yellow-50 to-yellow-100", borderColor: "border-yellow-200" },
      { color: "bg-gradient-to-br from-green-50 to-green-100", borderColor: "border-green-200" },
      { color: "bg-gradient-to-br from-gray-50 to-gray-100", borderColor: "border-gray-200" },
      { color: "bg-gradient-to-br from-emerald-50 to-emerald-100", borderColor: "border-emerald-200" },
    ];

    if (res && typeof res === 'object' && 'data' in res && res.data && Array.isArray(res.data)) {
      recommendedPosts = res.data.map((item, idx: number) => {
        const colorIdx = idx % colorSets.length;
        return {
          title: item.title,
          logo: `/logos/${item.logoImageName}`,
          color: colorSets[colorIdx].color,
          borderColor: colorSets[colorIdx].borderColor,
        };
      });
    }
  } catch {
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
              itemRender={(post: TrendingPost, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image src={post.logoImage} alt="logo" width={36} height={36} className="object-cover w-full h-full rounded-lg" />
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
              itemRender={(company: Company, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image src={company.logoImage} alt="logo" width={36} height={36} className="object-cover w-full h-full rounded-lg" />
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
              itemRender={(company: Company, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image src={company.logoImage} alt="logo" width={36} height={36} className="object-cover w-full h-full rounded-lg" />
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

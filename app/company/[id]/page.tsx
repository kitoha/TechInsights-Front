import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/Sidebar";
import { 
  fetchPostsByCompany,
  fetchCompanyInfo,
  fetchTrendingCompanies, 
  fetchCompanies, 
  fetchRecommendedPosts
} from "@/lib/dataFetchers";
import { Post } from "@/lib/types";
import { notFound } from "next/navigation";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CompanyPage({ params, searchParams }: CompanyPageProps) {
  const { id: companyId } = await params;
  const searchParamsData = await searchParams;
  const page = Number(searchParamsData?.page) || 0;
  
  const [postsData, trendingCompanies, companies, recommendedPosts, companyInfo] = await Promise.all([
    fetchPostsByCompany(companyId, page),
    fetchTrendingCompanies(),
    fetchCompanies(),
    fetchRecommendedPosts(),
    fetchCompanyInfo(companyId)
  ]);

  // 회사 정보가 없으면 404 페이지로 리다이렉트
  if (!companyInfo) {
    notFound();
  }

  const latestPosts: Post[] = (postsData.content || []).map((item) => ({
    id: item.id,
    companyName: item.companyName || "기타",
    title: item.title,
    description: item.description || item.preview?.replace(/<[^>]+>/g, '') || '',
    image: item.image || item.thumbnail || "/placeholder.svg",
    url: item.url,
    publishedAt: item.publishedAt,
    logoImageName: item.logoImageName,
    categories: item.categories || [],
    preview: item.preview,
    thumbnail: item.thumbnail,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <MainContent
            posts={latestPosts}
            totalPages={postsData.totalPages}
            page={page}
            selectedCategory="All"
            categories={["All"]}
            companyId={companyId}
            companyInfo={companyInfo}
          />
          {/* Sidebar */}
          <Sidebar
            trendingPosts={trendingCompanies}
            companies={companies}
            recommendedPosts={recommendedPosts}
          />
        </div>
      </div>
    </div>
  );
}

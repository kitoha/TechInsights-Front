import { MainContent } from "@/components/post/MainContent";
import { Sidebar } from "@/components/layout/Sidebar";
import { 
  fetchPostsByCompany,
} from "@/lib/posts";
import { fetchCompanyInfo } from "@/lib/companies";
import { fetchSidebarData } from "@/lib/layout/sidebar";
import { Post } from "@/lib/posts";
import { notFound } from "next/navigation";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CompanyPage({ params, searchParams }: CompanyPageProps) {
  const { id: companyId } = await params;
  const searchParamsData = await searchParams;
  const page = Number(searchParamsData?.page) || 0;
  
  const [postsData, sidebarData, companyInfo] = await Promise.all([
    fetchPostsByCompany(companyId, page),
    fetchSidebarData(),
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
    image: item.image || item.thumbnail,
    url: item.url,
    publishedAt: item.publishedAt,
    logoImageName: item.logoImageName,
    categories: item.categories || [],
    preview: item.preview,
    thumbnail: item.thumbnail,
  }));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <MainContent
            posts={latestPosts}
            totalPages={postsData.totalPages}
            page={page}
            selectedCategory="All"
            categories={[]}
            companyId={companyId}
            companyInfo={companyInfo}
          />
          {/* Sidebar */}
          <Sidebar
            trendingPosts={sidebarData.trendingPosts}
            companies={sidebarData.companies}
            recommendedPosts={sidebarData.recommendedPosts}
          />
        </div>
      </div>
    </div>
  );
}

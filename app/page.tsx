import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { Sidebar } from "@/components/Sidebar";
import { 
  fetchPosts, 
  fetchTrendingCompanies, 
  fetchCompanies, 
  fetchRecommendedPosts
} from "@/lib/dataFetchers";
import { Post } from "@/lib/types";

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const categories = ["FrontEnd", "BackEnd", "AI", "Big Data", "Infra", "Architecture"];
  const selectedCategory = params?.category || "All";
  
  const [postsData, trendingCompanies, companies, recommendedPosts] = await Promise.all([
    fetchPosts(page, selectedCategory),
    fetchTrendingCompanies(),
    fetchCompanies(),
    fetchRecommendedPosts()
  ]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <MainContent
            posts={latestPosts}
            totalPages={postsData.totalPages}
            page={page}
            selectedCategory={selectedCategory}
            categories={categories}
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
  )
}

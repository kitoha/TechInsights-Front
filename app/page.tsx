import { MainContent } from "@/components/post/MainContent";
import { Sidebar } from "@/components/layout/Sidebar";
import { fetchPosts } from "@/lib/posts";
import { fetchSidebarData } from "@/lib/layout/sidebar";
import { Post } from "@/lib/posts";

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const categories = ["FrontEnd", "BackEnd", "AI", "Big Data", "Infra", "Architecture"];
  const selectedCategory = params?.category || "All";

  const [postsData, sidebarData] = await Promise.all([
    fetchPosts(page, selectedCategory),
    fetchSidebarData(),
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
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
            trendingPosts={sidebarData.trendingPosts}
            companies={sidebarData.companies}
            recommendedPosts={sidebarData.recommendedPosts}
          />
        </div>
      </div>
    </div>
  )
}

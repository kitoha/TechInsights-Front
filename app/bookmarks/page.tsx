import { Sidebar } from "@/components/layout/Sidebar";
import { BookmarksContent } from "./BookmarksContent";
import { fetchSidebarData } from "@/lib/layout/sidebar";

export default async function BookmarksPage() {
  const sidebarData = await fetchSidebarData();

  return (
    <div className="bg-background min-h-full">
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <BookmarksContent />
          </div>
          <Sidebar
            trendingPosts={sidebarData.trendingPosts}
            companies={sidebarData.companies}
            recommendedPosts={sidebarData.recommendedPosts}
          />
        </div>
      </main>
    </div>
  );
}

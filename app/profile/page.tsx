import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileContent } from "./ProfileContent";
import { fetchSidebarData } from "@/lib/layout/sidebar";

export default async function ProfilePage() {
  const sidebarData = await fetchSidebarData();

  return (
    <div className="bg-background min-h-full">
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <ProfileContent />
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

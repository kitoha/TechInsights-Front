import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProfileContent } from "./ProfileContent";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <ProfileContent />
          </div>
          <Sidebar trendingPosts={[]} companies={[]} recommendedPosts={[]} />
        </div>
      </main>
    </div>
  );
}

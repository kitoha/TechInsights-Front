import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProfileContent } from "./ProfileContent";

export default function ProfilePage() {
  return (
    <div className="bg-background min-h-full">
      <main className="max-w-[1600px] mx-auto px-6 py-8">
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

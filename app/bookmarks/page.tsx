import { Sidebar } from "@/components/layout/Sidebar";
import { BookmarksContent } from "./BookmarksContent";

export default function BookmarksPage() {
  return (
    <div className="bg-background min-h-full">
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <BookmarksContent />
          </div>
          <Sidebar trendingPosts={[]} companies={[]} recommendedPosts={[]} />
        </div>
      </main>
    </div>
  );
}

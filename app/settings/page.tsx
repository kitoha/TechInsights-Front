import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <h1 className="text-xl font-semibold text-foreground mb-4">Settings</h1>
              <p className="text-muted-foreground">설정 페이지입니다.</p>
            </div>
          </div>
          <Sidebar trendingPosts={[]} companies={[]} recommendedPosts={[]} />
        </div>
      </main>
    </div>
  );
}

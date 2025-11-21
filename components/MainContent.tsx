import PostListFade from "./PostListFade";
import SearchBar from "./SearchBar";
import { Post } from "@/lib/types";
import { OptimizedImage } from "@/components/OptimizedImage";

interface MainContentProps {
  posts: Post[];
  totalPages: number;
  page: number;
  selectedCategory: string;
  categories: string[];
  companyId?: string;
  companyInfo?: { name: string; logoImageName: string } | null;
}

export function MainContent({ posts, totalPages, page, selectedCategory, categories, companyId, companyInfo }: MainContentProps) {
  return (
    <div className="lg:col-span-3">
      {/* Search Bar */}
      <SearchBar className="mb-6" />
      
      {/* Company Header */}
      {companyId && companyInfo && (
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
              <OptimizedImage
                src={`/logos/${companyInfo.logoImageName}`}
                alt={companyInfo.name}
                width={48}
                height={48}
                className="w-full h-full object-cover rounded-lg"
                fallbackSrc="/placeholder.svg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {companyInfo.name} 게시글
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {companyInfo.name}에서 작성한 기술 블로그 게시글들을 확인해보세요
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Category Tabs + Post List (SSR) */}
      <PostListFade
        posts={posts}
        totalPages={totalPages}
        page={page}
        selectedCategory={selectedCategory}
        categories={categories}
        companyId={companyId}
      />
    </div>
  );
}

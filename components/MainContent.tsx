import PostListFade from "./PostListFade";
import SearchBar from "./SearchBar";
import { Post } from "@/lib/types";

interface MainContentProps {
  posts: Post[];
  totalPages: number;
  page: number;
  selectedCategory: string;
  categories: string[];
}

export function MainContent({ posts, totalPages, page, selectedCategory, categories }: MainContentProps) {
  return (
    <div className="lg:col-span-3">
      {/* Search Bar */}
      <SearchBar className="mb-6" />
      {/* Category Tabs + Post List (SSR) */}
      <PostListFade
        posts={posts}
        totalPages={totalPages}
        page={page}
        selectedCategory={selectedCategory}
        categories={categories}
      />
    </div>
  );
}

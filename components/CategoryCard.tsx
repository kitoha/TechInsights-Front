import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export interface CategoryStats {
  id: string;
  name: string;
  postCount: number;
  totalViews: number;
  latestPost: string;
  logoImage: string;
}

interface CategoryCardProps {
  category: CategoryStats;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getCategoryUrl = (categoryName: string) => {
    return `/?category=${encodeURIComponent(categoryName)}&page=0`;
  };

  return (
    <Link href={getCategoryUrl(category.name)} className="block">
      <Card className="p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-200">
          <Image 
            src={category.logoImage} 
            alt={`${category.name} logo`} 
            width={48} 
            height={48} 
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {category.name}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">📄</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">게시글 수</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {category.postCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">📊</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">총 조회 수</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatViews(category.totalViews)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">🕐</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">최근 게시글</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {category.latestPost}
          </span>
        </div>
      </div>
      </Card>
    </Link>
  );
}

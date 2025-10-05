import { Card } from "@/components/ui/card";

export interface CategoryStats {
  id: string;
  name: string;
  postCount: number;
  totalViews: number;
  latestPost: string;
  color: string;
  icon: string;
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

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${category.color}`}
        >
          {category.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
  );
}

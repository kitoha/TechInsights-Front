import { isAxiosError } from "axios";
import { Header } from "@/components/Header";
import { CategoryCard, CategoryStats } from "@/components/CategoryCard";
import { apiGet } from "@/lib/api";
import { redirect } from "next/navigation";

export interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export default async function CategoriesPage() {
  let categories: CategoryStats[] = [];

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/stats`;
    const paramsObj = { page: 0, size: 10 };
    const res = await apiGet<ApiResponse<{
      name: string;
      postCount: number;
      totalViewCount: number;
      latestPostAt: string;
    }>>(url, {
      params: paramsObj
    });

    if (res && typeof res === 'object' && 'data' in res && res.data && 'content' in res.data) {
      categories = res.data.content.map((category): CategoryStats => ({
        id: category.name.toLowerCase(),
        name: category.name,
        postCount: category.postCount,
        totalViews: category.totalViewCount,
        latestPost: formatTimeAgo(category.latestPostAt),
        color: getCategoryColor(category.name),
        icon: getCategoryIcon(category.name)
      }));
    }
  } catch (error: unknown) {
    const status: number | undefined = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 503) {
      redirect('/maintenance.html');
    }
    console.error('Categories stats fetch error:', error);
    
    // Fallback data for development
    categories = [
      {
        id: "all",
        name: "All",
        postCount: 1245,
        totalViews: 15600000,
        latestPost: "1시간 전",
        color: "bg-gradient-to-br from-gray-500 to-gray-600",
        icon: "A"
      },
      {
        id: "frontend",
        name: "FrontEnd",
        postCount: 342,
        totalViews: 4200000,
        latestPost: "2시간 전",
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        icon: "F"
      },
      {
        id: "backend",
        name: "BackEnd",
        postCount: 456,
        totalViews: 5800000,
        latestPost: "30분 전",
        color: "bg-gradient-to-br from-green-500 to-green-600",
        icon: "B"
      },
      {
        id: "ai",
        name: "AI",
        postCount: 234,
        totalViews: 3200000,
        latestPost: "3시간 전",
        color: "bg-gradient-to-br from-purple-500 to-purple-600",
        icon: "AI"
      },
      {
        id: "bigdata",
        name: "Big Data",
        postCount: 189,
        totalViews: 2100000,
        latestPost: "5시간 전",
        color: "bg-gradient-to-br from-orange-500 to-orange-600",
        icon: "BD"
      },
      {
        id: "infra",
        name: "Infra",
        postCount: 298,
        totalViews: 3800000,
        latestPost: "1일 전",
        color: "bg-gradient-to-br from-red-500 to-red-600",
        icon: "I"
      },
      {
        id: "architecture",
        name: "Architecture",
        postCount: 167,
        totalViews: 1900000,
        latestPost: "2일 전",
        color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        icon: "AR"
      }
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            카테고리별 포스트 현황
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            각 카테고리별 기술 블로그 포스트 현황을 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays}일 전`;
  } else if (diffInHours > 0) {
    return `${diffInHours}시간 전`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}분 전`;
  } else {
    return "방금 전";
  }
}

function getCategoryColor(categoryName: string): string {
  const colorMap: { [key: string]: string } = {
    "All": "bg-gradient-to-br from-gray-500 to-gray-600",
    "FrontEnd": "bg-gradient-to-br from-blue-500 to-blue-600",
    "BackEnd": "bg-gradient-to-br from-green-500 to-green-600",
    "AI": "bg-gradient-to-br from-purple-500 to-purple-600",
    "Big Data": "bg-gradient-to-br from-orange-500 to-orange-600",
    "Infra": "bg-gradient-to-br from-red-500 to-red-600",
    "Architecture": "bg-gradient-to-br from-indigo-500 to-indigo-600"
  };
  return colorMap[categoryName] || "bg-gradient-to-br from-gray-500 to-gray-600";
}

function getCategoryIcon(categoryName: string): string {
  const iconMap: { [key: string]: string } = {
    "All": "A",
    "FrontEnd": "F",
    "BackEnd": "B",
    "AI": "AI",
    "Big Data": "BD",
    "Infra": "I",
    "Architecture": "AR"
  };
  return iconMap[categoryName] || "?";
}

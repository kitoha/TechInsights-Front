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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/summary`;
    const res = await apiGet<{
      category: string;
      postCount: number;
      totalViewCount: number;
      latestPostDate: string;
    }[]>(url);

    if (res && typeof res === 'object' && 'data' in res && res.data && Array.isArray(res.data)) {
      categories = res.data
        .filter(category => category.category.toLowerCase() !== 'all')
        .map((category): CategoryStats => ({
        id: category.category.toLowerCase(),
        name: category.category,
        postCount: category.postCount,
        totalViews: category.totalViewCount,
        latestPost: formatTimeAgo(category.latestPostDate),
        logoImage: `/categories/${category.category.toLowerCase()}.svg`
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
        id: "frontend",
        name: "FrontEnd",
        postCount: 26,
        totalViews: 2,
        latestPost: "2022년 9월",
        logoImage: "/categories/frontend.svg"
      },
      {
        id: "backend",
        name: "BackEnd",
        postCount: 54,
        totalViews: 4,
        latestPost: "2022년 9월",
        logoImage: "/categories/backend.svg"
      },
      {
        id: "ai",
        name: "AI",
        postCount: 3,
        totalViews: 1,
        latestPost: "2022년 2월",
        logoImage: "/categories/ai.svg"
      },
      {
        id: "bigdata",
        name: "BigData",
        postCount: 10,
        totalViews: 2,
        latestPost: "2022년 8월",
        logoImage: "/categories/bigdata.svg"
      },
      {
        id: "infra",
        name: "Infra",
        postCount: 31,
        totalViews: 5,
        latestPost: "2022년 8월",
        logoImage: "/categories/infra.svg"
      },
      {
        id: "architecture",
        name: "Architecture",
        postCount: 59,
        totalViews: 6,
        latestPost: "2022년 9월",
        logoImage: "/categories/architecture.svg"
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


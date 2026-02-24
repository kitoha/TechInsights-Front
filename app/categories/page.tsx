import { isAxiosError } from "axios";
import {
  CategoryStats,
  CompactCategoryCard,
  TopCategoryCard,
} from "@/components/category/CategoryCard";
import { apiGet } from "@/lib/shared/api";
import { redirect } from "next/navigation";

export interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface CategorySummaryResponse {
  category: string;
  postCount: number;
  totalViewCount: number;
  latestPostDate: string;
}

export default async function CategoriesPage() {
  let categories: CategoryStats[] = [];

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/summary`;
    const res = await apiGet<CategorySummaryResponse[]>(url);

    if (res && typeof res === "object" && "data" in res && res.data && Array.isArray(res.data)) {
      categories = res.data
        .filter((category) => category.category.toLowerCase() !== "all")
        .map(
          (category): CategoryStats => ({
            id: category.category.toLowerCase(),
            name: category.category,
            postCount: category.postCount,
            totalViews: category.totalViewCount,
            latestPost: formatTimeAgo(category.latestPostDate),
            latestPostDate: category.latestPostDate,
            logoImage: `/categories/${category.category.toLowerCase()}.svg`,
          }),
        );
    }
  } catch (error: unknown) {
    const status: number | undefined = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 503) {
      redirect("/maintenance.html");
    }
    console.error("Categories stats fetch error:", error);

    categories = [
      {
        id: "frontend",
        name: "FrontEnd",
        postCount: 37,
        totalViews: 6,
        latestPost: "51일 전",
        latestPostDate: "2025-01-02T16:39:15",
        logoImage: "/categories/frontend.svg",
      },
      {
        id: "backend",
        name: "BackEnd",
        postCount: 115,
        totalViews: 13,
        latestPost: "60일 전",
        latestPostDate: "2024-12-24T10:00:00",
        logoImage: "/categories/backend.svg",
      },
      {
        id: "ai",
        name: "AI",
        postCount: 15,
        totalViews: 8,
        latestPost: "58일 전",
        latestPostDate: "2024-12-26T10:00:00",
        logoImage: "/categories/ai.svg",
      },
      {
        id: "bigdata",
        name: "BigData",
        postCount: 21,
        totalViews: 9,
        latestPost: "58일 전",
        latestPostDate: "2024-12-26T10:00:00",
        logoImage: "/categories/bigdata.svg",
      },
      {
        id: "infra",
        name: "Infra",
        postCount: 82,
        totalViews: 6,
        latestPost: "60일 전",
        latestPostDate: "2024-12-24T00:00:00",
        logoImage: "/categories/infra.svg",
      },
      {
        id: "architecture",
        name: "Architecture",
        postCount: 90,
        totalViews: 15,
        latestPost: "51일 전",
        latestPostDate: "2025-01-02T16:39:15",
        logoImage: "/categories/architecture.svg",
      },
    ];
  }

  const sortedCategories = [...categories].sort((a, b) => {
    if (b.totalViews !== a.totalViews) {
      return b.totalViews - a.totalViews;
    }

    if (b.postCount !== a.postCount) {
      return b.postCount - a.postCount;
    }

    const bDate = new Date(b.latestPostDate).getTime();
    const aDate = new Date(a.latestPostDate).getTime();
    return bDate - aDate;
  });

  const topCategories = sortedCategories.slice(0, 3);
  const otherCategories = sortedCategories.slice(3);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <section>
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Most Active Categories</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              조회수, 게시글 수, 최신 활동 순으로 카테고리를 정렬했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {topCategories.map((category, idx) => (
              <TopCategoryCard key={category.id} category={category} rank={(idx + 1) as 1 | 2 | 3} />
            ))}
          </div>
        </section>

        {otherCategories.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Other Active Categories
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {otherCategories.map((category) => (
                <CompactCategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays}일 전`;
  }

  if (diffInHours > 0) {
    return `${diffInHours}시간 전`;
  }

  if (diffInMinutes > 0) {
    return `${diffInMinutes}분 전`;
  }

  return "방금 전";
}

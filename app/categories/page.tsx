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
            latestPost: formatDate(category.latestPostDate),
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
        latestPost: formatDate("2025-01-02T16:39:15"),
        latestPostDate: "2025-01-02T16:39:15",
        logoImage: "/categories/frontend.svg",
      },
      {
        id: "backend",
        name: "BackEnd",
        postCount: 115,
        totalViews: 13,
        latestPost: formatDate("2024-12-24T10:00:00"),
        latestPostDate: "2024-12-24T10:00:00",
        logoImage: "/categories/backend.svg",
      },
      {
        id: "ai",
        name: "AI",
        postCount: 15,
        totalViews: 8,
        latestPost: formatDate("2024-12-26T10:00:00"),
        latestPostDate: "2024-12-26T10:00:00",
        logoImage: "/categories/ai.svg",
      },
      {
        id: "bigdata",
        name: "BigData",
        postCount: 21,
        totalViews: 9,
        latestPost: formatDate("2024-12-26T10:00:00"),
        latestPostDate: "2024-12-26T10:00:00",
        logoImage: "/categories/bigdata.svg",
      },
      {
        id: "infra",
        name: "Infra",
        postCount: 82,
        totalViews: 6,
        latestPost: formatDate("2024-12-24T00:00:00"),
        latestPostDate: "2024-12-24T00:00:00",
        logoImage: "/categories/infra.svg",
      },
      {
        id: "architecture",
        name: "Architecture",
        postCount: 90,
        totalViews: 15,
        latestPost: formatDate("2025-01-02T16:39:15"),
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
    if (bDate !== aDate) {
      return bDate - aDate;
    }

    return a.name.localeCompare(b.name);
  });

  const topCategories = sortedCategories.slice(0, 3);
  const otherCategories = sortedCategories.slice(3);
  const totalPosts = sortedCategories.reduce((sum, category) => sum + category.postCount, 0);
  const totalViews = sortedCategories.reduce((sum, category) => sum + category.totalViews, 0);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        <section>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Most Active Categories</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                조회수, 게시글 수, 최신 활동 순으로 카테고리를 정렬했습니다.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 self-start text-xs sm:gap-3 sm:text-sm">
              <SummaryChip label="Categories" value={sortedCategories.length.toLocaleString()} />
              <SummaryChip label="Total Posts" value={totalPosts.toLocaleString()} />
              <SummaryChip label="Total Views" value={totalViews.toLocaleString()} />
            </div>
          </div>

          {topCategories.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {topCategories.map((category, idx) => (
                <TopCategoryCard key={category.id} category={category} rank={(idx + 1) as 1 | 2 | 3} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-400">
              표시할 카테고리 데이터가 없습니다.
            </div>
          )}
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

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[92px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-right dark:border-gray-700 dark:bg-gray-900">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">{label}</p>
      <p className="mt-1 font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

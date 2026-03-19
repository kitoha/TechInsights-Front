import {
  CategoryStats,
  CompactCategoryCard,
  TopCategoryCard,
} from "@/components/category/CategoryCard";
import { CATEGORY_PAGE_LABELS } from "@/lib/categories/ui";
import { formatCategoryDate, sortCategoriesByActivity } from "@/lib/categories/utils";
import { redirect } from "next/navigation";
import { fetchBackendJson, isBackendFetchError } from "@/lib/shared/server-fetch";

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
  let totalPosts = 0;
  let totalViews = 0;

  try {
    const data = await fetchBackendJson<CategorySummaryResponse[]>("/api/v1/categories/summary", {
      revalidate: 300,
    });

    if (Array.isArray(data)) {
      const allCategory = data.find((c) => c.category.toLowerCase() === "all");
      if (allCategory) {
        totalPosts = allCategory.postCount;
        totalViews = allCategory.totalViewCount;
      }

      categories = data
        .filter((category) => category.category.toLowerCase() !== "all")
        .map(
          (category): CategoryStats => ({
            id: category.category.toLowerCase(),
            name: category.category,
            postCount: category.postCount,
            totalViews: category.totalViewCount,
            latestPost: formatCategoryDate(category.latestPostDate),
            latestPostDate: category.latestPostDate,
          }),
        );
    }
  } catch (error: unknown) {
    const status: number | undefined = isBackendFetchError(error) ? error.status : undefined;
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
        latestPost: formatCategoryDate("2025-01-02T16:39:15"),
        latestPostDate: "2025-01-02T16:39:15",
      },
      {
        id: "backend",
        name: "BackEnd",
        postCount: 115,
        totalViews: 13,
        latestPost: formatCategoryDate("2024-12-24T10:00:00"),
        latestPostDate: "2024-12-24T10:00:00",
      },
      {
        id: "ai",
        name: "AI",
        postCount: 15,
        totalViews: 8,
        latestPost: formatCategoryDate("2024-12-26T10:00:00"),
        latestPostDate: "2024-12-26T10:00:00",
      },
      {
        id: "bigdata",
        name: "BigData",
        postCount: 21,
        totalViews: 9,
        latestPost: formatCategoryDate("2024-12-26T10:00:00"),
        latestPostDate: "2024-12-26T10:00:00",
      },
      {
        id: "infra",
        name: "Infra",
        postCount: 82,
        totalViews: 6,
        latestPost: formatCategoryDate("2024-12-24T00:00:00"),
        latestPostDate: "2024-12-24T00:00:00",
      },
      {
        id: "architecture",
        name: "Architecture",
        postCount: 90,
        totalViews: 15,
        latestPost: formatCategoryDate("2025-01-02T16:39:15"),
        latestPostDate: "2025-01-02T16:39:15",
      },
    ];
  }

  const sortedCategories = sortCategoriesByActivity(categories);

  const topCategories = sortedCategories.slice(0, 3);
  const otherCategories = sortedCategories.slice(3);

  // Fallback: API에 "ALL"이 없을 경우에만 기존처럼 합산
  if (totalPosts === 0 && sortedCategories.length > 0) {
    totalPosts = sortedCategories.reduce((sum, category) => sum + category.postCount, 0);
  }
  if (totalViews === 0 && sortedCategories.length > 0) {
    totalViews = sortedCategories.reduce((sum, category) => sum + category.totalViews, 0);
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        <section>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{CATEGORY_PAGE_LABELS.title}</h1>
            </div>
            <div className="grid grid-cols-3 gap-2 self-start text-xs sm:gap-3 sm:text-sm">
              <SummaryChip label={CATEGORY_PAGE_LABELS.summaryCategories} value={sortedCategories.length.toLocaleString()} />
              <SummaryChip label={CATEGORY_PAGE_LABELS.summaryPosts} value={totalPosts.toLocaleString()} />
              <SummaryChip label={CATEGORY_PAGE_LABELS.summaryViews} value={totalViews.toLocaleString()} />
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
              {CATEGORY_PAGE_LABELS.emptyState}
            </div>
          )}
        </section>

        {otherCategories.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xs font-semibold tracking-[0.04em] text-gray-500 dark:text-gray-400">
              {CATEGORY_PAGE_LABELS.sectionOther}
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
      <p className="text-[10px] font-semibold tracking-[0.04em] text-gray-400">{label}</p>
      <p className="mt-1 font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}

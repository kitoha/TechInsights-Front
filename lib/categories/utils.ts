import { CategoryStats } from "@/components/category/CategoryCard";

export function formatCategoryDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

export function sortCategoriesByActivity(categories: CategoryStats[]): CategoryStats[] {
  return [...categories].sort((a, b) => {
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
}

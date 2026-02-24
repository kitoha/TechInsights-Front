export interface CategoryActivityStat {
  id: string;
  name: string;
  postCount: number;
  totalViews: number;
  latestPost: string;
  latestPostDate: string;
}

const koreaDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function formatCategoryDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const parts = koreaDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return "-";
  }

  return `${year}년 ${month}월 ${day}일`;
}

export function sortCategoriesByActivity(categories: CategoryActivityStat[]): CategoryActivityStat[] {
  return [...categories].sort((a, b) => {
    if (b.totalViews !== a.totalViews) {
      return b.totalViews - a.totalViews;
    }

    if (b.postCount !== a.postCount) {
      return b.postCount - a.postCount;
    }

    const bDate = new Date(b.latestPostDate).getTime();
    const aDate = new Date(a.latestPostDate).getTime();
    const aInvalid = Number.isNaN(aDate);
    const bInvalid = Number.isNaN(bDate);

    if (aInvalid && !bInvalid) {
      return 1;
    }

    if (!aInvalid && bInvalid) {
      return -1;
    }

    if (aInvalid && bInvalid) {
      return 0;
    }

    if (bDate !== aDate) {
      return bDate - aDate;
    }

    return a.name.localeCompare(b.name);
  });
}

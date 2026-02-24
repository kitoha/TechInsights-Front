export const CATEGORY_RANK_LABELS: Record<1 | 2 | 3, string> = {
  1: "Top Active Category",
  2: "High Activity Category",
  3: "Rising Category",
};

export const CATEGORY_CARD_LABELS = {
  posts: "Posts",
  views: "Views",
  activity: "Last Activity",
} as const;

export const CATEGORY_PAGE_LABELS = {
  title: "Category Activity Overview",
  sectionOther: "Other Active Categories",
  summaryCategories: "Categories",
  summaryPosts: "Total Posts",
  summaryViews: "Total Views",
  emptyState: "No category data available.",
} as const;

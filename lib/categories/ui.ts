export const CATEGORY_RANK_LABELS: Record<1 | 2 | 3, string> = {
  1: "가장 활발한 카테고리",
  2: "활동 상위 카테고리",
  3: "주목할 카테고리",
};

export const CATEGORY_CARD_LABELS = {
  posts: "게시글 수",
  views: "조회수",
  activity: "최근 활동",
} as const;

export const CATEGORY_PAGE_LABELS = {
  title: "카테고리 활동 현황",
  subtitle: "최근 활동이 활발한 카테고리를 한눈에 확인해보세요.",
  sectionOther: "기타 활성 카테고리",
  summaryCategories: "카테고리",
  summaryPosts: "총 게시글",
  summaryViews: "총 조회수",
  emptyState: "표시할 카테고리 데이터가 없습니다.",
} as const;

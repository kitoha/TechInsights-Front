export const CATEGORY_RANK_LABELS: Record<1 | 2 | 3, string> = {
  1: "최상위 카테고리",
  2: "상위 활동 카테고리",
  3: "성장 카테고리",
};

export const CATEGORY_CARD_LABELS = {
  posts: "게시글 수",
  views: "조회수",
  activity: "최근 활동",
} as const;

export const CATEGORY_PAGE_LABELS = {
  title: "활성 카테고리",
  subtitle: "조회수, 게시글 수, 최신 활동 순으로 카테고리를 정렬했습니다.",
  sectionOther: "기타 활성 카테고리",
  summaryCategories: "카테고리",
  summaryPosts: "총 게시글",
  summaryViews: "총 조회수",
  emptyState: "표시할 카테고리 데이터가 없습니다.",
} as const;

// 검색 API 응답 타입 정의
export interface InstantSearchCompany {
  id: string;
  name: string;
  logoImageName: string;
  postCount: number;
  matchedPostCount: number;
  highlightedName: string;
}

export interface InstantSearchPost {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  viewCount: number;
  publishedAt: string;
  highlightedTitle: string;
  categories: string[];
}

export interface InstantSearchResponse {
  query: string;
  companies: InstantSearchCompany[];
  posts: InstantSearchPost[];
}

export interface SearchPost {
  id: string;
  title: string;
  preview: string;
  url: string;
  thumbnail?: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  viewCount: number;
  publishedAt: string;
  isSummary: boolean;
  categories: string[];
  relevanceScore: number;
}

export interface SearchResponse {
  query: string;
  posts: SearchPost[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export type SortBy = 'RELEVANCE' | 'LATEST' | 'POPULAR';

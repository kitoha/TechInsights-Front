// 공통 타입 정의
export interface Post {
  id: string;
  companyName: string;
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt: string;
  logoImageName?: string;
  categories?: string[];
  preview?: string;
  thumbnail?: string;
}

export interface Company {
  name: string;
  logoImage: string;
}

export interface TrendingPost {
  logoImage: string;
  title: string;
  viewCount: number;
}

export interface RecommendedPost {
  title: string;
  logo: string;
  color: string;
  borderColor: string;
}

export interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CategoryStats {
  id: string;
  name: string;
  postCount: number;
  totalViews: number;
  latestPost: string;
  logoImage: string;
}

export interface CompanyStats {
  id: string;
  name: string;
  logoImage: string;
  postCount: number;
  totalViews: number;
  latestPost: string;
  blogUrl: string;
}

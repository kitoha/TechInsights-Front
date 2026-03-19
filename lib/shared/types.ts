export interface PagedResponse<T> {
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

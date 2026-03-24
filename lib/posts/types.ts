export interface Post {
  id: string;
  companyName: string;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  url: string;
  publishedAt: string;
  logoImageName?: string;
  categories?: string[];
  preview?: string;
  thumbnail?: string;
  viewCount?: number;
  isBookmarked?: boolean;
  liked?: boolean;
}

export interface RecommendedPost {
  postId: string;
  title: string;
  logoImageName: string;
}

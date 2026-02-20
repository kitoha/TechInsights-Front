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

export interface RecommendedPost {
  postId: string;
  title: string;
  logoImageName: string;
}

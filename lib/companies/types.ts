export interface Company {
  name: string;
  logoImage: string;
}

export interface CompanyInfo {
  name: string;
  logoImageName: string;
}

export interface TrendingPost {
  logoImage: string;
  title: string;
  viewCount: number;
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

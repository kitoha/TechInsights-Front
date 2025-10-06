import { SidebarItem } from "./SidebarItem";
import SidebarListCard from "./SidebarListCard";
import AIRecommendedPosts from "./AIRecommendedPosts";

interface TrendingPost {
  logoImage: string;
  title: string;
  viewCount: number;
}

interface Company {
  name: string;
  logoImage: string;
}

interface RecommendedPost {
  title: string;
  logo: string;
  color: string;
  borderColor: string;
}

interface SidebarProps {
  trendingPosts: TrendingPost[];
  companies: Company[];
  recommendedPosts: RecommendedPost[];
}

export function Sidebar({ trendingPosts, companies, recommendedPosts }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* AI 추천 게시물 */}
      <AIRecommendedPosts posts={recommendedPosts} />
      
      {/* 게시물 조회 수 랭킹 */}
      <SidebarListCard
        title="인기 게시물"
        items={trendingPosts}
        iconType="ranking"
        itemRender={(post: TrendingPost, idx: number) => (
          <SidebarItem
            key={idx}
            index={idx}
            logoImage={post.logoImage}
            title={post.title}
            subtitle={post.viewCount.toString()}
            itemType="ranking"
          />
        )}
      />
      
      {/* Featured Companies */}
      <SidebarListCard
        title="기술 블로그 기업"
        items={companies}
        iconType="company"
        itemRender={(company: Company, idx: number) => (
          <SidebarItem
            key={idx}
            index={idx}
            logoImage={company.logoImage}
            title={company.name}
            itemType="company"
          />
        )}
      />
    </div>
  );
}

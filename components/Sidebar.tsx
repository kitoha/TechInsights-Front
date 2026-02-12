'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { SidebarItem } from "./SidebarItem";
import SidebarListCard from "./SidebarListCard";
import AIRecommendedPosts from "./AIRecommendedPosts";
import { apiGet } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

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
  const [latestTrending, setLatestTrending] = useState(trendingPosts);
  const lastRefreshRef = useRef(0);

  const refreshTrending = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshRef.current < 5000) {
      return;
    }
    lastRefreshRef.current = now;
    try {
      const url = `/api/v1/companies/top-by-views`;
      const params = { page: 0, size: 5 };
      type TrendingCompany = { logoImageName: string; name: string; totalViewCount: number };
      const res = await apiGet<ApiResponse<TrendingCompany>>(url, { params });
      const content = res.data?.content;
      if (Array.isArray(content)) {
        setLatestTrending(content
          .filter((company) => company.logoImageName && company.logoImageName.trim() !== '')
          .map((company) => ({
            logoImage: `/logos/${company.logoImageName}`,
            title: typeof company.name === 'string' ? (company.name.length > 20 ? `${company.name.slice(0, 20)}...` : company.name) : '',
            viewCount: company.totalViewCount ?? 0,
          })));
      }
    } catch (error) {
      console.error('Trending refresh error:', error);
    }
  }, []);

  useEffect(() => {
    setLatestTrending(trendingPosts);
  }, [trendingPosts]);

  useEffect(() => {
    const handleFocus = () => refreshTrending();
    const handleVisibility = () => {
      if (!document.hidden) {
        refreshTrending();
      }
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        refreshTrending();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [refreshTrending]);

  useEffect(() => {
    refreshTrending();
  }, [refreshTrending]);

  return (
    <div className="space-y-5">
      {/* Trending Now Section */}
      <SidebarListCard
        title="Trending Now"
        items={latestTrending}
        iconType="ranking"
        itemRender={(post: TrendingPost, idx: number) => (
          <SidebarItem
            key={idx}
            index={idx}
            logoImage={post.logoImage}
            title={post.title}
            viewCount={post.viewCount}
            itemType="ranking"
          />
        )}
      />

      {/* AI Picks Section */}
      <AIRecommendedPosts posts={recommendedPosts} />
      
      {/* Tech Companies Section */}
      <SidebarListCard
        title="Tech Companies"
        moreLink="/companies"
        items={companies.slice(0, 5)}
        itemRender={(company: Company, idx: number) => (
          <SidebarItem
            key={idx}
            index={idx}
            logoImage={company.logoImage}
            title={company.name}
            subtitle="Technology & Engineering"
            itemType="company"
          />
        )}
      />
    </div>
  );
}

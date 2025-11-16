'use client'

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface CompanyStats {
  id: string;
  name: string;
  logoImage: string;
  postCount: number;
  totalViews: number;
  latestPost: string;
  blogUrl: string;
}

interface CompanyCardProps {
  company: CompanyStats;
  rank?: number;
}

export function CompanyCard({ company, rank }: CompanyCardProps) {
  const router = useRouter();
  
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const handleViewPosts = () => {
    router.push(`/company/${company.id}`);
  };

  const isTop3 = rank !== undefined && rank >= 1 && rank <= 3;
  const rankStyles = {
    1: {
      gradient: "bg-gradient-to-br from-amber-50/80 via-yellow-50/80 to-amber-100/80 dark:from-amber-900/15 dark:via-yellow-900/15 dark:to-amber-800/15",
      borderGradient: "border-amber-200/80 dark:border-amber-700/50",
      borderGlow: "shadow-[0_0_0_1px_rgba(251,191,36,0.2),0_8px_24px_rgba(251,191,36,0.1)] dark:shadow-[0_0_0_1px_rgba(251,191,36,0.3),0_8px_24px_rgba(251,191,36,0.15)]"
    },
    2: {
      gradient: "bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-blue-100/80 dark:from-blue-900/15 dark:via-indigo-900/15 dark:to-blue-800/15",
      borderGradient: "border-blue-200/80 dark:border-blue-700/50",
      borderGlow: "shadow-[0_0_0_1px_rgba(96,165,250,0.2),0_8px_24px_rgba(96,165,250,0.1)] dark:shadow-[0_0_0_1px_rgba(96,165,250,0.3),0_8px_24px_rgba(96,165,250,0.15)]"
    },
    3: {
      gradient: "bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-purple-100/80 dark:from-purple-900/15 dark:via-pink-900/15 dark:to-purple-800/15",
      borderGradient: "border-purple-200/80 dark:border-purple-700/50",
      borderGlow: "shadow-[0_0_0_1px_rgba(192,132,252,0.2),0_8px_24px_rgba(192,132,252,0.1)] dark:shadow-[0_0_0_1px_rgba(192,132,252,0.3),0_8px_24px_rgba(192,132,252,0.15)]"
    }
  };
  const rankBadge = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  const top3Style = isTop3 && rank && rank >= 1 && rank <= 3 ? rankStyles[rank as keyof typeof rankStyles] : null;

  return (
    <Card className={`p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${
      top3Style 
        ? `${top3Style.gradient} border ${top3Style.borderGradient} ${top3Style.borderGlow} hover:scale-[1.02]` 
        : ""
    }`}>
      {isTop3 && rankBadge && (
        <div className="absolute top-4 right-4 text-2xl">
          {rankBadge}
        </div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <Image 
            src={company.logoImage} 
            alt={`${company.name} logo`} 
            width={48} 
            height={48} 
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {company.name}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">📄</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">게시글 수</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {company.postCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">📊</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">총 조회 수</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatViews(company.totalViews)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">🕐</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">최근 게시글</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {company.latestPost}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 dark:text-gray-400 mt-0.5">🔗</span>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-600 dark:text-gray-300">기술 블로그</span>
            <div className="mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 break-all">
                {formatUrl(company.blogUrl)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button 
          onClick={handleViewPosts}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          회사 게시글 보기
        </Button>
        <Button 
          variant="outline"
          className="flex-1 cursor-not-allowed opacity-50"
          disabled
        >
          기술블로그
        </Button>
      </div>
    </Card>
  );
}

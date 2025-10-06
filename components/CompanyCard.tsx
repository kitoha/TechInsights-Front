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
}

export function CompanyCard({ company }: CompanyCardProps) {
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

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
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
              <a 
                href={company.blogUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 break-all hover:underline"
              >
                {formatUrl(company.blogUrl)}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="mt-6 flex gap-2">
        <Button 
          onClick={handleViewPosts}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          회사 게시글 보기
        </Button>
        <Button 
          asChild
          variant="outline"
          className="flex-1 cursor-pointer"
        >
          <a 
            href={company.blogUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            기술블로그
          </a>
        </Button>
      </div>
    </Card>
  );
}

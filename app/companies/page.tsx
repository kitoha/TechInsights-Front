import { isAxiosError } from "axios";
import { Header } from "@/components/Header";
import { CompanyCard, CompanyStats } from "@/components/CompanyCard";
import { apiGet } from "@/lib/api";
import { redirect } from "next/navigation";

export interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export default async function CompaniesPage() {
  let companies: (CompanyStats & { rank: number })[] = [];

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/companiesSummaries`;
    const res = await apiGet<{
      id: string;
      name: string;
      blogUrl: string;
      logoImageName: string;
      totalViewCount: number;
      postCount: number;
      lastPostedAt: string | null;
      rank?: number;
    }[]>(url);

    if (res?.data && Array.isArray(res.data)) {
      companies = res.data
        .filter((company) => (company.postCount ?? 0) > 0)
        .map((company, index): CompanyStats & { rank: number } => ({
          id: company.id,
          name: company.name,
          logoImage: `/logos/${company.logoImageName}`,
          postCount: company.postCount ?? 0,
          totalViews: company.totalViewCount ?? 0,
          latestPost: company.lastPostedAt ? formatTimeAgo(company.lastPostedAt) : "게시글 없음",
          blogUrl: company.blogUrl,
          rank: index + 1
        }));
    } else {
      console.error('Invalid API response structure:', res);
    }
  } catch (error: unknown) {
    const status: number | undefined = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 503) {
      redirect('/maintenance.html');
    }
    console.error('Companies stats fetch error:', error);
    
    // Fallback data for development
    const fallbackData = [
      {
        id: "0MEK6CR5RRRQP",
        name: "AWS",
        logoImage: "/logos/aws.svg",
        postCount: 0,
        totalViews: 0,
        latestPost: "게시글 없음",
        blogUrl: "https://aws.amazon.com/ko/blogs/tech/feed/"
      },
      {
        id: "0MEK6CR5RRRQQ",
        name: "하이퍼커넥트",
        logoImage: "/logos/hyperconnect.svg",
        postCount: 0,
        totalViews: 0,
        latestPost: "게시글 없음",
        blogUrl: "https://hyperconnect.github.io/feed.xml"
      },
      {
        id: "0MEK6CR5RRRQR",
        name: "컬리",
        logoImage: "/logos/kurly.svg",
        postCount: 41,
        totalViews: 4,
        latestPost: "2022년 9월",
        blogUrl: "https://helloworld.kurly.com/feed"
      },
      {
        id: "0MEK6CR5RRRQS",
        name: "쏘카",
        logoImage: "/logos/socar.svg",
        postCount: 0,
        totalViews: 0,
        latestPost: "게시글 없음",
        blogUrl: "https://tech.socarcorp.kr/feed"
      },
      {
        id: "0MEK6CR5RRRQT",
        name: "지마켓",
        logoImage: "/logos/gmarket.svg",
        postCount: 0,
        totalViews: 0,
        latestPost: "게시글 없음",
        blogUrl: "https://dev.gmarket.com/feed"
      },
      {
        id: "0MEK6CR5RRRQV",
        name: "SSG TECH",
        logoImage: "/logos/ssgtech.svg",
        postCount: 0,
        totalViews: 0,
        latestPost: "게시글 없음",
        blogUrl: "https://medium.com/feed/ssgtech"
      },
      {
        id: "0MEK6CR5RRRQW",
        name: "클래스101",
        logoImage: "/logos/class101.svg",
        postCount: 4,
        totalViews: 0,
        latestPost: "2022년 8월",
        blogUrl: "https://medium.com/feed/class101/tagged/engineering"
      },
      {
        id: "0MEKNVG9V3CQN",
        name: "뱅크샐러드",
        logoImage: "/logos/banksalad.svg",
        postCount: 48,
        totalViews: 4,
        latestPost: "2022년 8월",
        blogUrl: "https://blog.banksalad.com/rss.xml"
      }
    ];
    
    companies = fallbackData
      .filter((company) => company.postCount > 0)
      .map((company) => ({
        ...company,
        rank: 0
      }));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            회사별 포스트 현황
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            각 기업의 기술 블로그 포스트 현황을 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} rank={company.rank} />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays}일 전`;
  } else if (diffInHours > 0) {
    return `${diffInHours}시간 전`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}분 전`;
  } else {
    return "방금 전";
  }
}

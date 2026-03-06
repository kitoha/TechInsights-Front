import { isAxiosError } from "axios";
import { CompanyCard, CompanyStats } from "@/components/company/CompanyCard";
import { apiGet } from "@/lib/shared/api";
import { redirect } from "next/navigation";
import { formatCompactNumber } from "@/lib/shared/utils";

export interface ApiResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const dynamic = 'force-dynamic';

export default async function CompaniesPage() {
  let companies: (CompanyStats & { rank: number })[] = [];

  try {
    const res = await apiGet<{
      id: string;
      name: string;
      blogUrl: string;
      logoImageName: string;
      totalViewCount: number;
      postCount: number;
      lastPostedAt: string | null;
      rank?: number;
    }[]>("/api/v1/companiesSummaries");

    if (res?.data && Array.isArray(res.data)) {
      let rank = 1;
      companies = res.data
        .filter((company) => (company.postCount ?? 0) > 0)
        .map((company): CompanyStats & { rank: number } => ({
          id: company.id,
          name: company.name,
          logoImage: `/logos/${company.logoImageName}`,
          postCount: company.postCount ?? 0,
          totalViews: company.totalViewCount ?? 0,
          latestPost: company.lastPostedAt ? formatTimeAgo(company.lastPostedAt) : "게시글 없음",
          blogUrl: company.blogUrl,
          rank: rank++
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

  const totalPosts = companies.reduce((sum, company) => sum + company.postCount, 0);
  const totalViews = companies.reduce((sum, company) => sum + company.totalViews, 0);
  const summaryItems = [
    { label: "회사", value: `${companies.length}개` },
    { label: "포스트", value: `${formatCompactNumber(totalPosts)}개` },
    { label: "조회수", value: formatCompactNumber(totalViews) },
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            회사별 포스트 현황
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            각 기업의 기술 블로그 포스트 현황을 확인해보세요
          </p>
          <div className="grid w-full max-w-xl grid-cols-3 gap-2">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {companies.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              표시할 회사 데이터가 없습니다.
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              잠시 후 다시 새로고침하거나 API 연결 상태를 확인해 주세요.
            </p>
          </div>
        )}
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

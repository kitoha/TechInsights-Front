'use client'

import { Card } from "@/components/ui/card";
import { FileText, Eye, Clock } from "lucide-react";
import { LogoImage } from "@/components/company/LogoImage";
import Link from "next/link";

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

const topRankStyles: Record<number, string> = {
  1: "border-amber-300/90 dark:border-amber-700/70 bg-gradient-to-br from-amber-50/70 via-white to-white dark:from-amber-950/25 dark:via-slate-900 dark:to-slate-900",
  2: "border-blue-300/90 dark:border-blue-700/70 bg-gradient-to-br from-blue-50/60 via-white to-white dark:from-blue-950/25 dark:via-slate-900 dark:to-slate-900",
  3: "border-emerald-300/90 dark:border-emerald-700/70 bg-gradient-to-br from-emerald-50/60 via-white to-white dark:from-emerald-950/25 dark:via-slate-900 dark:to-slate-900",
};

const brandTones = [
  {
    logoBg: "bg-blue-50 dark:bg-blue-950/30",
    logoBorder: "border-blue-200 dark:border-blue-800/60",
    rankBadge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    logoBg: "bg-emerald-50 dark:bg-emerald-950/30",
    logoBorder: "border-emerald-200 dark:border-emerald-800/60",
    rankBadge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  {
    logoBg: "bg-amber-50 dark:bg-amber-950/30",
    logoBorder: "border-amber-200 dark:border-amber-800/60",
    rankBadge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  {
    logoBg: "bg-rose-50 dark:bg-rose-950/30",
    logoBorder: "border-rose-200 dark:border-rose-800/60",
    rankBadge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  },
  {
    logoBg: "bg-violet-50 dark:bg-violet-950/30",
    logoBorder: "border-violet-200 dark:border-violet-800/60",
    rankBadge: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
  {
    logoBg: "bg-cyan-50 dark:bg-cyan-950/30",
    logoBorder: "border-cyan-200 dark:border-cyan-800/60",
    rankBadge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  },
] as const;

function getToneIndex(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % brandTones.length;
}

export function CompanyCard({ company, rank }: CompanyCardProps) {
  const tone = brandTones[getToneIndex(company.name)];
  const topRankClass = rank ? topRankStyles[rank] : undefined;
  
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Link
      href={`/company/${company.id}`}
      aria-label={`${company.name} 회사 게시글 보기`}
      className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
    >
      <Card
        className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-5 dark:border-slate-700 dark:bg-slate-900 ${topRankClass ?? ""}`}
      >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-full w-full bg-gradient-to-br from-blue-500/4 via-transparent to-emerald-500/6 dark:from-blue-400/6 dark:to-emerald-300/8" />
      </div>

      <div className="relative mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border ${tone.logoBg} ${tone.logoBorder}`}
          >
            <LogoImage
              src={company.logoImage}
              alt={`${company.name} logo`}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {company.name}
          </h3>
        </div>
        <div
          className={`rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium dark:border-slate-700 ${tone.rankBadge}`}
        >
          #{rank ?? "-"}
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 sm:p-3 dark:border-slate-700 dark:bg-slate-800/80">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            Posts
          </div>
          <span className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
            {company.postCount}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 sm:p-3 dark:border-slate-700 dark:bg-slate-800/80">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Eye className="h-3.5 w-3.5" />
            Views
          </div>
          <span className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
            {formatViews(company.totalViews)}
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {company.latestPost}
          </span>
        </div>
        <span className="inline-flex h-8 w-full items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition-colors duration-200 group-hover:bg-blue-700 sm:w-auto">
          View Posts
        </span>
      </div>
      </Card>
    </Link>
  );
}

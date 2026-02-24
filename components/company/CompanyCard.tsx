'use client'

import { Card } from "@/components/ui/card";
import { FileText, Eye, ArrowRight } from "lucide-react";
import { LogoImage } from "@/components/company/LogoImage";
import { formatCompactNumber } from "@/lib/shared/utils";
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
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/company/${company.id}`}
      aria-label={`${company.name} 회사 게시글 보기`}
      className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
    >
      <Card
        className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-5 dark:border-slate-700 dark:bg-slate-900 `}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="h-full w-full bg-gradient-to-br from-blue-500/4 via-transparent to-emerald-500/6 dark:from-blue-400/6 dark:to-emerald-300/8" />
        </div>

        <div className="relative mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700`}
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
        </div>

        <div className="relative grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 sm:p-3 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <FileText className="h-3.5 w-3.5" />
              Posts
            </div>
            <span className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
              {formatCompactNumber(company.postCount)}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 sm:p-3 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Eye className="h-3.5 w-3.5" />
              Views
            </div>
            <span className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
              {formatCompactNumber(company.totalViews)}
            </span>
          </div>
        </div>

        <div className="relative mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">
              {company.latestPost}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors duration-200 group-hover:text-blue-700 dark:text-blue-500 dark:group-hover:text-blue-400">
            View Posts
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

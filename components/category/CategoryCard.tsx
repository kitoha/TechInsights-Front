import { Card } from "@/components/ui/card";
import Link from "next/link";

export interface CategoryStats {
  id: string;
  name: string;
  postCount: number;
  totalViews: number;
  latestPost: string;
  latestPostDate: string;
  logoImage: string;
}

interface CategoryCardProps {
  category: CategoryStats;
}

interface TopCategoryCardProps extends CategoryCardProps {
  rank: 1 | 2 | 3;
}

const rankStyleMap: Record<1 | 2 | 3, { border: string; badge: string; surface: string }> = {
  1: {
    border: "border-amber-300/90 dark:border-amber-500/70",
    badge: "bg-amber-500 text-white",
    surface: "bg-amber-50/60 dark:bg-amber-900/20",
  },
  2: {
    border: "border-slate-300/90 dark:border-slate-500/70",
    badge: "bg-slate-400 text-white",
    surface: "bg-slate-50/60 dark:bg-slate-800/40",
  },
  3: {
    border: "border-orange-300/90 dark:border-orange-500/70",
    badge: "bg-orange-500 text-white",
    surface: "bg-orange-50/60 dark:bg-orange-900/20",
  },
};

function getCategoryUrl(categoryName: string): string {
  return `/?category=${encodeURIComponent(categoryName)}&page=0`;
}

function formatCount(value: number): string {
  return value.toLocaleString();
}

function getCategoryInitial(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function TopCategoryCard({ category, rank }: TopCategoryCardProps) {
  const rankStyle = rankStyleMap[rank];

  return (
    <Link href={getCategoryUrl(category.name)} className="block focus-visible:outline-none">
      <Card
        className={`group relative overflow-hidden rounded-2xl border ${rankStyle.border} ${rankStyle.surface} p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-400/70 dark:focus-within:ring-blue-500/60`}
      >
        <span
          aria-label={`랭킹 ${rank}위`}
          className={`absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${rankStyle.badge}`}
        >
          {rank}
        </span>

        <div className="mb-5 flex items-center gap-3 pr-10">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
            {getCategoryInitial(category.name)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Most Active</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label="TOTAL POSTS" value={formatCount(category.postCount)} />
          <Metric label="TOTAL VIEWS" value={formatCount(category.totalViews)} />
        </div>

        <div className="mt-4 border-t border-gray-200/80 pt-3 dark:border-gray-700/70">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">Last Activity</p>
          <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">{category.latestPost}</p>
        </div>
      </Card>
    </Link>
  );
}

export function CompactCategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={getCategoryUrl(category.name)} className="block focus-visible:outline-none">
      <Card className="rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-400/70 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-500/60">
        <div className="mb-4 flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {getCategoryInitial(category.name)}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span>TOTAL POSTS</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCount(category.postCount)}</span>
          </div>
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span>TOTAL VIEWS</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCount(category.totalViews)}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">Last Activity</p>
          <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">{category.latestPost}</p>
        </div>
      </Card>
    </Link>
  );
}

export function CategoryCard({ category }: CategoryCardProps) {
  return <CompactCategoryCard category={category} />;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white/90 px-3 py-2 dark:border-gray-700/70 dark:bg-gray-900/80">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}

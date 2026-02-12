import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface SidebarListCardProps<T = unknown> {
  title: string;
  items: T[];
  itemRender?: (item: T, idx: number) => React.ReactNode;
  moreLink?: string;
  loading?: boolean;
  emptyMessage?: string;
  iconType?: 'ranking' | 'company' | 'default';
}

export default function SidebarListCard<T = unknown>({ 
  title, 
  items, 
  itemRender, 
  moreLink, 
  loading = false,
  emptyMessage = "데이터가 없습니다.",
  iconType = 'default'
}: SidebarListCardProps<T>) {
  const getHeaderStyle = () => {
    switch (iconType) {
      case 'ranking':
        return {
          icon: (
            <div className="w-8 h-8 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center border border-orange-500/20 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          ),
          subtitle: 'Now Trending'
        };
      case 'company':
        return {
          icon: (
            <div className="w-8 h-8 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/20 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          ),
          subtitle: 'Featured Blogs'
        };
      default:
        return {
          icon: (
            <div className="w-8 h-8 bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-lg flex items-center justify-center border border-slate-500/20 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          ),
          subtitle: 'Browse All'
        };
    }
  };

  const headerStyle = getHeaderStyle();

  return (
    <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-2xl">
      <div className="px-5 py-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {headerStyle.icon}
            <div>
              <CardTitle className="text-[15px] font-bold text-foreground tracking-tight">{title}</CardTitle>
              <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{headerStyle.subtitle}</p>
            </div>
          </div>
          {moreLink && (
            <Link href={moreLink} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group">
              See All
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
      
      <CardContent className="px-3 py-2">
        <div className="space-y-0.5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              {emptyMessage}
            </div>
          ) : (
            items.map((item, idx) => itemRender ? itemRender(item, idx) : null)
          )}
        </div>
      </CardContent>
    </Card>
  );
}

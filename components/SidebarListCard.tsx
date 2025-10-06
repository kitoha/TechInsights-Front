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
          background: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
          overlay: 'bg-gradient-to-r from-orange-500/10 to-red-500/10',
          icon: (
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          ),
          subtitle: '🔥 지금 뜨는 인기글'
        };
      case 'company':
        return {
          background: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          overlay: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10',
          icon: (
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          ),
          subtitle: '🏢 기술 블로그 기업'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
          overlay: 'bg-gradient-to-r from-gray-500/10 to-slate-500/10',
          icon: (
            <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          ),
          subtitle: '📋 목록'
        };
    }
  };

  const headerStyle = getHeaderStyle();

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* 헤더 섹션 - 아이콘과 그라데이션 배경 */}
      <div className={`relative ${headerStyle.background} px-4 py-4`}>
        <div className={`absolute inset-0 ${headerStyle.overlay}`}></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {headerStyle.icon}
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">{title}</CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{headerStyle.subtitle}</p>
            </div>
          </div>
          {moreLink && (
            <Link href={moreLink} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group">
              더보기
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
      
      {/* 본문 섹션 */}
      <CardContent className="px-4 py-3">
        <div className="space-y-1">
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

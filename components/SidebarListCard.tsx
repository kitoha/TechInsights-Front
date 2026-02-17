import Link from "next/link";

interface SidebarListCardProps<T = unknown> {
  title: string;
  items: T[];
  itemRender?: (item: T, idx: number) => React.ReactNode;
  moreLink?: string;
  loading?: boolean;
  emptyMessage?: string;
  iconType?: 'ranking' | 'company' | 'ai' | 'default';
}

export default function SidebarListCard<T = unknown>({ 
  title, 
  items, 
  itemRender, 
  moreLink, 
  loading = false,
  emptyMessage = "No data available.",
  iconType = 'default'
}: SidebarListCardProps<T>) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200/40 dark:border-gray-700/40 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center gap-2">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-foreground/95">
            {title}
          </h3>
          {iconType === 'ranking' && (
            <svg className="w-3.5 h-3.5 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
          {iconType === 'ai' && (
             <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.85 8.65L22 9.24L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.24L9.15 8.65L12 2Z"/></svg>
          )}
        </div>
        {moreLink && (
          <Link href={moreLink} className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View All
          </Link>
        )}
      </div>

      <div className="px-5 py-5">
        <div className="space-y-3.5">
          {loading ? (
            <div className="py-4 flex justify-center"><div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-4 text-xs text-muted-foreground">{emptyMessage}</div>
          ) : (
            items.map((item, idx) => itemRender ? itemRender(item, idx) : null)
          )}
        </div>
      </div>
    </div>
  );
}

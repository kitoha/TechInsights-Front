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
  emptyMessage = "No data available.",
  iconType = 'default'
}: SidebarListCardProps<T>) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-border/40 rounded-3xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-foreground">
            {title}
          </h3>
          {iconType === 'ranking' && (
            <svg className="w-4 h-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
          {iconType === 'ai' && (
             <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.85 8.65L22 9.24L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.24L9.15 8.65L12 2Z"/></svg>
          )}
        </div>
        {moreLink && (
          <Link href={moreLink} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            View All
          </Link>
        )}
      </div>
      
      <div className="px-6 pb-6">
        <div className="space-y-6">
          {loading ? (
            <div className="py-4 flex justify-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
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

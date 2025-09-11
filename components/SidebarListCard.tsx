import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface SidebarListCardProps<T = unknown> {
  title: string;
  items: T[];
  itemRender: (item: T, idx: number) => React.ReactNode;
  moreLink?: string;
}

export default function SidebarListCard<T = unknown>({ title, items, itemRender, moreLink }: SidebarListCardProps<T>) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="px-4 py-3 pb-1">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</CardTitle>
          </div>
          {moreLink && (
            <Link href={moreLink} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group ml-6">
              더보기
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-3">
        <div className="space-y-2">
          {items.map((item, idx) => itemRender(item, idx))}
        </div>
      </CardContent>
    </Card>
  );
}

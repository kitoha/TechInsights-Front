"use client";
import { memo } from "react";
import { OptimizedImage } from "./OptimizedImage";

interface SidebarItemProps {
  index: number;
  logoImage: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  itemType?: 'ranking' | 'company' | 'default';
  viewCount?: number;
}

export const SidebarItem = memo(function SidebarItem({ index, logoImage, title, subtitle, onClick, itemType = 'default', viewCount }: SidebarItemProps) {
  if (itemType === 'ranking') {
    return (
      <div className="group cursor-pointer flex items-center space-x-3 py-0.5 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-lg px-1 -mx-1 transition-colors" onClick={onClick}>
        <span className="text-[16px] font-bold text-muted-foreground/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none min-w-[24px]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-border/30">
          <OptimizedImage
            src={logoImage}
            alt="logo"
            width={18}
            height={18}
            className="object-contain w-[18px] h-[18px]"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-semibold leading-tight text-foreground/95 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {title}
          </h4>
        </div>
        {viewCount !== undefined && (
          <div className="flex items-center space-x-1 text-muted-foreground/60">
            <span className="text-[10px] font-semibold whitespace-nowrap tabular-nums">
              {viewCount.toLocaleString()}
            </span>
            <span className="text-[9px] font-medium">
              조회
            </span>
          </div>
        )}
      </div>
    );
  }

  // Company Style
  const colors = ['bg-orange-50 dark:bg-orange-950/20', 'bg-blue-50 dark:bg-blue-950/20', 'bg-purple-50 dark:bg-purple-950/20', 'bg-green-50 dark:bg-green-950/20', 'bg-cyan-50 dark:bg-cyan-950/20'];
  const color = colors[index % colors.length];

  return (
    <div className="group cursor-pointer flex items-center space-x-3 py-1 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-lg px-1 -mx-1 transition-colors" onClick={onClick}>
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0 border border-border/30 group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-colors`}>
        <OptimizedImage
          src={logoImage}
          alt="logo"
          width={20}
          height={20}
          className="object-contain w-5 h-5"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[13px] font-semibold text-foreground/95 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {title}
        </h4>
        <p className="text-[10px] text-muted-foreground/65 truncate font-medium">
          {subtitle || "Technology & Engineering"}
        </p>
      </div>
    </div>
  );
});

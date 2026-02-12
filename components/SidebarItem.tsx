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
}

export const SidebarItem = memo(function SidebarItem({ index, logoImage, title, subtitle, onClick, itemType = 'default' }: SidebarItemProps) {
  const getRankingStyle = () => {
    if (index === 0) return "bg-primary text-primary-foreground shadow-md shadow-primary/20";
    if (index === 1) return "bg-muted-foreground/20 text-foreground shadow-sm";
    if (index === 2) return "bg-orange-500/20 text-orange-600 dark:text-orange-400 shadow-sm";
    return "bg-muted text-muted-foreground";
  };

  const rankingBadgeStyle = itemType === 'ranking' ? getRankingStyle() : "bg-muted text-muted-foreground";

  return (
    <div className="group cursor-pointer p-1" onClick={onClick}>
      <div className="flex items-center gap-3.5 p-2.5 rounded-xl group-hover:bg-accent/50 transition-all duration-300 border border-transparent group-hover:border-border/50">
        {/* 순위/번호 표시 */}
        <div className="flex-shrink-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black transition-transform group-hover:scale-110 ${rankingBadgeStyle}`}>
            {index + 1}
          </div>
        </div>
        
        {/* 회사 로고 */}
        <div className="w-9 h-9 rounded-xl bg-background border border-border group-hover:border-primary/30 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm transition-colors">
          <OptimizedImage 
            src={logoImage} 
            alt="logo" 
            width={36} 
            height={36} 
            className="object-contain w-full h-full p-1" 
          />
        </div>
        
        {/* 제목과 부제목 */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-foreground font-bold leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-1 tracking-tight">
            {title}
          </p>
          {subtitle && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                {typeof subtitle === 'string' && !isNaN(Number(subtitle)) ? `${Number(subtitle).toLocaleString()} views` : subtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

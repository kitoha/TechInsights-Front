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
  if (itemType === 'ranking') {
    return (
      <div className="group cursor-pointer flex items-start space-x-4" onClick={onClick}>
        <span className="text-[18px] font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors leading-none pt-1">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="space-y-1">
          <h4 className="text-[14px] font-black leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h4>
          <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
            {subtitle || "Insightful tech article about the latest trends..."}
          </p>
        </div>
      </div>
    );
  }

  // Company Style
  const colors = ['bg-orange-100', 'bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-cyan-100'];
  const color = colors[index % colors.length];

  return (
    <div className="group cursor-pointer flex items-center space-x-4" onClick={onClick}>
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0 border border-black/5`}>
        <OptimizedImage 
          src={logoImage} 
          alt="logo" 
          width={24} 
          height={24} 
          className="object-contain w-6 h-6" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-black text-foreground group-hover:text-primary transition-colors truncate">
          {title}
        </h4>
        <p className="text-[11px] text-muted-foreground truncate font-medium">
          {subtitle || "Technology & Engineering"}
        </p>
      </div>
    </div>
  );
});

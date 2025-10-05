"use client";
import { memo } from "react";
import { OptimizedImage } from "./OptimizedImage";

interface SidebarItemProps {
  index: number;
  logoImage: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

export const SidebarItem = memo(function SidebarItem({ index, logoImage, title, subtitle, onClick }: SidebarItemProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
        <div className="flex-shrink-0">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
            {index + 1}
          </span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <OptimizedImage 
            src={logoImage} 
            alt="logo" 
            width={36} 
            height={36} 
            className="object-cover w-full h-full rounded-lg" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

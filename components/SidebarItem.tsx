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
    if (index === 0) {
      return {
        bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        text: 'text-white',
        shadow: 'shadow-lg shadow-yellow-500/25'
      };
    } else if (index === 1) {
      return {
        bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
        text: 'text-white',
        shadow: 'shadow-lg shadow-gray-400/25'
      };
    } else if (index === 2) {
      return {
        bg: 'bg-gradient-to-br from-amber-600 to-amber-700',
        text: 'text-white',
        shadow: 'shadow-lg shadow-amber-600/25'
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600',
        text: 'text-gray-600 dark:text-gray-300',
        shadow: 'shadow-sm'
      };
    }
  };

  const getCompanyStyle = () => {
    return {
      bg: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800',
      text: 'text-green-700 dark:text-green-300',
      shadow: 'shadow-sm'
    };
  };

  const getDefaultStyle = () => {
    return {
      bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600',
      text: 'text-gray-600 dark:text-gray-300',
      shadow: 'shadow-sm'
    };
  };

  const getStyle = () => {
    switch (itemType) {
      case 'ranking':
        return getRankingStyle();
      case 'company':
        return getCompanyStyle();
      default:
        return getDefaultStyle();
    }
  };

  const style = getStyle();

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200">
        {/* 순위/번호 표시 */}
        <div className="flex-shrink-0">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${style.bg} ${style.shadow}`}>
            <span className={`text-xs font-bold ${style.text}`}>
              {index + 1}
            </span>
          </div>
        </div>
        
        {/* 회사 로고 */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
          <OptimizedImage 
            src={logoImage} 
            alt="logo" 
            width={32} 
            height={32} 
            className="object-cover w-full h-full rounded-lg" 
          />
        </div>
        
        {/* 제목과 부제목 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 line-clamp-1">
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

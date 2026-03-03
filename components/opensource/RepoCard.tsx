"use client";

import { TrendingRepo, LANGUAGE_COLORS } from "@/lib/opensource/types";
import { formatCompactNumber, cn } from "@/lib/shared/utils";

interface RepoCardProps {
    repo: TrendingRepo;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

export function RepoCard({ repo, isFavorite, onToggleFavorite }: RepoCardProps) {
    const langColor = LANGUAGE_COLORS[repo.language] || '#6e7681';

    return (
        <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 dark:border-gray-700/60 dark:bg-gray-900 dark:hover:border-gray-600"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <img
                        src={repo.ownerAvatar}
                        alt={repo.owner}
                        className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {repo.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{repo.fullName}</p>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleFavorite?.(repo.id);
                        }}
                        className={cn(
                            "p-1.5 rounded-lg transition-all duration-300 cursor-pointer",
                            isFavorite
                                ? "bg-amber-50 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400"
                                : "text-gray-300 hover:text-gray-400 hover:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-500 dark:hover:bg-gray-800"
                        )}
                    >
                        <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 border border-emerald-200/60 dark:border-emerald-800/40">
                        <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                            +{formatCompactNumber(repo.starsThisWeek)}
                        </span>
                    </div>
                </div>
            </div>

            {(repo.aiSummary || repo.relevance !== undefined) && (
                <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        {repo.aiSummary && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40">
                                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">AI Analysis (KR)</span>
                            </div>
                        )}
                        {repo.relevance !== undefined && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/40">
                                <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">{Math.round(repo.relevance * 100)}% Match</span>
                            </div>
                        )}
                    </div>
                    {repo.aiSummary && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                            {repo.aiSummary}
                        </p>
                    )}
                </div>
            )}

            {!repo.aiSummary && repo.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                    {repo.description}
                </p>
            )}

            <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{formatCompactNumber(repo.stars)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{formatCompactNumber(repo.forks)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                    <span className="font-semibold text-gray-600 dark:text-gray-300">{repo.language}</span>
                </div>
            </div>
        </a>
    );
}

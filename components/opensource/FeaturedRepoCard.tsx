"use client";

import { TrendingRepo, LANGUAGE_COLORS } from "@/lib/opensource/types";
import { formatCompactNumber, cn } from "@/lib/shared/utils";

interface FeaturedRepoCardProps {
    repo: TrendingRepo;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
    disabled?: boolean;
}

export function FeaturedRepoCard({ repo, isFavorite, onToggleFavorite, disabled = false }: FeaturedRepoCardProps) {
    const displayLanguage = repo.language?.trim() || '언어 없음';
    const langColor = LANGUAGE_COLORS[displayLanguage] || '#6e7681';

    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300 dark:border-gray-700/60 dark:bg-gray-900 dark:hover:border-gray-600">
            <div className="flex items-start justify-between gap-4 mb-4">
                <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/repo-link flex items-center gap-3.5 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                >
                    <img
                        src={repo.ownerAvatar}
                        alt={repo.owner}
                        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover/repo-link:text-blue-600 dark:group-hover/repo-link:text-blue-400 transition-colors">
                            {repo.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{repo.fullName}</p>
                    </div>
                </a>
                <div className="flex-shrink-0 flex items-center gap-3">
                    {repo.relevance !== undefined && (() => {
                        const score = repo.relevance;
                        const percentage = Math.round(score * 100);
                        let style = {
                            icon: (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                            text: `${percentage}% 약간 유사`,
                            className: "bg-slate-50 text-slate-600 border-slate-200/60 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800/40"
                        };
                        if (score >= 0.8) {
                            style = {
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ),
                                text: `${percentage}% 매우 유사`,
                                className: "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40"
                            };
                        } else if (score >= 0.65) {
                            style = {
                                icon: (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                ),
                                text: `${percentage}% 부분 유사`,
                                className: "bg-blue-50 text-blue-600 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/40"
                            };
                        }

                        return (
                            <div className={cn("hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-1.5 border", style.className)}>
                                {style.icon}
                                <span className="text-sm font-bold tracking-tight">{style.text}</span>
                            </div>
                        );
                    })()}
                    <button
                        type="button"
                        onClick={() => {
                            onToggleFavorite?.(repo.id);
                        }}
                        disabled={disabled}
                        aria-label={isFavorite ? `${repo.name} 즐겨찾기 해제` : `${repo.name} 즐겨찾기 추가`}
                        className={cn(
                            "p-2 rounded-xl transition-all duration-300",
                            disabled ? "cursor-wait opacity-60" : "cursor-pointer",
                            isFavorite
                                ? "bg-amber-50 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800"
                                : "text-gray-300 hover:text-gray-400 hover:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-500 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800"
                        )}
                    >
                        <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                    <div className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 border border-emerald-200/60 dark:border-emerald-800/40">
                        <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            +{formatCompactNumber(repo.starsThisWeek)} this week
                        </span>
                    </div>
                </div>
            </div>

            {repo.aiSummary && (
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40">
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">AI Summary (KR)</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {repo.aiSummary}
                    </p>
                </div>
            )}

            {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {repo.topics.map((topic) => (
                        <span
                            key={`${repo.id}-${topic}`}
                            className="inline-flex items-center rounded-md bg-blue-50/80 dark:bg-blue-950/20 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30"
                        >
                            {topic}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="font-medium">Stars</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{formatCompactNumber(repo.stars)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="font-medium">Forks</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{formatCompactNumber(repo.forks)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Issues</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{formatCompactNumber(repo.issues)}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                    <span className="font-medium">Language</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{displayLanguage}</span>
                </div>
            </div>

        </article>
    );
}

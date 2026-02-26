"use client";

import { useState, useEffect, useCallback } from "react";
import { FeaturedRepoCard } from "@/components/opensource/FeaturedRepoCard";
import { RepoCard } from "@/components/opensource/RepoCard";
import { formatCompactNumber } from "@/lib/shared/utils";
import { LanguageFilter } from "@/components/opensource/LanguageFilter";
import { SortTabs } from "@/components/opensource/SortTabs";
import { LoadMoreButton } from "@/components/opensource/LoadMoreButton";
import { StateView } from "@/components/opensource/StateView";
import { fetchTrendingRepos } from "@/lib/opensource/api";
import type { TrendingRepo, SortType, LanguageFilter as LanguageFilterType } from "@/lib/opensource/types";

export default function OpensourcePage() {
    const [repos, setRepos] = useState<TrendingRepo[]>([]);
    const [language, setLanguage] = useState<LanguageFilterType>("All Languages");
    const [sort, setSort] = useState<SortType>("trending");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState(false);

    const loadRepos = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const data = await fetchTrendingRepos(language, sort);
            // Simulating a potential error for demonstration
            // if (language === 'Zig') throw new Error("API Error");
            setRepos(data);
        } catch (err) {
            console.error("Failed to fetch trending repos:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [language, sort]);

    useEffect(() => {
        loadRepos();
    }, [loadRepos]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        // Simulating load more with delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setLoadingMore(false);
    };

    const resetFilters = () => {
        setLanguage("All Languages");
        setSort("trending");
    };

    const totalRepos = repos.length;
    const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);

    const summaryItems = [
        { label: "Repositories", value: `${totalRepos}개` },
        { label: "Total Stars", value: formatCompactNumber(totalStars) },
    ];

    const featuredRepo = repos[0];
    const gridRepos = repos.slice(1);

    return (
        <div className="min-h-full bg-gradient-to-b from-slate-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* Header Section */}
                <div className="mb-10 flex flex-col gap-5">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                            Daily Trending Repositories
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Discover the hottest open-source projects, summarized by AI in Korean.
                            <br className="hidden sm:block" />
                            Stay ahead of the curve with daily updates.
                        </p>
                    </div>

                    {/* Stats Summary Area */}
                    <div className="grid w-full max-w-md grid-cols-2 gap-3">
                        {summaryItems.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
                            >
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                                    {item.label}
                                </p>
                                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters Panel Area */}
                <div className="mb-10 flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-md shadow-slate-200/20 dark:shadow-none">
                        <LanguageFilter selected={language} onChange={setLanguage} />
                        <div className="px-2 flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Sort by</span>
                            <SortTabs selected={sort} onChange={setSort} />
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="space-y-4">
                        <div className="h-64 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 animate-pulse" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-48 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <StateView
                        type="error"
                        onActionPrimary={loadRepos}
                        onActionSecondary={() => window.open('https://techinsights.shop/support', '_blank')}
                    />
                ) : repos.length === 0 ? (
                    <StateView
                        type="empty"
                        keyword={language !== 'All Languages' ? language : undefined}
                        onActionPrimary={() => setLanguage("All Languages")}
                        onActionSecondary={resetFilters}
                    />
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Featured Card */}
                        {featuredRepo && (
                            <div className="mb-5">
                                <FeaturedRepoCard repo={featuredRepo} />
                            </div>
                        )}

                        {/* Grid Cards */}
                        {gridRepos.length > 0 && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {gridRepos.map((repo) => (
                                    <RepoCard key={repo.id} repo={repo} />
                                ))}
                            </div>
                        )}

                        {/* Load More */}
                        <div className="mt-12">
                            <LoadMoreButton onClick={handleLoadMore} loading={loadingMore} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { FeaturedRepoCard } from "@/components/opensource/FeaturedRepoCard";
import { RepoCard } from "@/components/opensource/RepoCard";
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

    const featuredRepo = repos[0];
    const gridRepos = repos.slice(1);

    return (
        <div className="min-h-full bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
                        Daily Trending Repositories
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        Discover the hottest open-source projects, summarized by AI in Korean.
                        <br className="hidden sm:block" />
                        Stay ahead of the curve with daily updates.
                    </p>
                </div>

                {/* Filters Panel */}
                <div className="mb-8 flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <LanguageFilter selected={language} onChange={setLanguage} />
                        <div className="px-2">
                            <SortTabs selected={sort} onChange={setSort} />
                        </div>
                    </div>
                </div>

                {/* content Area */}
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

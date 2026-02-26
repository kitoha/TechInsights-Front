"use client";

import { useState, useEffect, useCallback } from "react";
import { FeaturedRepoCard } from "@/components/opensource/FeaturedRepoCard";
import { RepoCard } from "@/components/opensource/RepoCard";
import { LanguageFilter } from "@/components/opensource/LanguageFilter";
import { SortTabs } from "@/components/opensource/SortTabs";
import { LoadMoreButton } from "@/components/opensource/LoadMoreButton";
import { fetchTrendingRepos } from "@/lib/opensource/api";
import type { TrendingRepo, SortType, LanguageFilter as LanguageFilterType } from "@/lib/opensource/types";

export default function OpensourcePage() {
    const [repos, setRepos] = useState<TrendingRepo[]>([]);
    const [language, setLanguage] = useState<LanguageFilterType>("All Languages");
    const [sort, setSort] = useState<SortType>("trending");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadRepos = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchTrendingRepos(language, sort);
            setRepos(data);
        } catch (error) {
            console.error("Failed to fetch trending repos:", error);
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
                    <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Discover the hottest open-source projects, summarized by AI in Korean.
                        <br className="hidden sm:block" />
                        Stay ahead of the curve with daily updates.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <LanguageFilter selected={language} onChange={setLanguage} />
                </div>

                {/* Sort Tabs */}
                <div className="mb-6">
                    <SortTabs selected={sort} onChange={setSort} />
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="space-y-4">
                        {/* Featured skeleton */}
                        <div className="h-64 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 animate-pulse" />
                        {/* Grid skeleton */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-48 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
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

                        {/* Empty State */}
                        {repos.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/70">
                                <svg className="mx-auto h-10 w-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    No repositories found
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Try changing the language filter or sort option.
                                </p>
                            </div>
                        )}

                        {/* Load More */}
                        {repos.length > 0 && (
                            <div className="mt-8">
                                <LoadMoreButton onClick={handleLoadMore} loading={loadingMore} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

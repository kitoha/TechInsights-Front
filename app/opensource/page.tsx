"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FeaturedRepoCard } from "@/components/opensource/FeaturedRepoCard";
import { RepoCard } from "@/components/opensource/RepoCard";
import { formatCompactNumber, cn } from "@/lib/shared/utils";
import { LanguageFilter } from "@/components/opensource/LanguageFilter";
import { SortTabs } from "@/components/opensource/SortTabs";
import { SearchInput } from "@/components/opensource/SearchInput";
import { LoadMoreButton } from "@/components/opensource/LoadMoreButton";
import { StateView } from "@/components/opensource/StateView";
import { fetchTrendingRepos, fetchSemanticRepos } from "@/lib/opensource/api";
import { useFavorites } from "@/hooks/opensource/useFavorites";
import type { TrendingRepo, SortType, LanguageFilter as LanguageFilterType } from "@/lib/opensource/types";

const PAGE_SIZE = 8;

export default function OpensourcePage() {
    const [repos, setRepos] = useState<TrendingRepo[]>([]);
    const [language, setLanguage] = useState<LanguageFilterType>("All Languages");
    const [sort, setSort] = useState<SortType>("trending");
    const [searchQuery, setSearchQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const latestRequestId = useRef(0);
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    const loadRepos = useCallback(async () => {
        const requestId = ++latestRequestId.current;
        setLoading(true);
        setError(false);
        setCurrentPage(0);
        try {
            const result = submittedQuery
                ? await fetchSemanticRepos(submittedQuery, PAGE_SIZE)
                : await fetchTrendingRepos(language, sort, 0, PAGE_SIZE);
            if (requestId !== latestRequestId.current) return;
            setRepos(result.repos);
            setTotalPages(result.totalPages);
        } catch {
            if (requestId !== latestRequestId.current) return;
            setError(true);
        } finally {
            if (requestId === latestRequestId.current) {
                setLoading(false);
            }
        }
    }, [language, sort, submittedQuery]);

    useEffect(() => {
        loadRepos();
    }, [loadRepos]);

    const handleLoadMore = async () => {
        if (loadingMore || currentPage + 1 >= totalPages) return;
        const requestId = ++latestRequestId.current;
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const result = submittedQuery
                ? { repos: [], totalPages: 1, totalElements: repos.length }
                : await fetchTrendingRepos(language, sort, nextPage, PAGE_SIZE);
            if (requestId !== latestRequestId.current) return;
            setRepos((prev) => [...prev, ...result.repos]);
            setCurrentPage(nextPage);
            setTotalPages(result.totalPages);
        } catch {
            if (requestId !== latestRequestId.current) return;
            console.error("[OpensourcePage] handleLoadMore failed");
        } finally {
            setLoadingMore(false);
        }
    };

    const resetFilters = () => {
        setLanguage("All Languages");
        setSort("trending");
        setSearchQuery("");
        setSubmittedQuery("");
        setShowFavoritesOnly(false);
    };

    // Filter by favorites if active
    const filteredRepos = showFavoritesOnly
        ? repos.filter(repo => favorites.includes(repo.id))
        : repos;

    const hasMore = currentPage + 1 < totalPages && !showFavoritesOnly;
    const totalStars = filteredRepos.reduce((sum, r) => sum + r.stars, 0);

    const summaryItems = [
        { label: "Repositories", value: `${filteredRepos.length}개` },
        { label: "Total Stars", value: formatCompactNumber(totalStars) },
    ];

    const featuredRepo = filteredRepos[0];
    const gridRepos = filteredRepos.slice(1);

    return (
        <div className="min-h-full bg-gradient-to-b from-slate-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
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

                    {!loading && !error && repos.length > 0 && (
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
                    )}
                </div>

                <div className="mb-10 flex flex-col gap-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-md shadow-slate-200/20 dark:shadow-none">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onSubmit={setSubmittedQuery}
                            />
                            <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800 mx-1" />
                            <div className="flex items-center gap-2">
                                <LanguageFilter selected={language} onChange={setLanguage} />
                                <button
                                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 border shadow-sm cursor-pointer",
                                        showFavoritesOnly
                                            ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400"
                                            : "bg-white border-gray-100 text-gray-500 hover:text-gray-700 hover:border-gray-200 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                    )}
                                >
                                    <svg className={cn("w-4 h-4", showFavoritesOnly && "fill-current")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    <span>Favorites</span>
                                </button>
                            </div>
                        </div>
                        <div className="px-2 flex items-center justify-between sm:justify-end gap-3 border-t lg:border-t-0 border-gray-100 dark:border-gray-800 pt-3 lg:pt-0 mt-1 lg:mt-0">
                            <SortTabs selected={sort} onChange={setSort} />
                        </div>
                    </div>
                    {submittedQuery && !loading && (
                        <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/20 mr-1">
                                    <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-tight">✨ AI Discovery</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-slate-100 italic">&ldquo;{submittedQuery}&rdquo;</span>
                                <span>의 시맨틱 검색 결과 {filteredRepos.length}개를 찾았습니다.</span>
                            </div>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSubmittedQuery("");
                                }}
                                className="text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors cursor-pointer"
                            >
                                검색 초기화
                            </button>
                        </div>
                    )}

                    {showFavoritesOnly && !submittedQuery && (
                        <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 mr-1">
                                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight">★ Favorites Only</span>
                                </div>
                                <span>총 {filteredRepos.length}개의 즐겨찾기 프로젝트를 불러왔습니다.</span>
                            </div>
                            <button
                                onClick={() => setShowFavoritesOnly(false)}
                                className="text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
                            >
                                전체 보기
                            </button>
                        </div>
                    )}
                </div>

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
                        onActionSecondary={() => window.open('https://techinsights.shop/support', '_blank', 'noopener,noreferrer')}
                    />
                ) : filteredRepos.length === 0 ? (
                    showFavoritesOnly && favorites.length === 0 ? (
                        <StateView
                            type="empty"
                            title="즐겨찾기한 프로젝트가 없습니다"
                            description={
                                <span>
                                    마음에 드는 오픈소스 프로젝트의 <strong className="text-amber-500 dark:text-amber-400">★ 북마크 아이콘</strong>을 클릭하여 즐겨찾기에 추가해 보세요.
                                </span>
                            }
                            onActionPrimary={() => setShowFavoritesOnly(false)}
                        />
                    ) : (
                        <StateView
                            type="empty"
                            keyword={showFavoritesOnly ? "Favorites" : (submittedQuery || (language !== 'All Languages' ? language : undefined))}
                            onActionPrimary={() => {
                                if (showFavoritesOnly) setShowFavoritesOnly(false);
                                else if (submittedQuery) {
                                    setSearchQuery("");
                                    setSubmittedQuery("");
                                }
                                else setLanguage("All Languages");
                            }}
                            onActionSecondary={resetFilters}
                        />
                    )
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {featuredRepo && (
                            <div className="mb-5">
                                <FeaturedRepoCard
                                    repo={featuredRepo}
                                    isFavorite={isFavorite(featuredRepo.id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            </div>
                        )}

                        {gridRepos.length > 0 && (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {gridRepos.map((repo) => (
                                    <RepoCard
                                        key={repo.id}
                                        repo={repo}
                                        isFavorite={isFavorite(repo.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        )}

                        {hasMore && (
                            <div className="mt-12">
                                <LoadMoreButton onClick={handleLoadMore} loading={loadingMore} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

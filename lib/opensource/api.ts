import { isAxiosError } from 'axios';
import { apiGet } from '@/lib/shared/api';
import { PagedResponse } from '@/lib/shared/types';
import {
    GithubTrendingRepoDto,
    TrendingRepo,
    SortType,
    LanguageFilter,
    LANGUAGE_COLORS,
} from './types';

const SORT_MAP: Record<SortType, string> = {
    trending: 'TRENDING',
    stars: 'STARS',
    latest: 'LATEST',
};

export function adaptGithubRepo(
    dto: GithubTrendingRepoDto & { relevance?: number },
    options?: { isBookmarked?: boolean }
): TrendingRepo {
    const language = dto.primaryLanguage?.trim() || '언어 없음';
    return {
        id: dto.id,
        name: dto.repoName,
        fullName: dto.fullName,
        owner: dto.ownerName,
        ownerAvatar: dto.ownerAvatarUrl ?? '',
        description: dto.description ?? '',
        stars: dto.starCount,
        forks: dto.forkCount,
        issues: 0,
        language,
        languageColor: LANGUAGE_COLORS[language] ?? '#6e7681',
        starsThisWeek: dto.weeklyStarDelta,
        topics: dto.topics ?? [],
        url: dto.htmlUrl,
        aiSummary: dto.readmeSummary ?? undefined,
        updatedAt: dto.pushedAt,
        relevance: dto.relevance,
        isBookmarked: options?.isBookmarked,
    };
}

export interface FetchTrendingResult {
    repos: TrendingRepo[];
    totalPages: number;
    totalElements: number;
}

const TRENDING_URL = '/api/v1/github/trending';

export async function fetchTrendingRepos(
    language: LanguageFilter = 'All Languages',
    sort: SortType = 'trending',
    page: number = 0,
    size: number = 8,
    query?: string,
): Promise<FetchTrendingResult> {
    const safePage = Math.max(0, Math.floor(Number(page) || 0));
    const safeSize = Math.max(1, Math.min(100, Math.floor(Number(size) || 8)));

    try {
        const params: Record<string, string | number> = {
            page: safePage,
            size: safeSize,
            sort: SORT_MAP[sort],
        };

        if (language !== 'All Languages') {
            params.language = language;
        }

        if (query?.trim()) {
            params.query = query.trim();
        }

        const res = await apiGet<PagedResponse<GithubTrendingRepoDto & { relevance?: number }>>(TRENDING_URL, { params });

        if (Array.isArray(res?.data?.content)) {
            return {
                repos: res.data.content.map((repo) => adaptGithubRepo(repo)),
                totalPages: res.data.totalPages,
                totalElements: res.data.totalElements,
            };
        }

        return { repos: [], totalPages: 1, totalElements: 0 };
    } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 503) {
            throw error;
        }
        console.error('[opensource/api] fetchTrendingRepos error:', error);
        throw error;
    }
}

export interface GithubSemanticSearchResponse {
    query: string;
    results: Array<{
        id: string;
        fullName: string;
        repoName: string;
        description: string;
        readmeSummary: string;
        primaryLanguage: string;
        starCount: number;
        ownerName: string;
        ownerAvatarUrl: string;
        topics: string[];
        htmlUrl: string;
        similarityScore: number;
        rank: number;
    }>;
    totalReturned: number;
    processingTimeMs: number;
}

export async function fetchSemanticRepos(
    query: string,
    size: number = 8
): Promise<FetchTrendingResult> {
    try {
        const res = await apiGet<GithubSemanticSearchResponse>('/api/v1/github/search', {
            params: { query, size }
        });

        if (res?.data?.results) {
            return {
                repos: res.data.results.map(r => adaptGithubRepo({
                    ...r,
                    forkCount: 0,
                    weeklyStarDelta: 0,
                    pushedAt: new Date().toISOString(),
                    fetchedAt: new Date().toISOString(),
                    readmeSummarizedAt: null,
                    relevance: r.similarityScore,
                })),
                totalPages: 1,
                totalElements: res.data.totalReturned,
            };
        }

        return { repos: [], totalPages: 1, totalElements: 0 };
    } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 503) {
            throw error;
        }
        console.error('[opensource/api] fetchSemanticRepos error:', error);
        return { repos: [], totalPages: 1, totalElements: 0 };
    }
}

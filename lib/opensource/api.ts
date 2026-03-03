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

function adaptRepo(dto: GithubTrendingRepoDto & { relevance?: number }): TrendingRepo {
    const language = dto.primaryLanguage ?? '';
    return {
        id: dto.fullName,
        name: dto.repoName,
        fullName: dto.fullName,
        owner: dto.ownerName,
        ownerAvatar: dto.ownerAvatarUrl,
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
                repos: res.data.content.map(adaptRepo),
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
        return { repos: [], totalPages: 1, totalElements: 0 };
    }
}

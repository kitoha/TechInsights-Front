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

// ──────────────────────────────────────────────────────────────
// Sort mapping: UI value → API query param expected by backend
// ──────────────────────────────────────────────────────────────
const SORT_MAP: Record<SortType, string> = {
    trending: 'TRENDING',
    stars: 'STARS',
    latest: 'LATEST',
};

// ──────────────────────────────────────────────────────────────
// Adapter: convert raw DTO → normalized TrendingRepo
// ──────────────────────────────────────────────────────────────
function adaptRepo(dto: GithubTrendingRepoDto): TrendingRepo {
    const language = dto.primaryLanguage ?? '';
    return {
        id: String(dto.id),
        name: dto.repoName,
        fullName: dto.fullName,
        owner: dto.ownerName,
        ownerAvatar: dto.ownerAvatarUrl,
        description: dto.description ?? '',
        stars: dto.starCount,
        forks: dto.forkCount,
        issues: 0, // not exposed by API
        language,
        languageColor: LANGUAGE_COLORS[language] ?? '#6e7681',
        starsThisWeek: dto.weeklyStarDelta,
        topics: dto.topics ?? [],
        url: dto.htmlUrl,
        aiSummary: dto.readmeSummary ?? undefined,
        updatedAt: dto.pushedAt,
    };
}

// ──────────────────────────────────────────────────────────────
// Response shape returned to callers
// ──────────────────────────────────────────────────────────────
export interface FetchTrendingResult {
    repos: TrendingRepo[];
    totalPages: number;
    totalElements: number;
}

const TRENDING_URL = '/api/v1/github/trending';

// ──────────────────────────────────────────────────────────────
// Main fetch function
//
// Mirrors the pattern used in lib/posts/api.ts and
// lib/companies/api.ts: use apiGet + PagedResponse, map to
// internal model, and always return a safe fallback on error.
// ──────────────────────────────────────────────────────────────
export async function fetchTrendingRepos(
    language: LanguageFilter = 'All Languages',
    sort: SortType = 'trending',
    page: number = 0,
    size: number = 8,
): Promise<FetchTrendingResult> {
    // Normalize page / size defensively
    const safePage = Math.max(0, Math.floor(Number(page) || 0));
    const safeSize = Math.max(1, Math.min(100, Math.floor(Number(size) || 8)));

    try {
        const params: Record<string, string | number> = {
            page: safePage,
            size: safeSize,
            sort: SORT_MAP[sort],
        };

        // Only send language param when a specific language is selected
        if (language !== 'All Languages') {
            params.language = language;
        }

        const res = await apiGet<PagedResponse<GithubTrendingRepoDto>>(TRENDING_URL, { params });

        if (Array.isArray(res?.data?.content)) {
            return {
                repos: res.data.content.map(adaptRepo),
                totalPages: res.data.totalPages,
                totalElements: res.data.totalElements,
            };
        }

        return { repos: [], totalPages: 1, totalElements: 0 };
    } catch (error: unknown) {
        // Pass through 503 (handled globally by the axios interceptor)
        if (isAxiosError(error) && error.response?.status === 503) {
            throw error;
        }
        console.error('[opensource/api] fetchTrendingRepos error:', error);
        return { repos: [], totalPages: 1, totalElements: 0 };
    }
}

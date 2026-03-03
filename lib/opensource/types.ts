// ──────────────────────────────────────────────────────────────
// Raw response shape returned by GET /api/v1/github/trending
// ──────────────────────────────────────────────────────────────
export interface GithubTrendingRepoDto {
    id: number;
    repoName: string;
    fullName: string;
    description: string | null;
    htmlUrl: string;
    starCount: number;
    forkCount: number;
    primaryLanguage: string | null;
    ownerName: string;
    ownerAvatarUrl: string;
    topics: string[];
    weeklyStarDelta: number;
    /** ISO-8601 without timezone — treat as UTC */
    pushedAt: string;
    fetchedAt: string;
    readmeSummary: string | null;
    readmeSummarizedAt: string | null;
}

// ──────────────────────────────────────────────────────────────
// Normalized internal model used by all components
// ──────────────────────────────────────────────────────────────
export interface TrendingRepo {
    id: string;
    name: string;
    fullName: string;
    owner: string;
    ownerAvatar: string;
    description: string;
    stars: number;
    forks: number;
    /** API does not expose issues — treated as 0 */
    issues: number;
    language: string;
    /** Derived client-side from LANGUAGE_COLORS */
    languageColor: string;
    starsThisWeek: number;
    topics: string[];
    url: string;
    aiSummary?: string;
    updatedAt: string;
}

export type SortType = 'trending' | 'stars' | 'latest';

// UI filter type — "All Languages" means no filter sent to API
export type LanguageFilter =
    | 'All Languages'
    | 'Python'
    | 'JavaScript'
    | 'TypeScript'
    | 'Java'
    | 'Go'
    | 'Rust'
    | 'Zig'
    | 'Kotlin'
    | 'Swift'
    | 'Ruby'
    | 'C++'
    | 'C'
    | 'Dart';

export const LANGUAGE_COLORS: Record<string, string> = {
    Java: '#b07219',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Go: '#00ADD8',
    Rust: '#dea584',
    Zig: '#ec915c',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Ruby: '#701516',
    'C++': '#f34b7d',
    C: '#555555',
    Dart: '#00B4AB',
};

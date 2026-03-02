import { TrendingRepo, SortType, LanguageFilter } from './types';

const MOCK_REPOS: TrendingRepo[] = [
    {
        id: '1',
        name: 'spring-boot',
        fullName: 'spring-projects/spring-boot',
        owner: 'spring-projects',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/317776?s=48&v=4',
        description: '스프링 부트는 단독 실행 가능한 상용 수준의 스프링 애플리케이션을 쉽게 만들 수 있게 해줍니다.',
        stars: 75400,
        forks: 42100,
        issues: 1200,
        language: 'Java',
        languageColor: '#b07219',
        starsThisWeek: 320,
        topics: ['Java', 'microservices', 'rest-api'],
        url: 'https://github.com/spring-projects/spring-boot',
        aiSummary: '스프링 부트는 단독 실행 가능한 상용 수준의 스프링 애플리케이션을 쉽게 만들 수 있게 해줍니다. 최소한의 설정으로 즉시 실행 가능한 환경을 제공하며, 내장 톰캣 지원으로 별도 웹 서버 설치가 필요 없습니다.',
        updatedAt: '2026-03-01T10:00:00Z',
    },
    {
        id: '2',
        name: 'ui',
        fullName: 'shadcn/ui',
        owner: 'shadcn',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/124599?s=48&v=4',
        description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
        stars: 49200,
        forks: 2300,
        issues: 156,
        language: 'TypeScript',
        languageColor: '#3178c6',
        starsThisWeek: 1200,
        topics: ['react', 'tailwindcss', 'radix-ui', 'components'],
        url: 'https://github.com/shadcn-ui/ui',
        aiSummary: 'Radix UI와 Tailwind CSS를 기반으로 한 재사용 가능한 컴포넌트 모음입니다. 복사 & 붙여넣기 방식으로 프로젝트에 직접 통합하며, 완전한 커스터마이징이 가능합니다.',
        updatedAt: '2026-03-02T08:30:00Z',
    },
    {
        id: '3',
        name: 'bun',
        fullName: 'oven-sh/bun',
        owner: 'oven-sh',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/108928776?s=48&v=4',
        description: 'Node.js를 대체하기 위해 설계된 초고속 올인원 JavaScript 런타임입니다.',
        stars: 68800,
        forks: 1800,
        issues: 892,
        language: 'Zig',
        languageColor: '#ec915c',
        starsThisWeek: 800,
        topics: ['javascript', 'runtime', 'bundler', 'zig'],
        url: 'https://github.com/oven-sh/bun',
        aiSummary: 'Node.js를 대체하기 위해 설계된 초고속 올인원 JavaScript 런타임입니다. Zig로 작성되어 매우 빠르며, 번들러와 패키지 매니저가 내장되어 있습니다.',
        updatedAt: '2026-03-02T07:00:00Z',
    },
    {
        id: '4',
        name: 'astro',
        fullName: 'withastro/astro',
        owner: 'withastro',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/44914786?s=48&v=4',
        description: '콘텐츠 중심 웹사이트를 위한 현대적인 웹 프레임워크입니다.',
        stars: 58500,
        forks: 3200,
        issues: 245,
        language: 'TypeScript',
        languageColor: '#3178c6',
        starsThisWeek: 540,
        topics: ['web-framework', 'ssg', 'islands-architecture'],
        url: 'https://github.com/withastro/astro',
        aiSummary: '콘텐츠 중심 웹사이트를 위한 웹 프레임워크입니다. 기본적으로 JS를 배제하여 빠르며, 필요한 경우에만 아일랜드 아키텍처를 사용합니다.',
        updatedAt: '2026-02-28T15:00:00Z',
    },
    {
        id: '5',
        name: 'langchain',
        fullName: 'langchain-ai/langchain',
        owner: 'langchain-ai',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/126733545?s=48&v=4',
        description: 'Build context-aware reasoning applications with LangChain.',
        stars: 82300,
        forks: 12500,
        issues: 1340,
        language: 'Python',
        languageColor: '#3572A5',
        starsThisWeek: 2400,
        topics: ['llm', 'ai', 'agents', 'rag'],
        url: 'https://github.com/langchain-ai/langchain',
        aiSummary: 'LLM 기반 AI 에이전트와 RAG 파이프라인을 구축하기 위한 Python 프레임워크입니다. 다양한 LLM 프로바이더와 도구를 체이닝하여 컨텍스트 인식형 AI 애플리케이션을 쉽게 개발할 수 있습니다.',
        updatedAt: '2026-03-02T12:00:00Z',
    },
    {
        id: '6',
        name: 'next.js',
        fullName: 'vercel/next.js',
        owner: 'vercel',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4',
        description: 'The React Framework for the Web.',
        stars: 128000,
        forks: 27200,
        issues: 3200,
        language: 'JavaScript',
        languageColor: '#f1e05a',
        starsThisWeek: 680,
        topics: ['react', 'nextjs', 'framework', 'ssr'],
        url: 'https://github.com/vercel/next.js',
        aiSummary: 'React 기반 풀스택 웹 프레임워크. SSR, SSG, ISR을 지원하며 App Router로 서버 컴포넌트를 기본 제공합니다.',
        updatedAt: '2026-02-27T09:00:00Z',
    },
    {
        id: '7',
        name: 'rust',
        fullName: 'rust-lang/rust',
        owner: 'rust-lang',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/5430905?s=48&v=4',
        description: 'Empowering everyone to build reliable and efficient software.',
        stars: 100200,
        forks: 12900,
        issues: 9800,
        language: 'Rust',
        languageColor: '#dea584',
        starsThisWeek: 450,
        topics: ['rust', 'systems-programming', 'compiler'],
        url: 'https://github.com/rust-lang/rust',
        updatedAt: '2026-02-26T06:00:00Z',
    },
    {
        id: '8',
        name: 'kubernetes',
        fullName: 'kubernetes/kubernetes',
        owner: 'kubernetes',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/13629408?s=48&v=4',
        description: 'Production-Grade Container Scheduling and Management.',
        stars: 112000,
        forks: 40500,
        issues: 2300,
        language: 'Go',
        languageColor: '#00ADD8',
        starsThisWeek: 390,
        topics: ['kubernetes', 'containers', 'cloud-native', 'devops'],
        url: 'https://github.com/kubernetes/kubernetes',
        aiSummary: '컨테이너 오케스트레이션 플랫폼. 자동 스케일링, 롤링 업데이트, 서비스 디스커버리를 제공합니다.',
        updatedAt: '2026-02-25T14:00:00Z',
    },
    {
        id: '9',
        name: 'swift',
        fullName: 'apple/swift',
        owner: 'apple',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/10639145?s=48&v=4',
        description: 'The Swift Programming Language.',
        stars: 65000,
        forks: 10200,
        issues: 5400,
        language: 'Swift',
        languageColor: '#F05138',
        starsThisWeek: 210,
        topics: ['swift', 'compiler', 'apple'],
        url: 'https://github.com/apple/swift',
        updatedAt: '2026-02-24T10:00:00Z',
    },
    {
        id: '10',
        name: 'kotlin',
        fullName: 'JetBrains/kotlin',
        owner: 'JetBrains',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/878437?s=48&v=4',
        description: 'The Kotlin Programming Language.',
        stars: 48000,
        forks: 5600,
        issues: 0,
        language: 'Kotlin',
        languageColor: '#A97BFF',
        starsThisWeek: 150,
        topics: ['kotlin', 'compiler', 'jvm'],
        url: 'https://github.com/JetBrains/kotlin',
        updatedAt: '2026-02-23T11:00:00Z',
    },
    {
        id: '11',
        name: 'rust-analyzer',
        fullName: 'rust-lang/rust-analyzer',
        owner: 'rust-lang',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/5430905?s=48&v=4',
        description: 'A Rust compiler front-end for IDEs.',
        stars: 15000,
        forks: 1200,
        issues: 450,
        language: 'Rust',
        languageColor: '#dea584',
        starsThisWeek: 85,
        topics: ['rust', 'ide', 'lsp'],
        url: 'https://github.com/rust-lang/rust-analyzer',
        updatedAt: '2026-02-22T08:00:00Z',
    },
];

export async function fetchTrendingRepos(
    language: LanguageFilter = 'All Languages',
    sort: SortType = 'trending',
    limit: number = 8,
): Promise<TrendingRepo[]> {
    // TODO: Replace with actual API call when backend is ready
    // const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/opensource/trending`;
    // const res = await apiGet<TrendingRepo[]>(url, { params: { language, sort, limit } });

    // Normalize limit: coerce to integer, clamp to >= 0
    const normalizedLimit = Math.max(0, Math.floor(Number(limit) || 0));

    let repos = [...MOCK_REPOS];

    if (language !== 'All Languages') {
        repos = repos.filter((r) => r.language === language);
    }

    switch (sort) {
        case 'stars':
            repos.sort((a, b) => b.stars - a.stars);
            break;
        case 'latest':
            // Sort by most recently updated, not by weekly stars
            repos.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
            break;
        case 'trending':
        default:
            // Already in trending order (ranked by starsThisWeek in data)
            break;
    }

    return repos.slice(0, normalizedLimit);
}

import { TrendingRepo, SortType, LanguageFilter } from './types';

const MOCK_REPOS: TrendingRepo[] = [
    {
        id: '1',
        name: 'spring-boot',
        fullName: 'spring-projects/spring-boot',
        owner: 'spring-projects',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/317776?s=48&v=4',
        description: '스프링 부트는 단독 실행 가능한 상용 수준의 스프링 애플리케이션을 쉽게 만들 수 있게 해줍니다. 최소한의 설정으로 즉시 실행 가능한 환경을 제공하며, 내장 톰캣 자원으로 별도 웹 서버 설치가 필요 없습니다.',
        stars: 75400,
        forks: 42100,
        issues: 1200,
        language: 'Java',
        languageColor: '#b07219',
        starsThisWeek: 320,
        topics: ['Java', 'microservices', 'rest-api'],
        url: 'https://github.com/spring-projects/spring-boot',
        aiSummary: '스프링 부트는 단독 실행 가능한 상용 수준의 스프링 애플리케이션을 쉽게 만들 수 있게 해줍니다. 최소한의 설정으로 즉시 실행 가능한 환경을 제공하며, 내장 톰캣 자원으로 별도 웹 서버 설치가 필요 없습니다.',
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
        aiSummary: '코어 라인 분...',
    },
    {
        id: '3',
        name: 'bun',
        fullName: 'oven-sh/bun',
        owner: 'oven-sh',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/108928776?s=48&v=4',
        description: 'Node.js를 대체하기 키울 성장의 고고속 울와의 JavaScript 런타임입니다. Zig로 작성되어 매우 빠르며, 번들러와 패키지 매니저가 내장되어 있습니다.',
        stars: 68800,
        forks: 1800,
        issues: 892,
        language: 'Zig',
        languageColor: '#ec915c',
        starsThisWeek: 800,
        topics: ['javascript', 'runtime', 'bundler', 'zig'],
        url: 'https://github.com/oven-sh/bun',
        aiSummary: 'Node.js를 대체하기 위해 설계된 초고속 올인원 JavaScript 런타임입니다. Zig로 작성되어 매우 빠르며, 번들러와 패키지 매니저가 내장되어 있습니다.',
    },
    {
        id: '4',
        name: 'astro',
        fullName: 'withastro/astro',
        owner: 'withastro',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/44914786?s=48&v=4',
        description: '콘텐츠 중심 웹사이트를 위한 웹 프레임워크입니다. 기본적으로 JS를 배제하여 빠르며, 필요한 경우에만 React, Vue 또는 웬만디쯤 프로드러는 아일래드 아키텍처를 사용합니다.',
        stars: 58500,
        forks: 3200,
        issues: 245,
        language: 'TypeScript',
        languageColor: '#3178c6',
        starsThisWeek: 540,
        topics: ['web-framework', 'ssg', 'islands-architecture'],
        url: 'https://github.com/withastro/astro',
        aiSummary: '콘텐츠 중심 웹사이트를 위한 웹 프레임워크입니다. 기본적으로 JS를 배제하여 빠르며, 필요한 경우에만 아일랜드 아키텍처를 사용합니다.',
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
        aiSummary: 'AI 에널리시 KR\n모어 콘텐 통...',
    },
    {
        id: '6',
        name: 'next.js',
        fullName: 'vercel/next.js',
        owner: 'vercel',
        ownerAvatar: 'https://avatars.githubusercontent.com/u/14985020?s=48&v=4',
        description: 'The React Framework for the Web. Used by some of the world\'s largest companies, Next.js enables you to create high-quality web applications with the power of React components.',
        stars: 128000,
        forks: 27200,
        issues: 3200,
        language: 'JavaScript',
        languageColor: '#f1e05a',
        starsThisWeek: 680,
        topics: ['react', 'nextjs', 'framework', 'ssr'],
        url: 'https://github.com/vercel/next.js',
        aiSummary: 'React 기반 풀스택 웹 프레임워크. SSR, SSG, ISR을 지원하며 App Router로 서버 컴포넌트를 기본 제공합니다.',
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

    let repos = [...MOCK_REPOS];

    if (language !== 'All Languages') {
        repos = repos.filter((r) => r.language === language);
    }

    switch (sort) {
        case 'stars':
            repos.sort((a, b) => b.stars - a.stars);
            break;
        case 'latest':
            repos.sort((a, b) => b.starsThisWeek - a.starsThisWeek);
            break;
        case 'trending':
        default:
            // Already in trending order
            break;
    }

    return repos.slice(0, limit);
}

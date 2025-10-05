import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'tech.socarcorp.kr', 
      'hyperconnect.github.io',
      'd2908q01vomqb2.cloudfront.net',
      'static.toss.im',
      'techblog.lycorp.co.jp',
      'techblog.woowa.in',
      'thefarmersfront.github.io',
      't1.kakaocdn.net',
      'blog.banksalad.com',
      'oliveyoung.tech',
      'miro.medium.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 성능 최적화 설정
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  // 압축 설정
  compress: true,
  // 정적 파일 최적화
  trailingSlash: false,
};

export default nextConfig;

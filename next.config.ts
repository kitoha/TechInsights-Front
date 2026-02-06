import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.socarcorp.kr' },
      { protocol: 'https', hostname: '**.github.io' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.toss.im' },
      { protocol: 'https', hostname: '**.lycorp.co.jp' },
      { protocol: 'https', hostname: '**.woowa.in' },
      { protocol: 'https', hostname: '**.kakaocdn.net' },
      { protocol: 'https', hostname: '**.banksalad.com' },
      { protocol: 'https', hostname: '**.oliveyoung.tech' },
      { protocol: 'https', hostname: '**.medium.com' },
      { protocol: 'https', hostname: '**.kakaopay.com' },
      { protocol: 'https', hostname: '**.naver.com' },
      { protocol: 'https', hostname: '**.daumcdn.net' },
      { protocol: 'https', hostname: '**.gmarket.com' },
      { protocol: 'https', hostname: '**.musinsa.com' },
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

'use client'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface RecommendedPost {
  title: string
  logo: string
  color: string
  borderColor: string
}

interface AIRecommendedPostsProps {
  posts: RecommendedPost[]
}

export default function AIRecommendedPosts({ posts }: AIRecommendedPostsProps) {
  return (
    <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-2xl">
      {/* 헤더 섹션 - AI 아이콘과 그라데이션 배경 */}
      <div className="px-5 py-5 border-b border-border/50 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-[15px] font-bold text-foreground tracking-tight">AI Personalized</CardTitle>
              <p className="text-[11px] font-bold text-primary/60 uppercase tracking-widest mt-0.5">Recommended for you</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 본문 섹션 */}
      <CardContent className="px-3 py-2">
        <div className="space-y-0.5">
          {posts.map((post, index) => (
            <div key={index} className="group cursor-pointer p-1">
              <div className="flex items-center gap-3.5 p-2.5 rounded-xl group-hover:bg-accent/50 transition-all duration-300 border border-transparent group-hover:border-border/50">
                {/* 순위 표시 - AI 테마 */}
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-[11px] font-black group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    {index + 1}
                  </div>
                </div>
                
                {/* 회사 로고 */}
                <div className="w-9 h-9 rounded-xl bg-background border border-border group-hover:border-primary/30 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm transition-colors">
                  <Image
                    src={post.logo}
                    alt="Company logo"
                    width={36}
                    height={36}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
                
                {/* 제목 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-foreground font-bold leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2 tracking-tight">
                    {post.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

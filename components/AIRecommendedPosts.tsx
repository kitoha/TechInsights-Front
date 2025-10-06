'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

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
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* 헤더 섹션 - AI 아이콘과 그라데이션 배경 */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* AI 아이콘 */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">🤖 AI 맞춤 추천</CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">당신을 위한 맞춤 콘텐츠</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 본문 섹션 */}
      <CardContent className="px-4 py-3">
        <div className="space-y-1">
          {posts.map((post, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
                {/* 순위 표시 - AI 테마 */}
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>
                
                {/* 회사 로고 */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                  <Image
                    src={post.logo}
                    alt="Company logo"
                    width={32}
                    height={32}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                
                {/* 제목 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 line-clamp-2">
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

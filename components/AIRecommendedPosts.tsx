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

import SidebarListCard from "./SidebarListCard"

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
    <SidebarListCard
      title="AI Picks"
      iconType="ai"
      items={posts}
      itemRender={(post, index) => (
        <div key={index} className="flex items-start space-x-3 group cursor-pointer">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
          <p className="text-[14px] font-bold text-foreground/80 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </p>
        </div>
      )}
    />
  )
}

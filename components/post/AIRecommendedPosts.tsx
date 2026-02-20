'use client'
import Link from "next/link"
import SidebarListCard from "@/components/layout/SidebarListCard"
import { LogoImage } from "@/components/company/LogoImage"

interface RecommendedPost {
  postId: string
  title: string
  logoImageName: string
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
        <Link key={index} href={`/post/${post.postId}`} className="group cursor-pointer flex items-center space-x-3 py-1 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-lg px-1 -mx-1 transition-colors">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {post.logoImageName && post.logoImageName.trim() !== '' ? (
              <LogoImage
                src={`/logos/${post.logoImageName}`}
                alt={post.title}
                width={20}
                height={20}
                className="object-contain w-5 h-5"
              />
            ) : (
              <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.85 8.65L22 9.24L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.24L9.15 8.65L12 2Z"/>
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground/95 leading-snug line-clamp-2">
              {post.title}
            </p>
          </div>
        </Link>
      )}
    />
  )
}

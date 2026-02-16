'use client'
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Sidebar } from "@/components/Sidebar";

interface Post {
  id: string;
  companyName: string;
  title: string;
  preview?: string;
  description?: string;
  content: string;
  url: string;
  publishedAt: string;
  thumbnail?: string;
  logoImageName?: string;
  categories?: string[];
  viewCount?: number;
}

interface TrendingPost {
  logoImage: string;
  title: string;
  viewCount: number;
}

interface Company {
  name: string;
  logoImage: string;
}

interface RecommendedPost {
  postId: string;
  title: string;
  logoImageName: string;
}

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

interface PostDetailFadeProps {
  post: Post;
  trendingPosts: TrendingPost[];
  companies: Company[];
  recommendedPosts: RecommendedPost[];
}

export default function PostDetailFade({ post, trendingPosts, companies, recommendedPosts }: PostDetailFadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayViewCount, setDisplayViewCount] = useState<number | null>(null);

  // Split content into summary and main content
  const splitContent = (content: string) => {
    const lines = content.split('\n');
    const summaryLines: string[] = [];
    const mainLines: string[] = [];
    let foundFirstHeading = false;

    for (const line of lines) {
      // Check if line is a heading (starts with #)
      if (line.trim().startsWith('#') && line.trim().length > 1) {
        foundFirstHeading = true;
      }

      if (foundFirstHeading) {
        mainLines.push(line);
      } else {
        summaryLines.push(line);
      }
    }

    return {
      summary: summaryLines.join('\n').trim() || content.substring(0, 500),
      main: mainLines.join('\n').trim()
    };
  };

  const { summary, main } = splitContent(post?.content || '');
  const summaryText = (post.preview && post.preview.trim()) || summary;
  const mainContent = main || post.content;

  useEffect(() => {
    if (post) {
      const t = setTimeout(() => setIsLoaded(true), 200);
      return () => clearTimeout(t);
    }
  }, [post]);

  // 상세 페이지에서 보여줄 조회수(UX용): 0 또는 미집계면 최소 1회로 보정
  useEffect(() => {
    if (!post) {
      setDisplayViewCount(null);
      return;
    }

    if (typeof post.viewCount === "number" && post.viewCount > 0) {
      setDisplayViewCount(post.viewCount);
    } else {
      // 조회수 정보가 없거나 0이면, 사용자가 들어온 시점부터는 최소 1회로 보여줌
      setDisplayViewCount(1);
    }
  }, [post]);

  useEffect(() => {
    if (!post?.id) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        console.warn('NEXT_PUBLIC_API_URL is not configured; skip view recording');
        return;
      }

      fetch(`${baseUrl}/api/v1/posts/${post.id}/view`, {
        method: 'POST',
        signal: controller.signal,
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Failed to record post view:', error);
        }
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [post?.id]);

  return (
    <div className="relative">
      {/* Skeleton */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="bg-[#f4f6f8] dark:bg-gray-900 min-h-screen">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4 lg:py-8">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] xl:gap-6">
              <div className="xl:col-span-1">
                <SkeletonBox className="w-16 h-6 mb-3 rounded-md" />
                <div className="flex items-center space-x-2 mb-2">
                  <SkeletonBox className="w-12 h-3" />
                  <SkeletonBox className="w-3 h-3" />
                  <SkeletonBox className="w-20 h-3" />
                </div>
                <SkeletonBox className="w-24 h-4 mb-5" />
                <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="px-5 sm:px-7 lg:px-10 pt-7 pb-5">
                      <SkeletonBox className="w-3/4 h-10 mb-4" />
                      <div className="flex items-center gap-3">
                        <SkeletonBox className="w-6 h-6 rounded-full" />
                        <SkeletonBox className="w-32 h-3" />
                        <SkeletonBox className="w-20 h-3" />
                        <SkeletonBox className="w-16 h-3" />
                      </div>
                    </div>
                    <div className="px-5 sm:px-7 lg:px-10">
                      <SkeletonBox className="w-full aspect-video rounded-xl" />
                    </div>
                    <div className="px-5 sm:px-7 lg:px-10 py-7 space-y-4">
                      <SkeletonBox className="w-full h-8 rounded-lg" />
                      {[1, 2, 3, 4].map((i) => (
                        <SkeletonBox key={i} className="w-full h-4" />
                      ))}
                      <SkeletonBox className="w-2/3 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="xl:col-span-1 space-y-4">
                <SkeletonBox className="w-full h-48 rounded-xl" />
                <SkeletonBox className="w-full h-36 rounded-xl" />
                <SkeletonBox className="w-full h-32 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Real Content */}
      <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {post && (
          <div className="bg-[#f4f6f8] dark:bg-gray-900 min-h-full">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4 lg:py-8">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] xl:gap-6">
              {/* Main Content Area */}
              <div className="xl:col-span-1">
              {/* Header Navigation Area */}
              <div className="mb-6 space-y-4">
                {/* Top Row: Breadcrumb & Back Button */}
                <div className="flex items-center justify-between">
                  {/* Breadcrumb */}
                  <nav className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Link
                      href="/"
                      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Home</span>
                    </Link>
                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="px-2.5 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {post.categories && post.categories.length > 0 ? post.categories[0] : 'Blog'}
                    </span>
                  </nav>

                  {/* Back Button */}
                  <button
                    onClick={() => window.history.back()}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to list</span>
                  </button>
                </div>

                {/* Category Tags */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {post.categories.map((category, idx) => (
                      <Link
                        key={idx}
                        href={`/?category=${category}`}
                        className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-500/20 dark:hover:to-blue-600/20 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Article Card */}
              <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <CardContent className="p-0">
                  {/* Article Header Section */}
                  <div className="px-5 sm:px-7 lg:px-10 pt-7 pb-5">
                    {/* Article Title */}
                    <h1 className="text-[34px] sm:text-[40px] lg:text-[44px] font-bold text-gray-900 dark:text-gray-100 mb-4 leading-[1.15] tracking-tight">
                      {post.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[12px]">
                      <div className="flex items-center space-x-2.5">
                        {post.logoImageName && (
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <OptimizedImage
                              src={`/logos/${post.logoImageName}`}
                              alt={post.companyName}
                              width={24}
                              height={24}
                              className="w-full h-full object-contain"
                              fallbackSrc="/placeholder.svg"
                            />
                          </div>
                        )}
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{post.companyName} Engineering</span>
                      </div>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <time className="text-gray-600 dark:text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-gray-600 dark:text-gray-400">{Math.ceil(post.content.length / 500)} min read</span>
                      {displayViewCount !== null && displayViewCount > 0 && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{displayViewCount.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Hero Image Section */}
                  <div className="px-5 sm:px-7 lg:px-10">
                    <div className={`relative w-full aspect-video overflow-hidden rounded-xl ${post.thumbnail ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gradient-to-br from-[#2665ff] via-[#2452db] to-[#1b3dbe]'}`}>
                      {post.thumbnail ? (
                        <OptimizedImage
                          src={post.thumbnail}
                          alt={post.title}
                          width={1200}
                          height={750}
                          className="w-full h-full object-contain"
                          fallbackSrc="/placeholder.svg"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full p-16">
                          <OptimizedImage
                            src={post.logoImageName ? `/logos/${post.logoImageName}` : "/placeholder.svg"}
                            alt={post.companyName}
                            width={400}
                            height={400}
                            className="w-full h-full max-w-sm object-contain opacity-85 drop-shadow-2xl"
                            fallbackSrc="/placeholder.svg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-5 sm:px-7 lg:px-10 py-7">
                    {/* AI Summary Header */}
                    <div className="mb-7">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-5 py-2.5">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 2L8.5 7.5 3 9l5.5 1.5L10 16l1.5-5.5L17 9l-5.5-1.5L10 2z"/>
                          <path d="M17.5 13l-.75 2.25L14.5 16l2.25.75.75 2.25.75-2.25L20.5 16l-2.25-.75L17.5 13z"/>
                          <path d="M6 13l-.5 1.5L4 15l1.5.5L6 17l.5-1.5L8 15l-1.5-.5L6 13z"/>
                        </svg>
                        <span className="text-[15px] font-semibold text-blue-600 dark:text-blue-400">AI Summary</span>
                      </span>
                    </div>

                    {/* Key Summary */}
                    {summaryText && (
                      <div className="mb-9">
                        <div className="prose prose-sm max-w-none dark:prose-invert
                          prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:text-[14px] prose-p:leading-6 prose-p:mb-3
                          prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1.5
                          prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-li:text-[14px] prose-li:leading-6
                          prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {summaryText}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Main Article Content */}
                    {mainContent && (
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                        <div className="prose prose-base max-w-none dark:prose-invert
                          prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold prose-headings:tracking-tight
                          prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-10 prose-h1:first:mt-0
                          prose-h2:text-[32px] prose-h2:mb-4 prose-h2:mt-10 prose-h2:first:mt-0
                          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
                          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:text-[15px] prose-p:leading-7 prose-p:mb-5
                          prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                          prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                          prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-[15px] prose-li:leading-7
                          prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:rounded-lg prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-blockquote:not-italic
                          prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
                          prose-pre>code:bg-transparent prose-pre>code:p-0 prose-pre>code:text-sm prose-pre>code:text-gray-100
                          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
                          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                          prose-img:rounded-lg prose-img:my-6
                          prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-8
                          prose-table:border-collapse prose-table:w-full prose-table:my-6
                          prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:px-4 prose-th:py-2 prose-th:text-left
                          prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:px-4 prose-td:py-2">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {mainContent}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Bottom Actions */}
                  <div className="px-5 sm:px-7 lg:px-10 pb-7">
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      {/* Tags */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.map((category, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-2.5 py-1 text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md"
                            >
                              #{category}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Social Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>Like</span>
                          </button>

                          <button className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            <span>Share</span>
                          </button>
                        </div>

                        <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" aria-label="Bookmark">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
              {/* End Main Content Area */}

              {/* Right Sidebar - 기존 Sidebar 재사용 */}
              <div className="xl:col-span-1">
                <div className="sticky top-20">
                  <Sidebar
                    trendingPosts={trendingPosts}
                    companies={companies}
                    recommendedPosts={recommendedPosts}
                  />
                </div>
              </div>
              {/* End Right Sidebar */}

            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

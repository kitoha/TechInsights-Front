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
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(0,800px)_1fr_minmax(0,320px)_1fr] xl:gap-8">
              <div className="xl:col-start-2 xl:col-span-1">
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
              <div className="xl:col-start-4 xl:col-span-1 space-y-4">
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
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(0,800px)_1fr_minmax(0,320px)_1fr] xl:gap-8">
              {/* Main Content Area */}
              <div className="xl:col-start-2 xl:col-span-1">
              {/* Category Tab */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  {post.categories.map((category, idx) => (
                    <Link
                      key={idx}
                      href={`/?category=${category}`}
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}

              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  Home
                </Link>
                <span>›</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {post.categories && post.categories.length > 0 ? post.categories[0] : 'Blog'}
                </span>
              </nav>

              {/* Back Button */}
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center space-x-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to list</span>
              </button>

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
                      <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3.5L2 7.5l8 4 8-4-8-4z"/>
                            <path d="M2 12.5l8 4 8-4"/>
                            <path d="M2 10l8 4 8-4"/>
                          </svg>
                        </div>
                        <h2 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">AI Summary</h2>
                      </div>
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
                          prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
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
              <div className="xl:col-start-4 xl:col-span-1">
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

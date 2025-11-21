'use client'
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import ReactMarkdown from "react-markdown";

interface Post {
  id: string;
  companyName: string;
  title: string;
  description?: string;
  content: string;
  url: string;
  publishedAt: string;
  thumbnail?: string;
  logoImageName?: string;
  categories?: string[];
  viewCount?: number;
}

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export default function PostDetailFade({ post }: { post: Post }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [displayViewCount, setDisplayViewCount] = useState<number | null>(null);

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
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <SkeletonBox className="w-16 h-4" />
              <SkeletonBox className="w-4 h-4" />
              <SkeletonBox className="w-32 h-4" />
            </div>
            <SkeletonBox className="w-32 h-6 mb-6" />
            <Card className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
              <CardContent className="p-8">
                <SkeletonBox className="w-2/3 h-10 mb-4" />
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-8">
                  <SkeletonBox className="w-20 h-4" />
                  <SkeletonBox className="w-4 h-4" />
                  <SkeletonBox className="w-32 h-4" />
                </div>
                <SkeletonBox className="mb-8 w-full h-96" />
                <div className="mb-8 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonBox key={i} className="w-full h-4" />
                  ))}
                </div>
                <SkeletonBox className="w-40 h-10 mb-8" />
                <div className="mb-8">
                  <SkeletonBox className="w-24 h-6 mb-2" />
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <SkeletonBox key={i} className="w-16 h-6" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-border">
                  <SkeletonBox className="w-20 h-8" />
                  <SkeletonBox className="w-20 h-8" />
                </div>
                <div>
                  <SkeletonBox className="w-32 h-6 mb-6" />
                  <Card className="border-border mb-6">
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <SkeletonBox className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-4">
                          <SkeletonBox className="w-full h-20" />
                          <div className="flex justify-end">
                            <SkeletonBox className="w-20 h-8" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-4 mb-4">
                      <SkeletonBox className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <SkeletonBox className="w-32 h-4" />
                        <SkeletonBox className="w-full h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Real Content */}
      <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {post && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 sm:space-x-4 text-sm mb-6 sm:mb-8">
                <Link 
                  href="/" 
                  className="flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium hidden sm:inline">홈</span>
                </Link>
                
                {/* Custom Separator */}
                <div className="flex items-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 flex items-center justify-center">
                    <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">현재 페이지</span>
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm max-w-32 sm:max-w-md truncate">{post.title}</span>
                </div>
              </nav>
              {/* Back Button */}
              <button 
                onClick={() => window.history.back()} 
                className="inline-flex items-center space-x-2 sm:space-x-3 px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-6 sm:mb-8 group transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium text-sm sm:text-base">목록으로 돌아가기</span>
              </button>
              {/* Article Header */}
              <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-3xl transition-all duration-300">
                <CardContent className="p-4 sm:p-6 lg:p-10">
                  {/* Article Header with Enhanced Design */}
                  <div className="mb-8 sm:mb-12 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl -m-2 sm:-m-4"></div>
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                      {/* Title with Enhanced Typography */}
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-[1.1] tracking-tight">
                        <span className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-slate-200 dark:via-slate-400 dark:to-slate-200 bg-clip-text text-transparent">
                          {post.title}
                        </span>
                      </h1>
                      
                      {/* Meta Information with Enhanced Design */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                          <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 px-3 py-2 sm:px-4 rounded-full">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-foreground text-sm sm:text-base">{post.companyName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-sm sm:text-base">{new Date(post.publishedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>약 {Math.ceil(post.content.length / 500)}분</span>
                          </div>

                          {displayViewCount !== null && displayViewCount > 0 && (
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>{displayViewCount.toLocaleString()}회</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Hero Image */}
                  <div className="mb-8 sm:mb-12">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      <Image
                        src={imageError ? `/logos/${post.logoImageName || 'placeholder.svg'}` : (post.thumbnail || "/placeholder.svg")}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-cover transition-transform duration-500 hover:scale-105"
                        onError={() => setImageError(true)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                  {/* Article Content with Enhanced Design */}
                  <div className="relative mb-12 sm:mb-16">
                    {/* Content Background */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 -m-3 sm:-m-6"></div>
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                      {/* AI Summary Header */}
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-white font-bold text-sm sm:text-lg">AI 요약</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Markdown Content */}
                      <div className="markdown-body prose prose-sm sm:prose-base lg:prose-xl max-w-none dark:prose-invert 
                        prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base lg:prose-p:text-lg
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-foreground prose-strong:font-bold
                        prose-code:text-foreground prose-code:bg-muted/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm prose-code:font-mono
                        prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:p-3 sm:prose-pre:p-6
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:rounded-r-xl
                        prose-ul:space-y-1 sm:prose-ul:space-y-2 prose-ol:space-y-1 sm:prose-ol:space-y-2
                        prose-li:text-foreground/90 prose-li:leading-relaxed
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-table:border-collapse prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:text-xs sm:prose-table:text-sm
                        prose-th:bg-muted/50 prose-th:font-semibold prose-th:border prose-th:border-border prose-th:p-2 sm:prose-th:p-3
                        prose-td:border prose-td:border-border prose-td:p-2 sm:prose-td:p-3">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  {/* View Original Button */}
                  <div className="mb-8 sm:mb-12">
                    <Button variant="outline" asChild className="group border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 w-full sm:w-auto">
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2">
                        <span>원문 보기</span>
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </Button>
                  </div>
                  {/* Tags */}
                  <div className="mb-8 sm:mb-12">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">태그</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <Badge variant="secondary" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200">
                        {post.companyName}
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200">
                        기술
                      </Badge>
                    </div>
                  </div>
                  {/* Like and Share */}
                  <div className="flex items-center justify-center sm:justify-start space-x-6 sm:space-x-8 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-border/50">
                    <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm sm:text-base">좋아요</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span className="text-sm sm:text-base">공유</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

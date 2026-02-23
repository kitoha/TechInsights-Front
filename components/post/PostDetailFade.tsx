'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { OptimizedImage } from "@/components/common/OptimizedImage";

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
  recommendedPosts: RecommendedPost[];
}

export default function PostDetailFade({ post, recommendedPosts }: PostDetailFadeProps) {
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
  const sourceHost = post.url ? (() => {
    try {
      return new URL(post.url).hostname.replace(/^www\./, '');
    } catch {
      return "";
    }
  })() : "";

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
        <div className="bg-[#f6f7f9] dark:bg-gray-950 min-h-screen">
          <div className="max-w-[760px] mx-auto px-4 py-8 lg:py-12">
            <SkeletonBox className="h-12 w-5/6 mb-5" />
            <SkeletonBox className="h-5 w-64 mb-8" />
            <SkeletonBox className="w-full aspect-[16/9] rounded-2xl mb-8" />
            <SkeletonBox className="h-8 w-32 mb-4" />
            <div className="space-y-3 mb-8">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-2/3" />
            </div>
            <div className="space-y-4">
              <SkeletonBox className="h-6 w-48" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-11/12" />
            </div>
          </div>
        </div>
      </div>
      {/* Real Content */}
      <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {post && (
          <div className="bg-[#f6f7f9] dark:bg-gray-950 min-h-full">
            <div className="max-w-[760px] mx-auto px-4 py-8 lg:py-12">
              <article>
                <div className="pb-6">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-3">
                    {post.categories && post.categories.length > 0 && (
                      <Link href={`/?category=${post.categories[0]}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {post.categories[0]}
                      </Link>
                    )}
                    <span>•</span>
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </time>
                  </div>
                  <h1 className="text-center text-[30px] sm:text-[38px] lg:text-[44px] font-bold text-gray-900 dark:text-gray-100 leading-[1.12] tracking-tight">
                    {post.title}
                  </h1>
                </div>

                <div>
                  <div className={`relative w-full aspect-[16/9] overflow-hidden rounded-xl ${post.thumbnail ? '' : 'bg-gradient-to-br from-[#2665ff] via-[#2452db] to-[#1b3dbe]'}`}>
                    {post.thumbnail ? (
                      <OptimizedImage
                        src={post.thumbnail}
                        alt={post.title}
                        width={1200}
                        height={750}
                        className="w-full h-full object-cover"
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

                <div className="py-7 lg:py-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                      <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 text-[12px] leading-5 text-center">AI</span>
                      <h2 className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">핵심요약</h2>
                    </div>
                    {post.url && (
                      <div className="flex items-center gap-2">
                        {sourceHost && (
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{sourceHost}</span>
                        )}
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                          <span>원문 보기</span>
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>

                  {summaryText && (
                    <div className="mb-9 rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900/40">
                      <div className="prose prose-sm max-w-none dark:prose-invert
                        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:text-[14px] prose-p:leading-6 prose-p:mb-2.5
                        prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1.5
                        prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-[14px] prose-li:leading-6
                        prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {summaryText}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {mainContent && (
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                      <div className="prose prose-base max-w-none dark:prose-invert
                        prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold prose-headings:tracking-tight
                        prose-h1:text-[30px] prose-h1:mb-4 prose-h1:mt-10 prose-h1:first:mt-0
                        prose-h2:text-[28px] prose-h2:mb-4 prose-h2:mt-10 prose-h2:first:mt-0
                        prose-h3:text-[24px] prose-h3:mb-3 prose-h3:mt-8
                        prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:text-[15px] prose-p:leading-7 prose-p:mb-5
                        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                        prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                        prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:text-[15px] prose-li:leading-7
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:rounded-r-lg prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:not-italic
                        prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
                        prose-pre>code:bg-transparent prose-pre>code:p-0 prose-pre>code:text-sm prose-pre>code:text-gray-100
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-lg prose-img:my-6
                        prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-8
                        prose-table:block prose-table:overflow-x-auto prose-table:my-6
                        prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:px-4 prose-th:py-2 prose-th:text-left
                        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:px-4 prose-td:py-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {mainContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map((category, index) => (
                          <Link
                            key={index}
                            href={`/?category=${category}`}
                            className="inline-flex"
                          >
                            <Badge
                              variant="secondary"
                              className="px-2.5 py-1 text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              #{category}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[12px] text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2.5">
                        <span>{post.companyName}</span>
                        <span>·</span>
                        <span>{Math.max(1, Math.ceil(post.content.length / 500))}분 읽기</span>
                        {displayViewCount !== null && (
                          <>
                            <span>·</span>
                            <span>조회 {displayViewCount.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          <span>좋아요</span>
                        </button>
                        <span>·</span>
                        <button className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          <span>공유</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {recommendedPosts.length > 0 && (
                <section className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">이런 글도 함께 읽어보세요</h3>
                    <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      전체 보기
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedPosts.slice(0, 2).map((recommended) => (
                      <Link
                        key={recommended.postId}
                        href={`/post/${recommended.postId}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:border-gray-300 hover:shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                          <OptimizedImage
                            src={recommended.logoImageName ? `/logos/${recommended.logoImageName}` : "/placeholder.svg"}
                            alt={recommended.title}
                            width={28}
                            height={28}
                            className="w-7 h-7 object-contain"
                            fallbackSrc="/placeholder.svg"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2">
                          {recommended.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

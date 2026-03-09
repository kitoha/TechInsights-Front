'use client'
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { LogoImage } from "@/components/company/LogoImage";
import { apiPost } from "@/lib/shared/api";
import { togglePostBookmark } from "@/lib/bookmarks";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarkContext";
import { ArrowLeft, Bookmark, ChevronRight, Heart, Share2, Sparkles } from "lucide-react";

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
  blogUrl?: string;
  isBookmarked?: boolean;
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
  const { isLoggedIn } = useAuth();
  const { bookmarkedPostIds, markPostBookmark } = useBookmarks();
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayViewCount, setDisplayViewCount] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(!!post.isBookmarked);
  const [isBookmarkPending, setIsBookmarkPending] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const splitContent = (content: string) => {
    const lines = content.split('\n');
    const summaryLines: string[] = [];
    const mainLines: string[] = [];
    let foundFirstHeading = false;

    for (const line of lines) {
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

  useEffect(() => {
    if (!post) {
      setDisplayViewCount(null);
      return;
    }

    if (typeof post.viewCount === "number" && post.viewCount > 0) {
      setDisplayViewCount(post.viewCount);
    } else {
      setDisplayViewCount(1);
    }
  }, [post]);

  useEffect(() => {
    if (!post?.id) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      apiPost(`/api/v1/posts/${post.id}/view`, undefined, {
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

  useEffect(() => {
    setIsBookmarked(!!post.isBookmarked);
    setIsBookmarkPending(false);
  }, [post.id, post.isBookmarked]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsBookmarked(false);
      return;
    }

    setIsBookmarked(bookmarkedPostIds.has(post.id));
  }, [bookmarkedPostIds, isLoggedIn, post.id]);

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (isBookmarkPending) {
      return;
    }

    const previousBookmarked = isBookmarked;
    setIsBookmarkPending(true);
    setIsBookmarked(!previousBookmarked);
    markPostBookmark(post.id, !previousBookmarked);

    try {
      const result = await togglePostBookmark(post.id);
      setIsBookmarked(result.bookmarked);
      markPostBookmark(post.id, result.bookmarked);
    } catch (error: unknown) {
      setIsBookmarked(previousBookmarked);
      markPostBookmark(post.id, previousBookmarked);
      if (isAxiosError(error) && error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("[PostDetailFade] bookmark toggle failed", error);
      }
    } finally {
      setIsBookmarkPending(false);
    }
  };

  return (
    <div className="relative">
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="bg-[#f6f7f9] dark:bg-gray-950 min-h-screen">
          <div className="max-w-[740px] mx-auto px-4 py-8 lg:py-12">
            <SkeletonBox className="h-8 w-40 mb-8" />
            <SkeletonBox className="h-12 w-5/6 mb-4" />
            <SkeletonBox className="h-4 w-48 mb-8" />
            <SkeletonBox className="w-full aspect-[16/9] rounded-2xl mb-8" />
            <SkeletonBox className="h-6 w-28 mb-4" />
            <div className="space-y-3 mb-10">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <SkeletonBox className="h-9 w-64" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-11/12" />
            </div>
          </div>
        </div>
      </div>

      <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {post && (
          <div className="min-h-full bg-[#f3f4f6] dark:bg-gray-950">
            <div className="max-w-[660px] mx-auto px-4 py-7 lg:py-10">
              <article>
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>뒤로가기</span>
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-600 transition-colors"
                  >
                    <span>목록으로</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="pb-6">
                  <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    {post.categories && post.categories.length > 0 ? (
                      <Link
                        href={`/?category=${post.categories[0]}`}
                        className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        {post.categories[0]}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        Blog
                      </span>
                    )}
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </time>
                  </div>
                  <h1 className="mx-auto max-w-[620px] text-center text-[28px] sm:text-[33px] lg:text-[38px] font-semibold text-gray-900 dark:text-gray-100 leading-[1.16] tracking-tight">
                    {post.title}
                  </h1>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-gray-600 dark:text-gray-300">
                    <div className="h-6 w-6 rounded-full bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 overflow-hidden flex items-center justify-center">
                      <LogoImage
                        src={post.logoImageName ? `/logos/${post.logoImageName}` : "/placeholder.svg"}
                        alt={post.companyName}
                        width={14}
                        height={14}
                        className="h-3.5 w-3.5 object-contain"
                      />
                    </div>
                    <span className="font-medium tracking-tight">{post.companyName} Engineering Team</span>
                  </div>
                </div>

                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
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
                    <div className="w-full h-full">
                      {post.logoImageName ? (
                        <OptimizedImage
                          src={`/logos/${post.logoImageName}`}
                          alt={post.companyName}
                          fill
                          className="object-cover"
                          fallbackSrc="/placeholder.svg"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                          <span className="text-5xl font-bold text-blue-200 dark:text-blue-900/30">{post.companyName[0]}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="py-6 lg:py-7">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <h2>핵심요약</h2>
                    </div>
                    {post.url && (
                      <div className="flex items-center gap-2">
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
                    <div className="mb-8 rounded-lg border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-4 dark:border-blue-800/60 dark:bg-gradient-to-br dark:from-blue-950/35 dark:via-slate-900 dark:to-slate-900">
                      <div className="prose prose-sm max-w-none dark:prose-invert
                        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:text-[13px] prose-p:leading-6 prose-p:mb-2.5
                        prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-1.5
                        prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-[13px] prose-li:leading-6 prose-li:marker:text-blue-500
                        prose-strong:text-gray-900 dark:prose-strong:text-gray-100">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {summaryText}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {mainContent && (
                    <div className="border-t border-gray-200/90 dark:border-gray-800 pt-7">
                      <div className="prose prose-base max-w-none dark:prose-invert
                        font-sans
                        prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold prose-headings:tracking-tight
                        prose-headings:font-sans
                        prose-h1:text-[30px] prose-h1:mb-3 prose-h1:mt-10 prose-h1:first:mt-0
                        prose-h2:text-[31px] prose-h2:mb-3 prose-h2:mt-10 prose-h2:first:mt-0
                        prose-h3:text-[24px] prose-h3:mb-3 prose-h3:mt-8
                        prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:text-[16px] prose-p:leading-8 prose-p:tracking-[0.005em] prose-p:mb-5
                        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1.5
                        prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1.5
                        prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:text-[16px] prose-li:leading-8
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {mainContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 border-t border-gray-200 pt-5 dark:border-gray-800">
                    {post.categories && post.categories.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.categories.map((category, index) => (
                          <Link
                            key={index}
                            href={`/?category=${category}`}
                            className="inline-flex"
                          >
                            <Badge
                              variant="secondary"
                              className="rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              #{category}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2.5">
                        <span>{post.companyName}</span>
                        {displayViewCount !== null && (
                          <>
                            <span>·</span>
                            <span>조회 {displayViewCount.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:hover:text-gray-200" aria-label="좋아요">
                          <Heart className="h-3.5 w-3.5" />
                          <span className="text-[10px]">좋아요</span>
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:hover:text-gray-200" aria-label="공유">
                          <Share2 className="h-3.5 w-3.5" />
                          <span className="text-[10px]">공유</span>
                        </button>
                        <button
                          title={isBookmarked ? "저장됨" : "저장"}
                          className={`inline-flex items-center justify-center rounded-full p-2 transition-all duration-200 ${isBookmarked
                            ? "bg-blue-100 text-blue-600 shadow-sm dark:bg-blue-500/20 dark:text-blue-400"
                            : "bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"} ${!isBookmarkPending ? "hover:scale-105 active:scale-95" : ""} ${isBookmarkPending ? "cursor-wait opacity-60" : "cursor-pointer"}`}
                          aria-label={isBookmarked ? "북마크 해제" : "북마크"}
                          onClick={handleBookmarkClick}
                          disabled={isBookmarkPending}
                        >
                          <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} strokeWidth={isBookmarked ? 0 : 2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <section className="mt-4 rounded-lg border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
                      <LogoImage
                        src={post.logoImageName ? `/logos/${post.logoImageName}` : "/placeholder.svg"}
                        alt={post.companyName}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-gray-900 dark:text-gray-100">
                        {post.companyName} Engineering Team
                      </p>
                      <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                        기술 인사이트를 전달하는 공식 채널
                      </p>
                    </div>
                  </div>
                  {post.blogUrl ? (
                    <a
                      href={post.blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full border border-gray-300 px-3 py-1 text-[10px] font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      기술블로그로 가기
                    </a>
                  ) : (
                    <button
                      disabled
                      className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-[10px] font-medium text-gray-400 cursor-not-allowed dark:border-gray-800 dark:text-gray-500"
                    >
                      기술블로그 링크 예정
                    </button>
                  )}
                </div>
              </section>

              {recommendedPosts.length > 0 && (
                <section className="mt-4.5">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">You might also like</h3>
                    <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      View all
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {recommendedPosts.slice(0, 2).map((recommended) => (
                      <Link
                        key={recommended.postId}
                        href={`/post/${recommended.postId}`}
                        className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-2.5 hover:border-gray-300 transition-all dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                      >
                        <div className="h-9 w-9 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
                          <LogoImage
                            src={recommended.logoImageName ? `/logos/${recommended.logoImageName}` : "/placeholder.svg"}
                            alt={recommended.title}
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        </div>
                        <p className="line-clamp-2 text-[13px] font-medium leading-5 text-gray-800 dark:text-gray-100">
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
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}

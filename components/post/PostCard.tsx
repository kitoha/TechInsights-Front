"use client";

import Link from "next/link";
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import type { Post } from "@/lib/posts/types";

interface PostCardProps {
    post: Post;
    onToggleBookmark: (postId: string) => void;
    disabled?: boolean;
}

export const PostCard = memo(function PostCard({
    post,
    onToggleBookmark,
    disabled = false,
}: PostCardProps) {
    const thumbnail = post.thumbnail || post.image;
    const isBookmarked = post.isBookmarked ?? false;

    return (
        <Card className="group relative bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md">
            {/* Bookmark Ribbon */}
            <div className="absolute top-0 right-6 z-10">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onToggleBookmark(post.id)}
                    className={`relative group/bookmark ${disabled ? "cursor-wait opacity-60" : "cursor-pointer"}`}
                    aria-label={isBookmarked ? `${post.title} 북마크 해제` : `${post.title} 북마크 추가`}
                >
                    <svg
                        width="28"
                        height="38"
                        viewBox="0 0 24 32"
                        fill="none"
                        className={`transition-all duration-300 drop-shadow-sm ${isBookmarked
                            ? "fill-blue-600 stroke-blue-600"
                            : "fill-gray-100/80 dark:fill-gray-700/80 stroke-gray-200 dark:stroke-gray-600 group-hover/bookmark:fill-blue-100 dark:group-hover/bookmark:fill-blue-900/30 group-hover/bookmark:stroke-blue-300"
                            }`}
                    >
                        <path d="M0 0H24V32L12 26L0 32V0Z" strokeWidth="1.5" strokeLinejoin="round" />
                        <path
                            d="M12 7l1.637 3.317L17.29 10.8l-2.645 2.578.625 3.636L12 15.3l-3.27 1.714.625-3.636L6.71 10.8l3.653-.483L12 7z"
                            fill={isBookmarked ? "white" : "currentColor"}
                            className={isBookmarked ? "" : "opacity-40 group-hover/bookmark:opacity-100"}
                        />
                    </svg>
                </button>
            </div>

            <Link href={`/post/${post.id}`}>
                <CardContent className="p-0">
                    <div className="flex items-start md:items-stretch gap-3 md:gap-5 px-3 md:px-5 py-4 min-h-[110px] md:h-[130px]">
                        {/* Thumbnail */}
                        {thumbnail ? (
                            <div className="relative w-28 h-[88px] md:h-full flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <OptimizedImage
                                    src={thumbnail}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500"
                                    fallbackSrc="/placeholder.svg"
                                />
                            </div>
                        ) : (
                            <div className="relative w-28 h-[88px] md:h-full flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                                {post.logoImageName ? (
                                    <div className="relative w-full h-full transition-transform duration-700 ease-out">
                                        <OptimizedImage
                                            src={`/logos/${post.logoImageName}`}
                                            alt={post.companyName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                                        <span className="text-3xl font-bold text-blue-200 dark:text-blue-900/30">{post.companyName[0]}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-4 h-4 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white">
                                        {post.logoImageName ? (
                                            <OptimizedImage
                                                src={`/logos/${post.logoImageName}`}
                                                alt={post.companyName}
                                                width={16}
                                                height={16}
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">
                                                {post.companyName[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300 truncate">{post.companyName}</span>
                                    <span className="text-[12px] text-gray-400 dark:text-gray-600">•</span>
                                    <span className="text-[12px] text-gray-500 dark:text-gray-500">
                                        {(() => {
                                            const date = new Date(post.publishedAt);
                                            return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
                                        })()}
                                    </span>
                                    {post.viewCount !== undefined && (
                                        <>
                                            <span className="hidden sm:inline text-[12px] text-gray-300 dark:text-gray-700">|</span>
                                            <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                <span>{post.viewCount} Views</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <h2 className="text-[18px] md:text-[19px] font-bold text-gray-900 dark:text-white line-clamp-2 md:truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                    {post.title}
                                </h2>

                                <p className="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 font-medium opacity-80">
                                    {post.description || post.preview}
                                </p>
                            </div>

                            {/* Bottom: Left Categories */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-3">
                                {post.categories?.slice(0, 3).map((cat) => (
                                    <span key={cat} className="px-2.5 py-1 bg-blue-50/50 dark:bg-blue-900/20 text-[10px] font-bold rounded-lg text-blue-600/80 dark:text-blue-400/80 uppercase tracking-tight border border-blue-100/50 dark:border-blue-800/20">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right Spacer for Ribbon */}
                        <div className="w-10 md:w-12 flex-shrink-0" />
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
});

"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import CategoryBadges from "@/components/CategoryBadges";
import Image from "next/image";
import { useState } from "react";

interface Post {
  id: string;
  companyName: string;
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt: string;
  logoImageName?: string;
  categories?: string[];
}

interface PostListProps {
  posts: Post[];
  totalPages: number;
  page: number;
  selectedCategory: string;
  categories: string[];
}

export default function PostList({ posts, totalPages, page, selectedCategory, categories }: PostListProps) {
  const maxVisible = 5;
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages, start + maxVisible);
  const pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);

  const handleTabClick = (category: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("category", category);
    params.set("page", "0");
    window.location.search = params.toString();
  };

  const handlePageClick = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("category", selectedCategory);
    params.set("page", String(p));
    window.location.search = params.toString();
  };

  const FallbackPostImage = ({ post }: { post: Post }) => {
    const initialSrc = post.image || "/placeholder.svg";
    const [imgSrc, setImgSrc] = useState<string>(initialSrc);

    const handleError = () => {
      if (post.logoImageName && !imgSrc.includes("/logos/")) {
        setImgSrc(`/logos/${post.logoImageName}`);
        return;
      }
      if (imgSrc !== "/placeholder.svg") {
        setImgSrc("/placeholder.svg");
      }
    };

    return (
      <Image
        src={imgSrc}
        alt={post.title}
        width={192}
        height={192}
        quality={90}
        className="w-full h-full object-cover rounded-lg"
        onError={handleError}
      />
    );
  };

  return (
    <>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={
              "px-4 py-2 rounded-full font-medium transition shadow-sm border cursor-pointer " +
              (selectedCategory === category
                ? "bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:text-white dark:border-blue-400"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:hover:border-blue-500")
            }
            onClick={() => handleTabClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {/* Latest Posts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest Posts</h2>
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-medium">데이터가 없습니다.</span>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardContent className="px-6 py-0">
                  <Link href={`/post/${post.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-6 flex flex-col min-h-[150px] justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {post.logoImageName && (
                                <Image
                                  src={`/logos/${post.logoImageName}`}
                                  alt={post.companyName}
                                  width={24}
                                  height={24}
                                  className="object-contain w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                />
                              )}
                              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{post.companyName}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{post.publishedAt}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{post.description}</p>
                        </div>
                        <CategoryBadges categories={post.categories || []} />
                      </div>
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <FallbackPostImage post={post} />
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="cursor-pointer" onClick={() => handlePageClick(page - 1)} aria-disabled={page <= 0} />
            </PaginationItem>
            {start > 0 && (
              <>
                <PaginationItem>
                  <PaginationLink className="cursor-pointer" onClick={() => handlePageClick(0)}>1</PaginationLink>
                </PaginationItem>
                {start > 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}
            {pageNumbers.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink className="cursor-pointer" onClick={() => handlePageClick(p)} isActive={p === page}>
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {end < totalPages && (
              <>
                {end < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink className="cursor-pointer" onClick={() => handlePageClick(totalPages - 1)}>{totalPages}</PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext className="cursor-pointer" onClick={() => handlePageClick(page + 1)} aria-disabled={page + 1 >= totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </>
  );
} 
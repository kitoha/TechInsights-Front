"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import CategoryBadges from "@/components/CategoryBadges";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

function PostSkeleton() {
  return (
    <div className="animate-pulse flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[150px]">
      <div className="flex-1 pr-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2" />
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-64 mb-4" />
        <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-32" />
      </div>
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg" />
    </div>
  );
}

export default function PostList({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 0;
    const categoryParam = searchParams.get("category") || categories[0];
    setPage(pageParam);
    setSelectedCategory(categoryParam);
  }, [searchParams, categories]);

  useEffect(() => {
    let ignore = false;
    async function fetchPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("size", "10");
        if (selectedCategory && selectedCategory !== "All") {
          params.set("category", selectedCategory);
        }
        const res = await fetch(`${API_URL}/api/v1/posts?${params.toString()}`);
        const data = await res.json();
        if (!ignore) {
          const mapped = (data.content || []).map((item: any) => ({
            id: item.id,
            companyName: item.companyName || "기타",
            title: item.title,
            description: item.preview
              ? item.preview.replace(/<[^>]+>/g, "")
              : "미리보기가 없습니다.",
            image: item.thumbnail || "/placeholder.svg?height=120&width=120",
            url: item.url,
            publishedAt: formatDate(item.publishedAt),
            logoImageName: item.logoImageName,
            categories: item.categories || [],
          }));
          setPosts(mapped);
          setTotalPages(data.totalPages || 1);
        }
      } catch (e) {
        if (!ignore) {
          setPosts([]);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchPosts();
    return () => { ignore = true; };
  }, [selectedCategory, page]);

  const maxVisible = 5;
  let start = Math.max(0, page - 2);
  let end = Math.min(totalPages, start + maxVisible);
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }
  const pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);

  const handleTabClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    params.set("page", "0");
    router.push(`?${params.toString()}`);
  };

  const handlePageClick = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", selectedCategory);
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={
              (selectedCategory === category
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700") +
              " cursor-pointer transition-colors"
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
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-medium">데이터가 없습니다.</span>
            </div>
          ) : (
            posts.map((post: any, index: number) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
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
                        <CategoryBadges categories={post.categories} />
                      </div>
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt=""
                          width={192}
                          height={192}
                          quality={90}
                          className="w-full h-full object-cover rounded-lg"
                        />
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
              <PaginationPrevious onClick={() => handlePageClick(page - 1)} aria-disabled={page <= 0} />
            </PaginationItem>
            {start > 0 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageClick(0)}>1</PaginationLink>
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
                <PaginationLink onClick={() => handlePageClick(p)} isActive={p === page}>
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
                  <PaginationLink onClick={() => handlePageClick(totalPages - 1)}>{totalPages}</PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageClick(page + 1)} aria-disabled={page + 1 >= totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </>
  );
} 
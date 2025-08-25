'use client'
import { useEffect, useState } from "react";
import PostList from "./PostList";
import { Card, CardContent } from "@/components/ui/card";

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export default function PostListFade(props: any) {
  const { posts } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const t = setTimeout(() => setIsLoaded(true), 200);
      return () => clearTimeout(t);
    } else {
      setIsLoaded(false);
    }
  }, [posts]);

  return (
    <div className="relative">
      {/* Skeleton */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <section className="mb-12 space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-6 flex flex-col min-h-[150px] justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <SkeletonBox className="w-6 h-6" />
                          <SkeletonBox className="w-16 h-4" />
                        </div>
                        <SkeletonBox className="w-20 h-4" />
                      </div>
                      <SkeletonBox className="w-40 h-6 mb-2" />
                      <SkeletonBox className="w-full h-4 mb-4" />
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((j) => (
                        <SkeletonBox key={j} className="w-12 h-6" />
                      ))}
                    </div>
                  </div>
                  <SkeletonBox className="w-24 h-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
      {/* Real List */}
      <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <PostList {...props} />
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            <div className="relative mb-6">
              <SkeletonBox className="h-12 w-full" />
            </div>
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
          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* AI 추천 게시물 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="px-4 py-3 pb-1">
                <div className="flex items-center gap-2">
                  <SkeletonBox className="w-2 h-2" />
                  <SkeletonBox className="w-24 h-6" />
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0 pb-3">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2.5 p-1.5">
                      <SkeletonBox className="w-5 h-5" />
                      <SkeletonBox className="w-9 h-9" />
                      <SkeletonBox className="flex-1 h-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* 랭킹 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <SkeletonBox className="w-32 h-6" />
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <SkeletonBox className="w-6 h-6" />
                      <SkeletonBox className="w-7 h-7" />
                      <SkeletonBox className="flex-1 h-4" />
                      <SkeletonBox className="w-12 h-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Featured Companies */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <SkeletonBox className="w-40 h-6" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center w-20">
                      <SkeletonBox className="w-10 h-10" />
                      <SkeletonBox className="w-16 h-4 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Top Companies by Posts */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <SkeletonBox className="w-40 h-6" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <SkeletonBox className="w-6 h-6" />
                      <SkeletonBox className="w-7 h-7" />
                      <SkeletonBox className="flex-1 h-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
  
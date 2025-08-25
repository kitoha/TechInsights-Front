import { Card, CardContent } from "@/components/ui/card";

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <SkeletonBox className="w-16 h-4" />
          <SkeletonBox className="w-4 h-4" />
          <SkeletonBox className="w-32 h-4" />
        </div>
        {/* Back Button */}
        <SkeletonBox className="w-32 h-6 mb-6" />
        {/* Article Header */}
        <Card className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <CardContent className="p-8">
            <SkeletonBox className="w-2/3 h-10 mb-4" /> {/* Title */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-8">
              <SkeletonBox className="w-20 h-4" />
              <SkeletonBox className="w-4 h-4" />
              <SkeletonBox className="w-32 h-4" />
            </div>
            {/* Hero Image */}
            <SkeletonBox className="mb-8 w-full h-96" />
            {/* Article Content */}
            <div className="mb-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBox key={i} className="w-full h-4" />
              ))}
            </div>
            {/* View Original Button */}
            <SkeletonBox className="w-40 h-10 mb-8" />
            {/* Tags */}
            <div className="mb-8">
              <SkeletonBox className="w-24 h-6 mb-2" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <SkeletonBox key={i} className="w-16 h-6" />
                ))}
              </div>
            </div>
            {/* Like and Share */}
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-border">
              <SkeletonBox className="w-20 h-8" />
              <SkeletonBox className="w-20 h-8" />
            </div>
            {/* Comments Section */}
            <div>
              <SkeletonBox className="w-32 h-6 mb-6" />
              {/* Add Comment */}
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
              {/* Comment List */}
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
  );
}
  
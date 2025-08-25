'use client'
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
}

export default function PostDetailFade({ post }: { post: any }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (post) {
      const t = setTimeout(() => setIsLoaded(true), 200);
      return () => clearTimeout(t);
    }
  }, [post]);

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
          <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground">{post.title}</span>
              </nav>
              {/* Back Button */}
              <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6">
                <span>Back to Posts</span>
              </Link>
              {/* Article Header */}
              <Card className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <CardContent className="p-8">
                  <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-8">
                    <span>By {post.companyName}</span>
                    <span>•</span>
                    <span>Published on {new Date(post.publishedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {/* Hero Image */}
                  <div className="mb-8">
                    <Image
                      src={post.thumbnail || "/placeholder.svg"}
                      alt={post.title}
                      width={800}
                      height={400}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  {/* Article Content */}
                  <div className="markdown-body mb-8">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>
                  {/* View Original Button */}
                  <div className="mb-8">
                    <Button variant="outline" asChild>
                      <a href={post.url} target="_blank" rel="noopener noreferrer">
                        View Original
                      </a>
                    </Button>
                  </div>
                  {/* Tags */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="px-3 py-1">
                        {post.companyName}
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1">
                        Tech
                      </Badge>
                    </div>
                  </div>
                  {/* Like and Share */}
                  <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-border">
                    <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-red-600">
                      <span>0</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600">
                      <span>0</span>
                    </Button>
                  </div>
                  {/* Comments Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-6">Comments</h3>
                    {/* Add Comment */}
                    <Card className="border-border mb-6">
                      <CardContent className="p-6">
                        <div className="flex space-x-4">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
                          <div className="flex-1 space-y-4">
                            <Textarea placeholder="Add comment..." className="min-h-[100px] resize-none border-border" />
                            <div className="flex justify-end">
                              <Button>Post</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

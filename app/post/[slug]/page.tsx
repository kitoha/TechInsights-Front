import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import PostDetailFade from "@/components/post/PostDetailFade";
import { fetchRecommendedPosts } from "@/lib/posts";
import { fetchBackendJson } from "@/lib/shared/server-fetch";

interface PostDetailProps {
  params: Promise<{
    slug: string
  }>
}

interface PostData {
  id: string
  title: string
  preview?: string
  url: string
  content: string
  publishedAt: string
  thumbnail: string
  companyName: string
  logoImageName?: string
  categories?: string[]
  viewCount?: number
  liked?: boolean
}

async function getPostData(postId: string): Promise<PostData | null> {
  try {
    const headersList = await headers();
    const forwardedHeaders: Record<string, string> = {};
    
    const cookie = headersList.get("cookie");
    if (cookie) forwardedHeaders["cookie"] = cookie;
    
    const xff = headersList.get("x-forwarded-for");
    if (xff) forwardedHeaders["x-forwarded-for"] = xff;

    return await fetchBackendJson<PostData>(`/api/v1/posts/${postId}`, {
      cache: "no-store",
      headers: forwardedHeaders,
    });
  } catch (error) {
    console.error('Post fetch error:', error);
    return null;
  }
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const resolvedParams = await params;

  const [post, recommendedPosts] = await Promise.all([
    getPostData(resolvedParams.slug),
    fetchRecommendedPosts()
  ]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PostDetailFade
      post={post}
      recommendedPosts={recommendedPosts}
    />
  );
}

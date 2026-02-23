import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/shared/api";
import PostDetailFade from "@/components/post/PostDetailFade";
import { fetchRecommendedPosts } from "@/lib/posts";

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
}

async function getPostData(postId: string): Promise<PostData | null> {
  try {
    const res = await apiGet<PostData>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}`);
    return res.data;
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

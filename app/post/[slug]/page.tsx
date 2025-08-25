import { Header } from "@/components/Header";
import { Search, Bell, Heart, Share2, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown";
import Image from "next/image"
import Link from "next/link"
import axios from 'axios'

interface PostDetailProps {
  params: Promise<{
    slug: string
  }>
}

interface PostData {
  id: string
  title: string
  url: string
  content: string
  publishedAt: string
  thumbnail: string
  companyName: string
}

async function getPostData(postId: string): Promise<PostData | null> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}`);
    return res.data;
  } catch (error) {
    console.error('Post fetch error:', error);
    return null;
  }
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug)

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Posts</span>
        </Link>

        {/* Article Header */}
        <article className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-8">
              <span>By {post.companyName}</span>
              <span>•</span>
              <span>Published on {formatDate(post.publishedAt)}</span>
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
                <Heart className="h-5 w-5" />
                <span>0</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600">
                <Share2 className="h-5 w-5" />
                <span>0</span>
              </Button>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Comments</h3>

              {/* Add Comment */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
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
          </div>
        </article>
      </div>
    </div>
  )
}

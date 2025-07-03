import { Search, Bell, Heart, Share2, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { marked } from "marked";
import Image from "next/image"
import Link from "next/link"
import axios from 'axios'

interface PostDetailProps {
  params: {
    slug: string
  }
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
  const post = await getPostData(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // publishedAt을 읽기 쉬운 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Tech Insights</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-gray-600">
                Home
              </Link>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Categories
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Companies
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search" className="pl-10 w-64 bg-gray-100 border-gray-200 h-10" />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        {/* Back Button */}
        <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Posts</span>
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-8">
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
            <div className="prose prose-lg max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: marked(post.content) }} />
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
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
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                <Heart className="h-5 w-5" />
                <span>0</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Share2 className="h-5 w-5" />
                <span>0</span>
              </Button>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Comments</h3>

              {/* Add Comment */}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Textarea placeholder="Add comment..." className="min-h-[100px] resize-none border-gray-200" />
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

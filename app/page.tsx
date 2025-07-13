import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import InfoBadge from "@/components/InfoBadge"
import CategoryBadges from "@/components/CategoryBadges"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import axios from 'axios'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import Link from "next/link"
import { RankingItem } from "@/components/RankingItem";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import TopCompaniesByPosts from "@/components/TopCompaniesByPosts";

export default async function HomePage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const categories = ["All", "FrontEnd", "BackEnd", "AI", "Big Data", "Infra", "Architecture"]

  let data = { content: [], totalPages: 1 };
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`, {
      params: {
        page,
        size: 10
      }
    });
    data = res.data;
  } catch (error) {
    console.error('Posts fetch error:', error);
  }

  const latestPosts = (data.content || []).map((item: any) => ({
    id: item.id,
    companyName: item.companyName || "기타",
    title: item.title,
    description: item.preview?.replace(/<[^>]+>/g, ''),
    image: item.thumbnail || "/placeholder.svg?height=120&width=120",
    url: item.url,
    publishedAt: formatDate(item.publishedAt),
    logoImageName: item.logoImageName,
    categories: item.categories || [],
  }))

  
  let trendingCompanies = [];
  try {
    const companiesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/top-by-views`, {
      params: {
        page: 0,
        size: 5
      }
    });
    trendingCompanies = companiesRes.data.content || [];
  } catch (error) {
    console.error('Companies fetch error:', error);
  }

  const trendingPosts = trendingCompanies.map((company: any) => ({
    logoImage: `/logos/${company.logoImageName}`,
    title: company.name.length > 20 ? `${company.name.slice(0, 20)}...` : company.name,
    viewCount: company.totalViewCount
  }))

  let companies = [];
  try {
    const companiesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies`, {
      params: {
        page: 0,
        size: 15
      }
    });
    companies = (companiesRes.data.content || []).map((company: any) => ({
      name: company.name,
      logoImage: `/logos/${company.logoImageName}`
    }));
  } catch (error) {
    console.error('Companies fetch error:', error);
  }

  const totalPages = data.totalPages || 1;
  const maxVisible = 5;
  let start = Math.max(0, page - 2);
  let end = Math.min(totalPages, start + maxVisible);
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }
  const pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);

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
              <a href="#" className="text-gray-900 hover:text-gray-600">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Categories
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Trending
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Companies
              </a>
            </nav>

            <div className="flex items-center space-x-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for posts, topics, or companies"
                className="pl-10 bg-white border-gray-200 h-12"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={index === 0 ? "default" : "ghost"}
                  className={index === 0 ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Latest Posts */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Posts</h2>
              <div className="space-y-6">
                {latestPosts.map((post: any, index: number) => (
                  <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="px-6 py-0">
                      <Link href={`/post/${post.id}`}>
                        <div className="flex items-start justify-between">
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
                                      className="object-contain w-6 h-6 rounded-full bg-white border"
                                    />
                                  )}
                                  <span className="text-sm font-semibold text-gray-800">{post.companyName}</span>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{post.publishedAt}</span>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                              <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                            </div>
                            <CategoryBadges categories={post.categories} />
                          </div>
                          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex-shrink-0">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt=""
                              width={96}
                              height={96}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* shadcn Pagination for latestPosts */}
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href={`?page=${page - 1}`} aria-disabled={page <= 0} />
                  </PaginationItem>
                  {start > 0 && (
                    <>
                      <PaginationItem>
                        <PaginationLink href={`?page=0`}>1</PaginationLink>
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
                      <PaginationLink href={`?page=${p}`} isActive={p === page}>
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
                        <PaginationLink href={`?page=${totalPages - 1}`}>{totalPages}</PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext href={`?page=${page + 1}`} aria-disabled={page + 1 >= totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Now */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Trending Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Popular Posts Over Time</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-green-600">+15%</span>
                    <span className="text-sm text-gray-500">Last 7 Days +15%</span>
                  </div>
                </div>
                <div className="h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                  <svg viewBox="0 0 200 40" className="w-full h-full">
                    <path d="M0,30 Q50,10 100,20 T200,15" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="text-center">
                      {day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">게시물 조회 수 랭킹</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {trendingPosts.map((post: any, idx: number) => (
                    <RankingItem
                      key={idx}
                      rank={idx}
                      logo={post.logoImage}
                      name={post.title}
                      score={post.viewCount}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Companies */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold"> 기술 블로그 기업 리스트 </CardTitle>
              </CardHeader>
              <CardContent>
                <FeaturedCompanies companies={companies} />
              </CardContent>
            </Card>

            {/* Top Companies by Posts */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">기술 블로그 TOP 15</CardTitle>
              </CardHeader>
              <CardContent>
                <TopCompaniesByPosts companies={companies} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

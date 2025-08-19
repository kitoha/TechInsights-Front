import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import PostList from "@/components/PostList";
import AIRecommendedPosts from "@/components/AIRecommendedPosts";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function HomePage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const page = Number(params?.page) || 0;
  const categories = ["All", "FrontEnd", "BackEnd", "AI", "Big Data", "Infra", "Architecture"];
  const selectedCategory = params?.category || "All";

  let data = { content: [], totalPages: 1 };
  try {
    const apiParams: any = {
      page,
      size: 10,
    };
    if (selectedCategory && selectedCategory !== "All") {
      apiParams.category = selectedCategory;
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`, {
      params: apiParams
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Tech Insights</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
                Home
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Categories
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Trending
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Companies
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
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
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 h-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Category Tabs + Post List (CSR) */}
            <PostList categories={categories} />
          </div>

                     {/* Sidebar */}
           <div className="space-y-6">
             {/* AI 추천 게시물 */}
             <AIRecommendedPosts />

                         {/* Popular Posts */}
             <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
               <CardHeader>
                 <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">게시물 조회 수 랭킹</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
             <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
               <CardHeader>
                 <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200"> 기술 블로그 기업 리스트 </CardTitle>
               </CardHeader>
               <CardContent>
                 <FeaturedCompanies companies={companies} />
               </CardContent>
             </Card>

             {/* Top Companies by Posts */}
             <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
               <CardHeader>
                 <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">기술 블로그 TOP 15</CardTitle>
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

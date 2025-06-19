import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

export default function HomePage() {
  const categories = ["All", "FrontEnd", "BackEnd", "AI", "Big Data", "Infra", "Architecture"]

  const latestPosts = [
    {
      category: "FrontEnd",
      title: "Building Responsive Layouts with CSS Grid",
      description:
        "Learn how to create flexible and responsive web layouts using CSS Grid, a powerful tool for modern web development.",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      category: "BackEnd",
      title: "Optimizing Database Queries for Performance",
      description:
        "Discover techniques to optimize your database queries, ensuring faster response times and improved application performance.",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      category: "AI",
      title: "Introduction to Neural Networks",
      description:
        "Get started with neural networks, understanding their structure, and how they can be applied to solve complex problems.",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      category: "Big Data",
      title: "Processing Large Datasets with Spark",
      description:
        "Explore how Apache Spark can be used to efficiently process and analyze large datasets, enabling insights from big data.",
      image: "/placeholder.svg?height=120&width=120",
    },
  ]

  const popularPosts = [
    {
      category: "Infra",
      title: "Setting Up a CI/CD Pipeline",
      description:
        "Learn how to automate your software delivery process by setting up a Continuous Integration and Continuous Deployment pipeline.",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      category: "Architecture",
      title: "Microservices Architecture Patterns",
      description:
        "Dive into microservices architecture, exploring common patterns and best practices for building scalable and resilient systems.",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      category: "All",
      title: "The Future of Cloud Computing",
      description:
        "Explore the trends shaping the future of cloud computing, from serverless architectures to edge computing.",
      image: "/placeholder.svg?height=120&width=120",
    },
  ]

  const trendingPosts = [
    { title: "CSS Grid Layouts", category: "FrontEnd" },
    { title: "Database Optimization", category: "BackEnd" },
    { title: "Neural Networks", category: "AI" },
  ]

  const companies = [
    { name: "Tech Innovators Inc.", color: "bg-emerald-600" },
    { name: "Software Solutions Ltd.", color: "bg-amber-600" },
    { name: "Digital Systems Corp.", color: "bg-blue-600" },
  ]

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
                {latestPosts.map((post, index) => (
                  <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-6">
                          <Badge variant="secondary" className="mb-3 text-xs">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                          <Button variant="outline" size="sm">
                            See More
                          </Button>
                        </div>
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex-shrink-0">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt=""
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-lg opacity-60"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Popular Posts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Posts</h2>
              <div className="space-y-6">
                {popularPosts.map((post, index) => (
                  <Card key={index} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-6">
                          <Badge variant="secondary" className="mb-3 text-xs">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                          <Button variant="outline" size="sm">
                            See More
                          </Button>
                        </div>
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex-shrink-0">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt=""
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-lg opacity-60"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                <CardTitle className="text-lg font-semibold">Popular Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingPosts.map((post, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-gray-400 font-mono text-lg">#</span>
                      <div>
                        <p className="font-medium text-gray-900">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Companies */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Featured Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companies.map((company, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${company.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{company.name.charAt(0)}</span>
                      </div>
                      <span className="text-gray-900 font-medium">{company.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Companies by Posts */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Top Companies by Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companies.map((company, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 ${company.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-900">
                        {index + 1}. {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

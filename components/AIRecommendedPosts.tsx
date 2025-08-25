'use client'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"

interface RecommendedPost {
  title: string
  logo: string
  color: string
  borderColor: string
}

const colorSets = [
  { color: "bg-gradient-to-br from-blue-50 to-blue-100", borderColor: "border-blue-200" },
  { color: "bg-gradient-to-br from-yellow-50 to-yellow-100", borderColor: "border-yellow-200" },
  { color: "bg-gradient-to-br from-green-50 to-green-100", borderColor: "border-green-200" },
  { color: "bg-gradient-to-br from-gray-50 to-gray-100", borderColor: "border-gray-200" },
  { color: "bg-gradient-to-br from-emerald-50 to-emerald-100", borderColor: "border-emerald-200" },
]

export default function AIRecommendedPosts() {
  const [recommended, setRecommended] = useState<RecommendedPost[]>([])

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/recommendations`)
        const data = res.data
        const mapped = data.map((item: any, idx: number) => {
          const colorIdx = idx % colorSets.length
          return {
            title: item.title,
            logo: `/logos/${item.logoImageName}`,
            color: colorSets[colorIdx].color,
            borderColor: colorSets[colorIdx].borderColor,
          }
        })
        setRecommended(mapped)
      } catch (e) {
        setRecommended([])
      }
    }
    fetchRecommendations()
  }, [])

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="px-4 py-3 pb-1">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI 추천 게시물</CardTitle>
          </div>
          <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group ml-6">
            더보기
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-3">
        <div className="space-y-2">
          {recommended.map((post, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex-shrink-0">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                    {index + 1}
                  </span>
                </div>
                <div className={`w-9 h-9 rounded-lg ${post.color} border ${post.borderColor} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                  <Image
                    src={post.logo}
                    alt="Company logo"
                    width={18}
                    height={18}
                    className="w-4.5 h-4.5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-tight group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                    {post.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

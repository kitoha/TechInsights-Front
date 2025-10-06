import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompanyNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            회사를 찾을 수 없습니다
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            요청하신 회사 정보를 찾을 수 없습니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              홈으로 돌아가기
            </Button>
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            또는 <Link href="/companies" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">회사 목록</Link>을 확인해보세요.
          </div>
        </div>
      </div>
    </div>
  );
}

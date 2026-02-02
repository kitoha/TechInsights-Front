"use client"

import { Header } from "@/components/Header"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { isAxiosError } from "axios"

export default function SettingsPage() {
  const { userProfile, refetchUser, isLoggedIn, isLoading } = useAuth()
  const [nickname, setNickname] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (userProfile?.nickname) {
      setNickname(userProfile.nickname)
    } else if (userProfile?.name) {
      setNickname(userProfile.name)
    }
  }, [userProfile])

  const handleUpdateNickname = async () => {
    if (!nickname.trim() || nickname.length < 2) {
      setMessage({ type: "error", text: "닉네임은 최소 2글자 이상이어야 합니다." })
      return
    }

    setIsUpdating(true)
    setMessage({ type: "", text: "" })

    try {
      await api.post("/api/v1/users/me/nickname", { nickname })
      await refetchUser()
      setMessage({ type: "success", text: "새로운 닉네임이 잘 반영되었습니다!" })
    } catch (error: unknown) {
      let serverMessage = ""
      let status = 0

      if (isAxiosError(error)) {
        serverMessage = error.response?.data?.message
        status = error.response?.status || 0
      }
      
      if (status === 401) {
        setMessage({ type: "error", text: "로그인 세션이 만료되었습니다. 다시 로그인해주세요." })
      } else if (serverMessage) {
        setMessage({ type: "error", text: serverMessage })
      } else {
        setMessage({ type: "error", text: "지금은 닉네임을 변경할 수 없습니다. 잠시 후 다시 시도해주세요." })
      }
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">설정</h1>
            <p className="text-muted-foreground mt-2">
              계정 정보 및 서비스 이용 환경을 설정합니다.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-lg font-semibold">프로필 설정</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  서비스 내에서 사용되는 공개 정보를 관리합니다.
                </p>
              </div>
              
              <div className="p-6">
                {!isLoggedIn ? (
                  <div className="py-12 text-center border-2 border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">로그인이 필요한 서비스입니다.</p>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleUpdateNickname()
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label htmlFor="nickname" className="text-sm font-semibold text-foreground">
                          닉네임
                        </label>
                        <span className={`text-[11px] font-medium ${
                          nickname.length > 20 || nickname.length < 2 
                            ? "text-destructive" 
                            : "text-muted-foreground"
                        }`}>
                          {nickname.length} / 20
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Input
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="닉네임을 입력하세요"
                            className="h-10 pr-10"
                            maxLength={20}
                            disabled={isUpdating}
                          />
                        </div>
                        <Button 
                          type="submit"
                          disabled={isUpdating || nickname === (userProfile?.nickname || userProfile?.name) || nickname.length < 2}
                          className="h-10 px-8 shrink-0 font-semibold transition-all active:scale-95"
                        >
                          {isUpdating ? (
                            <div className="flex items-center gap-2">
                              <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              저장 중
                            </div>
                          ) : (
                            "변경 사항 저장"
                          )}
                        </Button>
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        다른 사용자들에게 공개되는 이름입니다. 한글, 영문, 숫자, _, -를 사용할 수 있습니다.
                      </p>
                    </div>

                    {message.text && (
                      <div className={`p-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1 ${
                        message.type === "success" 
                          ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}>
                        <div className="flex items-center gap-2">
                          {message.type === "success" ? (
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {message.text}
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border border-dashed p-12 text-center">
              <p className="text-sm text-muted-foreground italic">
                더 많은 설정 기능들이 곧 추가될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
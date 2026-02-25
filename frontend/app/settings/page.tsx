"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Lock, ChevronRight } from "lucide-react"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?returnUrl=/settings")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/my-page" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          마이페이지로 돌아가기
        </Link>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">설정</h1>
          <p className="text-muted-foreground">계정 설정을 관리하세요</p>
        </div>

        {/* Settings Menu */}
        <div className="grid gap-4">
          <Link href="/settings/profile">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>프로필 수정</CardTitle>
                      <CardDescription>이름과 전화번호를 수정할 수 있습니다</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings/password">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>비밀번호 변경</CardTitle>
                      <CardDescription>안전한 비밀번호로 변경하세요</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

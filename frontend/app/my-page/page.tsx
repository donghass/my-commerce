"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Shield, LogOut, User as UserIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MyPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?returnUrl=/my-page")
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

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "오류",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">마이페이지</h1>
          <p className="text-muted-foreground">내 정보 및 계정 설정을 관리하세요</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>회원님의 기본 정보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                  {user.role === "ADMIN" ? "관리자" : "일반 회원"}
                </Badge>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">이름</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">이메일</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">계정 ID</p>
                      <p className="font-medium">#{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">총 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0건</div>
              <p className="text-xs text-muted-foreground mt-1">
                주문 내역이 없습니다
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">위시리스트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0개</div>
              <p className="text-xs text-muted-foreground mt-1">
                저장된 상품이 없습니다
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">작성한 리뷰</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0개</div>
              <p className="text-xs text-muted-foreground mt-1">
                리뷰를 작성해보세요
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>계정 관리</CardTitle>
            <CardDescription>계정 설정 및 로그아웃</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <Link href="/settings">프로필 수정</Link>
            </Button>
            <Button
              variant="destructive"
              className="w-full md:w-auto md:ml-2"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

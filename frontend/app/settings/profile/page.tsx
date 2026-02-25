"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { userApi } from "@/lib/api/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfileSettingsPage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/settings/profile")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || "",
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요"
    }

    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해주세요"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/-/g, ""))) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await userApi.updateProfile({
        name: formData.name,
        phone: formData.phone.replace(/-/g, ""),
      })

      // Update user in localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        userData.name = formData.name
        userData.phone = formData.phone.replace(/-/g, "")
        localStorage.setItem("user", JSON.stringify(userData))
      }

      toast({
        title: "프로필 수정 완료",
        description: "프로필 정보가 성공적으로 수정되었습니다.",
      })

      // Refresh user data
      if (refreshUser) {
        await refreshUser()
      }

      router.push("/my-page")
    } catch (error: any) {
      toast({
        title: "프로필 수정 실패",
        description: error.message || "프로필 수정에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 max-w-2xl mx-auto">
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
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/settings" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          설정으로 돌아가기
        </Link>

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">프로필 수정</h1>
          <p className="text-muted-foreground">이름과 전화번호를 수정할 수 있습니다</p>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>회원님의 기본 정보를 수정하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "저장 중..." : "저장"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/settings")}
                >
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

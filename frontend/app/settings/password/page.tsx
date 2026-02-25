"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { userApi } from "@/lib/api/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function PasswordSettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/settings/password")
    }
  }, [user, authLoading, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.oldPassword) {
      newErrors.oldPassword = "현재 비밀번호를 입력해주세요"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "비밀번호는 최소 8자 이상이어야 합니다"
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      newErrors.newPassword = "숫자와 특수문자를 포함해야 합니다"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await userApi.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })

      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      })

      router.push("/my-page")
    } catch (error: any) {
      toast({
        title: "비밀번호 변경 실패",
        description: error.message || "비밀번호 변경에 실패했습니다.",
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
          <h1 className="text-3xl font-bold tracking-tight">비밀번호 변경</h1>
          <p className="text-muted-foreground">안전한 비밀번호로 변경하세요</p>
        </div>

        {/* Password Form */}
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
            <CardDescription>현재 비밀번호를 입력하고 새 비밀번호를 설정하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">현재 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    placeholder="현재 비밀번호"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.oldPassword && <p className="text-xs text-destructive">{errors.oldPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="새 비밀번호"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  비밀번호는 최소 8자 이상이어야 하며 숫자와 특수문자를 포함해야 합니다.
                </p>
                {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="새 비밀번호 확인"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
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

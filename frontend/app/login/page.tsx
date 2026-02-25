"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    } else if (formData.password.length < 4) {
      newErrors.password = "비밀번호는 최소 4자 이상이어야 합니다"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await login(formData.email, formData.password)

      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })

      const returnUrl = searchParams.get("returnUrl") || "/"
      router.push(returnUrl)
    } catch (error: any) {
      toast({
        title: "로그인 실패",
        description: error.message || "로그인에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3"
              alt="Commerce 로고"
              width={40}
              height={40}
              className="rounded-full bg-primary"
            />
          </div>
          <CardTitle className="text-2xl text-center">계정에 로그인하세요</CardTitle>
          <CardDescription className="text-center">
            이메일과 비밀번호를 입력하여 계정에 접근하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => {
                  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
                    setErrors({ ...errors, email: "올바른 이메일 형식이 아닙니다" })
                  } else {
                    setErrors({ ...errors, email: undefined })
                  }
                }}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}</span>
                </Button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                로그인 정보 저장
              </Label>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

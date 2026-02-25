"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const { register, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    phone: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.lastName.trim()) {
      newErrors.lastName = "성을 입력해주세요"
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "이름을 입력해주세요"
    }

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다"
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = "숫자와 특수문자를 포함해야 합니다"
    }

    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해주세요"
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/-/g, ""))) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다"
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = "이용약관에 동의해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const fullName = `${formData.lastName}${formData.firstName}`
      await register(fullName, formData.email, formData.password, formData.phone)

      toast({
        title: "회원가입 성공",
        description: "환영합니다! 로그인되었습니다.",
      })

      router.push("/")
    } catch (error: any) {
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입에 실패했습니다.",
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
          <CardTitle className="text-2xl text-center">계정을 만드세요</CardTitle>
          <CardDescription className="text-center">계정을 만들려면 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last-name">성</Label>
                <Input
                  id="last-name"
                  placeholder="김"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="first-name">이름</Label>
                <Input
                  id="first-name"
                  placeholder="민지"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
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
              <p className="text-xs text-muted-foreground">
                비밀번호는 최소 8자 이상이어야 하며 숫자와 특수문자를 포함해야 합니다.
              </p>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                저는{" "}
                <Link href="#" className="text-primary hover:underline">
                  이용약관
                </Link>{" "}
                및{" "}
                <Link href="#" className="text-primary hover:underline">
                  개인정보 정책
                </Link>
                에 동의합니다
              </Label>
            </div>
            {errors.terms && <p className="text-xs text-destructive mt-1">{errors.terms}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "계정 만드는 중..." : "계정 만들기"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

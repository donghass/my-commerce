"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Search, User, Menu, X, LogOut, UserCircle, Package, Settings } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { cartApi } from "@/lib/api/cart"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    if (user) {
      loadCartCount()
    } else {
      setCartItemCount(0)
    }
  }, [user])

  const loadCartCount = async () => {
    try {
      const cart = await cartApi.getCart()
      const count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
      setCartItemCount(count)
    } catch (error) {
      console.error('Failed to load cart count:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3"
              alt="Commerce 로고"
              width={40}
              height={40}
              className="rounded-full bg-primary"
            />
            <span className="text-xl font-bold">Commerce</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              홈
            </Link>
            <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">
              쇼핑
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              소개
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              문의
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="상품 검색..."
                className="w-[200px] pl-8 md:w-[250px] rounded-full bg-muted"
              />
            </div>
          </div>
          {/* 언어 선택기 - 사용하지 않음
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Globe className="h-5 w-5" />
                <span className="sr-only">언어</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>한국어</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>日本語</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          */}
          {!isLoading && (
            <>
              {user ? (
                // 로그인 상태: 사용자 드롭다운 메뉴
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block text-sm font-medium">
                        {user.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/my-page" className="flex items-center cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>마이페이지</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>주문내역</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>설정</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // 비로그인 상태: 로그인 버튼
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link href="/login">
                    <User className="h-5 w-5" />
                    <span className="sr-only">로그인</span>
                  </Link>
                </Button>
              )}
            </>
          )}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">장바구니</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">메뉴</span>
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="상품 검색..." className="w-full pl-8 rounded-full bg-muted" />
          </div>
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              홈
            </Link>
            <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">
              쇼핑
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              소개
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              문의
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

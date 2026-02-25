"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useAuth } from "@/components/auth-provider"
import { cartApi, Cart, CartItem } from "@/lib/api/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/cart")
    } else if (user) {
      loadCart()
    }
  }, [user, authLoading, router])

  const loadCart = async () => {
    try {
      setLoading(true)
      const data = await cartApi.getCart()
      setCart(data)
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.response?.data?.message || "장바구니를 불러올 수 없습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await cartApi.updateCartItem(itemId, newQuantity)
      await loadCart()
      toast({
        title: "수량 변경됨",
        description: "장바구니 수량이 변경되었습니다.",
      })
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.response?.data?.message || "수량 변경에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      await cartApi.removeFromCart(itemId)
      await loadCart()
      toast({
        title: "삭제 완료",
        description: "상품이 장바구니에서 삭제되었습니다.",
      })
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.response?.data?.message || "삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clearCart()
      await loadCart()
      toast({
        title: "비우기 완료",
        description: "장바구니가 비워졌습니다.",
      })
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.response?.data?.message || "비우기에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const cartItems = cart?.items || []
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 3000 : 0
  // const tax = subtotal * 0.08
  const total = subtotal + shipping

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장바구니</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            홈
          </Link>
          <span className="mx-2">/</span>
          <span>장바구니</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">장바구니가 비어있습니다</h2>
          <p className="text-muted-foreground mb-8">
            아직 장바구니에 추가된 상품이 없습니다.
          </p>
          <Button asChild>
            <Link href="/shop">쇼핑 계속하기</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-6">상품</div>
                  <div className="col-span-2 text-center">가격</div>
                  <div className="col-span-2 text-center">수량</div>
                  <div className="col-span-2 text-right">소계</div>
                </div>
                <Separator />
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="py-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="relative h-20 w-20 rounded-md overflow-hidden">
                            <Image
                              src={item.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.productName}</h3>
                            <p className="text-sm text-muted-foreground md:hidden">
                              ₩{item.price.toLocaleString()}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1 h-auto p-0 text-sm text-destructive hover:text-destructive/80 md:hidden"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              제거
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-2 text-center hidden md:block">
                          ₩{item.price.toLocaleString()}
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">감소</span>
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">증가</span>
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-2 text-right flex items-center justify-between md:justify-end">
                          <span className="font-medium">
                            ₩{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80 hidden md:inline-flex"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">제거</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-muted p-6 rounded-b-lg">
                <Button variant="outline" asChild>
                  <Link href="/shop">쇼핑 계속하기</Link>
                </Button>
                <Button variant="ghost" onClick={clearCart}>
                  장바구니 비우기
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">주문 요약</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">소계</span>
                    <span>₩{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">배송료</span>
                    <span>₩{shipping.toLocaleString()}</span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">세금</span>
                    <span>₩{Math.round(tax).toLocaleString()}</span>
                  </div> */}
                  <Separator />
                  <div className="flex items-center justify-between font-medium text-lg">
                    <span>합계</span>
                    <span>₩{total.toLocaleString()}</span>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">
                        결제하기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">또는</span>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Input type="text" placeholder="쿠폰 코드" className="rounded-r-none" />
                        <Button className="rounded-l-none">적용</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

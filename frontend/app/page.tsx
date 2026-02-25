"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Search, Star, TruckIcon, ShieldCheck, Clock, CreditCard } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { productApi } from "@/lib/api/product"
import { categoryApi } from "@/lib/api/category"

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        categoryApi.getCategories(),
        productApi.getProducts({ page: 0, size: 8 })
      ])
      setCategories(categoriesData.slice(0, 4))
      setProducts(productsData.content.slice(0, 4))
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const testimonials = [
    {
      id: 1,
      name: "김민지",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      text: "배송도 빠르고 상품 품질도 정말 좋아요. 자주 이용하고 있습니다!",
    },
    {
      id: 2,
      name: "박지훈",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      text: "가격도 합리적이고 고객 서비스도 친절합니다. 강력 추천해요!",
    },
    {
      id: 3,
      name: "이수현",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 4,
      text: "다양한 상품이 한 곳에 모여있어서 쇼핑하기 편리해요.",
    },
  ]

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <section className="relative">
        <div className="container px-4 py-12 md:px-6 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                대한민국 No.1 종합쇼핑몰
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                패션, 뷰티, 가전, 식품까지 모든 상품을 한 곳에서 만나보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-medium" asChild>
                  <Link href="/shop">쇼핑하기</Link>
                </Button>
                <Button size="lg" variant="outline" className="font-medium">
                  특가 상품 보기
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="쇼핑몰 메인 이미지"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">카테고리별 쇼핑</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.length > 0 ? (
              categories.map((category) => {
                // 카테고리별 이미지 매핑
                const categoryImages: Record<string, string> = {
                  '패션잡화': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop',
                  '화장품/미용': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080&auto=format&fit=crop',
                  '의류': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop',
                  '생활용품': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop',
                }
                return (
                  <Link
                    key={category.id}
                    href={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="group relative overflow-hidden rounded-lg bg-background shadow-md transition-all hover:shadow-lg"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={categoryImages[category.name] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 w-full p-4">
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              [
                { name: '패션잡화', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop' },
                { name: '화장품/미용', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080&auto=format&fit=crop' },
                { name: '의류', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop' },
                { name: '생활용품', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop' },
              ].map((category, index) => (
                <Link
                  key={index}
                  href={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group relative overflow-hidden rounded-lg bg-background shadow-md transition-all hover:shadow-lg"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 w-full p-4">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">인기 상품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-background border">
                  <div className="relative h-full w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">위시리스트 추가</span>
                    </Button>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <Button className="mx-auto">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      장바구니
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{product.price.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">전체 상품 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Our Store */}
      <section className="bg-muted py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">Commerce를 선택하는 이유</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background">
              <CardContent className="flex flex-col items-center text-center p-6">
                <TruckIcon className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">무료 배송</h3>
                <p className="text-muted-foreground">
                  5만원 이상 구매 시 무료 배송 서비스를 제공합니다.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="flex flex-col items-center text-center p-6">
                <ShieldCheck className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">품질 보증</h3>
                <p className="text-muted-foreground">
                  모든 상품은 엄격한 품질 검수를 거쳐 배송됩니다.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Clock className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">24/7 고객 지원</h3>
                <p className="text-muted-foreground">
                  언제든지 고객센터를 통해 도움을 받으실 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="flex flex-col items-center text-center p-6">
                <CreditCard className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">안전한 결제</h3>
                <p className="text-muted-foreground">
                  다양한 결제 수단과 안전한 결제 시스템을 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">고객 후기</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-background">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">뉴스레터 구독</h2>
            <p className="max-w-[600px] text-primary-foreground/90 md:text-lg">
              특별 할인과 신상품 소식을 가장 먼저 받아보세요.
            </p>
            <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
              <Input type="email" placeholder="이메일을 입력하세요" className="bg-primary-foreground text-foreground" />
              <Button variant="secondary">구독하기</Button>
            </div>
            <p className="text-xs text-primary-foreground/70">
              구독하시면 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

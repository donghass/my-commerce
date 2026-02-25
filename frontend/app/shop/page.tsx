"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Search, ChevronDown, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { categoryApi } from "@/lib/api/category"
import { productApi } from "@/lib/api/product"
import { cartApi } from "@/lib/api/cart"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [priceRange, setPriceRange] = useState([0, 300000])
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
  })
  const [sortBy, setSortBy] = useState("featured")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  // 데이터 로드
  useEffect(() => {
    loadData()
  }, [])

  // URL 파라미터에서 카테고리 필터 적용
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedFilters(prev => ({
        ...prev,
        categories: [categoryFromUrl]
      }))
    }
  }, [categoryFromUrl])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesData, productsData] = await Promise.all([
        categoryApi.getCategories(),
        productApi.getProducts({ page: 0, size: 100 })
      ])
      setCategories(categoriesData)
      setProducts(productsData.content)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: number, productName: string) => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "장바구니에 담으려면 로그인이 필요합니다.",
        variant: "destructive",
      })
      router.push(`/login?returnUrl=/shop`)
      return
    }

    try {
      setAddingToCart(productId)
      await cartApi.addToCart(productId, 1)
      toast({
        title: "장바구니에 담았습니다",
        description: `${productName}이(가) 장바구니에 추가되었습니다.`,
      })
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.response?.data?.message || "장바구니 담기에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(null)
    }
  }

  const toggleFilter = (type, value) => {
    setSelectedFilters((prev) => {
      const current = [...prev[type]]
      const index = current.indexOf(value)

      if (index === -1) {
        current.push(value)
      } else {
        current.splice(index, 1)
      }

      return {
        ...prev,
        [type]: current,
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
    })
    setPriceRange([0, 300000])
  }

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`space-y-6 ${isMobile ? "" : "sticky top-20"}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">필터</h3>
        {(selectedFilters.categories.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 300000) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs text-primary hover:text-primary/80"
          >
            전체 제거
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["categories", "price"]}>
          <AccordionItem value="categories">
            <AccordionTrigger>카테고리</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedFilters.categories.includes(category.name)}
                        onCheckedChange={() => toggleFilter("categories", category.name)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">로딩 중...</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>가격대</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-1">
                <Slider
                  min={0}
                  max={300000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">₩{priceRange[0].toLocaleString()}</span>
                  <span className="text-sm">₩{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )

  const filteredProducts = products
    .filter((product) => {
      // Filter by category
      if (selectedFilters.categories.length > 0 && categories && categories.length > 0) {
        const productCategory = categories.find(c => c.id === product.categoryId)
        if (!productCategory || !selectedFilters.categories.includes(productCategory.name)) {
          return false
        }
      }

      // Filter by price
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "featured":
        default:
          return 0
      }
    })

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">모든 상품 쇼핑</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            홈
          </Link>
          <span className="mx-2">/</span>
          <span>쇼핑</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 shrink-0">
          <FilterSidebar />
        </div>

        {/* Filters - Mobile */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetContent side="left" className="w-full sm:max-w-md">
            <SheetHeader className="mb-4">
              <SheetTitle>필터</SheetTitle>
              <SheetDescription>상품 검색을 좁혀서 찾아보세요</SheetDescription>
            </SheetHeader>
            <FilterSidebar isMobile={true} />
          </SheetContent>
        </Sheet>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden flex items-center gap-2"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Filter className="h-4 w-4" />
                필터
              </Button>

              {/* Active filters */}
              <div className="flex flex-wrap gap-2">
                {selectedFilters.categories.map((category) => (
                  <Badge key={`cat-${category}`} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter("categories", category)} />
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 300000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ₩{priceRange[0].toLocaleString()} - ₩{priceRange[1].toLocaleString()}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 300000])} />
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground hidden sm:inline">{filteredProducts.length}개 상품</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">추천순</SelectItem>
                  <SelectItem value="price-low">가격: 낮음순</SelectItem>
                  <SelectItem value="price-high">가격: 높음순</SelectItem>
                  <SelectItem value="newest">최신 상품</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">상품을 불러오는 중...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">상품을 찾을 수 없습니다</h3>
              <p className="text-muted-foreground mb-4">필터를 조정하여 원하는 상품을 찾아보세요.</p>
              <Button onClick={clearFilters}>모든 필터 제거</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-background">
                    <Image
                      src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">위시리스트에 추가</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">빠른 보기</span>
                      </Button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        className="mx-auto"
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={addingToCart === product.id}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {addingToCart === product.id ? "담는 중..." : "장바구니에 추가"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-center">
                    <Badge variant="outline" className="mb-2">
                      {categories.find(c => c.id === product.categoryId)?.name || '기타'}
                    </Badge>
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex justify-center gap-2">
                      <span className="font-medium text-primary">₩{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-12">
            <Button variant="outline" size="icon" disabled>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              2
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              3
            </Button>
            <Button variant="outline" size="icon">
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { orderApi, Order } from "@/lib/api/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?returnUrl=/orders")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const data = await orderApi.getOrders()
        setOrders(data)
      } catch (error: any) {
        toast({
          title: "오류",
          description: error.message || "주문 내역을 불러올 수 없습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, toast])

  if (authLoading || isLoading) {
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

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'default'
      case 'SHIPPED':
        return 'secondary'
      case 'DELIVERED':
        return 'outline'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return '결제 대기'
      case 'CONFIRMED':
        return '주문 확인'
      case 'SHIPPED':
        return '배송 중'
      case 'DELIVERED':
        return '배송 완료'
      case 'CANCELLED':
        return '주문 취소'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">주문 내역</h1>
          <p className="text-muted-foreground">주문하신 상품의 내역을 확인하세요</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">주문 내역이 없습니다</p>
              <p className="text-sm text-muted-foreground mt-1">
                쇼핑을 시작해보세요!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.orderId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">주문 #{order.orderId}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        {index > 0 && <Separator className="my-2" />}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">상품 ID: {item.productId}</p>
                            <p className="text-sm text-muted-foreground">
                              수량: {item.quantity}개
                            </p>
                          </div>
                          <p className="font-medium">{formatPrice(item.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Total Amount */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">총 결제 금액</span>
                    </div>
                    <span className="text-xl font-bold">{formatPrice(order.totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

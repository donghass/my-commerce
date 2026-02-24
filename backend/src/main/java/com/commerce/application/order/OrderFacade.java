package com.commerce.application.order;

import com.commerce.domain.order.OrderEntity;
import com.commerce.domain.order.OrderItemEntity;
import com.commerce.domain.order.OrderService;
import com.commerce.domain.order.OrderStatus;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderFacade {

    private final OrderService orderService;

    /**
     * 주문 생성 (장바구니에서 주문, 재고 차감)
     */
    @Transactional
    public OrderResult createOrder(OrderCommand command, List<Long> productAmounts) {
        Long orderId = orderService.createOrder(command, productAmounts);
        OrderEntity order = orderService.readOrder(orderId);
        List<OrderItemEntity> items = orderService.getOrderItems(orderId);
        return OrderResult.from(order, items);
    }

    /**
     * 주문 상태 업데이트
     */
    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
    }

    /**
     * 쿠폰 할인 적용
     */
    @Transactional
    public void applyCouponDiscount(Long orderId, Long discountAmount) {
        orderService.applyCouponDiscount(orderId, discountAmount);
    }

    /**
     * 주문 만료 처리 (보상 로직 포함)
     */
    @Transactional
    public void expireSingleOrder(OrderEntity order, List<OrderItemEntity> orderItems) {
        boolean orderExpired = false;
        List<OrderItemEntity> restoredItems = new ArrayList<>();

        try {
            // 주문 항목 정렬 (데드락 방지)
            List<OrderItemEntity> sortedItems = orderItems.stream()
                .sorted(Comparator.comparing(OrderItemEntity::getProductId))
                .collect(Collectors.toList());

            // 여기에 재고 복원 로직 추가
            for (OrderItemEntity item : sortedItems) {
                // 재고 복원 처리
                restoredItems.add(item);
            }

            // 주문 만료 상태로 업데이트
            order.updateStatus(OrderStatus.CANCELLED);
            orderService.readOrder(order.getId()); // 주문 존재 확인
            orderExpired = true;

        } catch (Exception e) {
            log.error("주문 만료 처리 도중 오류 발생. 보상 로직 실행", e);

            // 보상 순서: 역순 처리
            for (OrderItemEntity item : restoredItems) {
                try {
                    // 재고 복원 취소 처리
                } catch (Exception ex) {
                    log.error("재고 롤백 실패", ex);
                }
            }

            if (orderExpired) {
                try {
                    order.updateStatus(OrderStatus.PENDING);
                } catch (Exception ex) {
                    log.error("주문 상태 롤백 실패", ex);
                }
            }

            throw new RuntimeException("보상 후 재처리 필요: 주문 ID " + order.getId(), e);
        }
    }

    /**
     * 사용자별 주문 내역 조회
     */
    @Transactional(readOnly = true)
    public List<OrderResult> getOrdersByUserId(Long userId) {
        List<OrderEntity> orders = orderService.getOrdersByUserId(userId);
        return orders.stream()
            .map(order -> {
                List<OrderItemEntity> items = orderService.getOrderItems(order.getId());
                return OrderResult.from(order, items);
            })
            .collect(Collectors.toList());
    }
}

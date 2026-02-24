package com.commerce.application.order;

import com.commerce.domain.order.OrderEntity;
import com.commerce.domain.order.OrderItemEntity;
import com.commerce.domain.order.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderResult(
    Long orderId,
    Long userId,
    OrderStatus status,
    Long totalAmount,
    LocalDateTime createdAt,
    List<OrderItemResult> items
) {

    public static OrderResult from(OrderEntity order, List<OrderItemEntity> items) {
        List<OrderItemResult> itemResults = items.stream()
            .map(OrderItemResult::from)
            .collect(Collectors.toList());

        return new OrderResult(
            order.getId(),
            order.getUserId(),
            order.getStatus(),
            order.getTotalAmount(),
            order.getCreatedAt(),
            itemResults
        );
    }

    public record OrderItemResult(
        Long id,
        Long productId,
        Long quantity,
        Long amount
    ) {
        public static OrderItemResult from(OrderItemEntity item) {
            return new OrderItemResult(
                item.getId(),
                item.getProductId(),
                item.getQuantity(),
                item.getAmount()
            );
        }
    }
}

package com.commerce.api.order;

import com.commerce.application.order.OrderResult;
import com.commerce.domain.order.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderResponse(
    Long orderId,
    Long userId,
    OrderStatus status,
    Long totalAmount,
    LocalDateTime createdAt,
    List<OrderItemResponse> items
) {

    public static OrderResponse from(OrderResult dto) {
        List<OrderItemResponse> itemResponses = dto.items().stream()
            .map(OrderItemResponse::from)
            .collect(Collectors.toList());

        return new OrderResponse(
            dto.orderId(),
            dto.userId(),
            dto.status(),
            dto.totalAmount(),
            dto.createdAt(),
            itemResponses
        );
    }

    public record OrderItemResponse(
        Long id,
        Long productId,
        Long quantity,
        Long amount
    ) {
        public static OrderItemResponse from(OrderResult.OrderItemResult item) {
            return new OrderItemResponse(
                item.id(),
                item.productId(),
                item.quantity(),
                item.amount()
            );
        }
    }
}

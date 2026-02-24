package com.commerce.api.cart;

import com.commerce.application.cart.CartResult;
import lombok.Builder;

import java.util.List;

@Builder
public record CartResponse(
        Long id,
        Long userId,
        List<CartItemResponse> items,
        Long totalAmount
) {
    public static CartResponse from(CartResult result) {
        return CartResponse.builder()
                .id(result.id())
                .userId(result.userId())
                .items(result.items().stream().map(CartItemResponse::from).toList())
                .totalAmount(result.totalAmount())
                .build();
    }

    @Builder
    public record CartItemResponse(
            Long id,
            Long productId,
            String productName,
            String imageUrl,
            Long quantity,
            Long price
    ) {
        public static CartItemResponse from(CartResult.CartItemResult item) {
            return CartItemResponse.builder()
                    .id(item.id())
                    .productId(item.productId())
                    .productName(item.productName())
                    .imageUrl(item.imageUrl())
                    .quantity(item.quantity())
                    .price(item.price())
                    .build();
        }
    }
}

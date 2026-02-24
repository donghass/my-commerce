package com.commerce.application.cart;

import com.commerce.domain.cart.CartEntity;
import com.commerce.domain.cart.CartItemEntity;
import lombok.Builder;

import java.util.List;
import java.util.stream.Collectors;

@Builder
public record CartResult(
        Long id,
        Long userId,
        List<CartItemResult> items,
        Long totalAmount
) {
    public static CartResult from(CartEntity cart) {
        List<CartItemResult> items = cart.getItems().stream()
                .map(CartItemResult::from)
                .collect(Collectors.toList());

        Long totalAmount = items.stream()
                .mapToLong(item -> item.price() * item.quantity())
                .sum();

        return CartResult.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }

    @Builder
    public record CartItemResult(
            Long id,
            Long productId,
            String productName,
            String imageUrl,
            Long quantity,
            Long price
    ) {
        public static CartItemResult from(CartItemEntity item) {
            return CartItemResult.builder()
                    .id(item.getId())
                    .productId(item.getProductId())
                    .productName(item.getProductName())
                    .imageUrl(item.getImageUrl())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .build();
        }
    }
}

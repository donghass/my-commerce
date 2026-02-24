package com.commerce.api.product;

import com.commerce.application.product.ProductResult;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ProductResponse(
        Long id,
        String name,
        String description,
        Long price,
        Long stock,
        Long categoryId,
        String categoryName,
        String imageUrl,
        LocalDateTime createdAt
) {
    public static ProductResponse from(ProductResult result) {
        return ProductResponse.builder()
                .id(result.id())
                .name(result.name())
                .description(result.description())
                .price(result.price())
                .stock(result.stock())
                .categoryId(result.categoryId())
                .categoryName(result.categoryName())
                .imageUrl(result.imageUrl())
                .createdAt(result.createdAt())
                .build();
    }
}

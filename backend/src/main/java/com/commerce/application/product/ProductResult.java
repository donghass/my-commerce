package com.commerce.application.product;

import com.commerce.domain.product.ProductEntity;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ProductResult(
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
    public static ProductResult from(ProductEntity product) {
        return ProductResult.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .build();
    }
}

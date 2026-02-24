package com.commerce.application.category;

import com.commerce.domain.product.CategoryEntity;

import java.time.LocalDateTime;

public record CategoryResult(
        Long id,
        String name,
        LocalDateTime createdAt
) {
    public static CategoryResult from(CategoryEntity entity) {
        return new CategoryResult(
                entity.getId(),
                entity.getName(),
                entity.getCreatedAt()
        );
    }
}

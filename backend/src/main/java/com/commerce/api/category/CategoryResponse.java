package com.commerce.api.category;

import com.commerce.application.category.CategoryResult;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        String name,
        LocalDateTime createdAt
) {
    public static CategoryResponse from(CategoryResult result) {
        return new CategoryResponse(
                result.id(),
                result.name(),
                result.createdAt()
        );
    }
}

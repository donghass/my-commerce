package com.commerce.application.product;

public record ProductCommand(
        String name,
        String description,
        Long price,
        Long stock,
        Long categoryId,
        String imageUrl
) {
}

package com.commerce.application.cart;

public record CartCommand(
        Long productId,
        Long quantity
) {
}

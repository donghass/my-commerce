package com.commerce.domain.cart;

import java.util.Optional;

public interface CartItemRepository {
    CartItemEntity save(CartItemEntity item);
    Optional<CartItemEntity> findById(Long id);
    void deleteById(Long id);
}

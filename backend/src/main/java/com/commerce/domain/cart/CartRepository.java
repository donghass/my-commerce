package com.commerce.domain.cart;

import java.util.Optional;

public interface CartRepository {
    CartEntity save(CartEntity cart);
    Optional<CartEntity> findById(Long id);
    Optional<CartEntity> findByUserId(Long userId);
    void deleteById(Long id);
}

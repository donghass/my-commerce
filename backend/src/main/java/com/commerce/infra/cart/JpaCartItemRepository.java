package com.commerce.infra.cart;

import com.commerce.domain.cart.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaCartItemRepository extends JpaRepository<CartItemEntity, Long> {
}

package com.commerce.infra.cart;

import com.commerce.domain.cart.CartItemEntity;
import com.commerce.domain.cart.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CartItemRepositoryImpl implements CartItemRepository {

    private final JpaCartItemRepository jpaCartItemRepository;

    @Override
    public CartItemEntity save(CartItemEntity item) {
        return jpaCartItemRepository.save(item);
    }

    @Override
    public Optional<CartItemEntity> findById(Long id) {
        return jpaCartItemRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        jpaCartItemRepository.deleteById(id);
    }
}

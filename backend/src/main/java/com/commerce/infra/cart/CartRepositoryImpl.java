package com.commerce.infra.cart;

import com.commerce.domain.cart.CartEntity;
import com.commerce.domain.cart.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CartRepositoryImpl implements CartRepository {

    private final JpaCartRepository jpaCartRepository;

    @Override
    public CartEntity save(CartEntity cart) {
        return jpaCartRepository.save(cart);
    }

    @Override
    public Optional<CartEntity> findById(Long id) {
        return jpaCartRepository.findById(id);
    }

    @Override
    public Optional<CartEntity> findByUserId(Long userId) {
        return jpaCartRepository.findByUserId(userId);
    }

    @Override
    public void deleteById(Long id) {
        jpaCartRepository.deleteById(id);
    }
}

package com.commerce.application.cart;

import com.commerce.domain.cart.CartEntity;
import com.commerce.domain.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CartFacade {

    private final CartService cartService;

    @Transactional(readOnly = true)
    public CartResult getCart(Long userId) {
        CartEntity cart = cartService.getOrCreateCart(userId);
        return CartResult.from(cart);
    }

    @Transactional
    public CartResult addToCart(Long userId, CartCommand command) {
        cartService.addItem(userId, command.productId(), command.quantity());
        CartEntity cart = cartService.findByUserId(userId);
        return CartResult.from(cart);
    }

    @Transactional
    public void updateCartItem(Long itemId, Long quantity) {
        cartService.updateItemQuantity(itemId, quantity);
    }

    @Transactional
    public void removeCartItem(Long itemId) {
        cartService.removeItem(itemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartService.clearCart(userId);
    }
}

package com.commerce.domain.cart;

import com.commerce.common.exception.BusinessException;
import com.commerce.domain.cart.exception.CartErrorCode;
import com.commerce.domain.product.ProductEntity;
import com.commerce.domain.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    @Transactional
    public CartEntity getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    CartEntity cart = CartEntity.create(userId);
                    return cartRepository.save(cart);
                });
    }

    public CartEntity findByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(CartErrorCode.CART_NOT_FOUND));
    }

    @Transactional
    public CartItemEntity addItem(Long userId, Long productId, Long quantity) {
        ProductEntity product = productService.findById(productId);
        CartEntity cart = getOrCreateCart(userId);

        CartItemEntity item = CartItemEntity.create(
                productId,
                product.getName(),
                product.getImageUrl(),
                quantity,
                product.getPrice()
        );
        cart.addItem(item);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void updateItemQuantity(Long itemId, Long quantity) {
        CartItemEntity item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(CartErrorCode.CART_ITEM_NOT_FOUND));
        item.updateQuantity(quantity);
    }

    @Transactional
    public void removeItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        CartEntity cart = findByUserId(userId);
        cart.clearItems();
    }
}

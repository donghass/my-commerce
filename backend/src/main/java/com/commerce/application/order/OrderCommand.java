package com.commerce.application.order;

import java.util.List;

public record OrderCommand(Long userId, Long userCouponId, List<OrderProduct> orderItem) {
    public record OrderProduct(Long productId, Long quantity) {}
}

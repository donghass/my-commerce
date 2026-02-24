package com.commerce.api.order;

import com.commerce.application.order.OrderCommand;
import com.commerce.application.order.OrderCommand.OrderProduct;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.Getter;

@Getter
public class OrderRequest {

    @NotNull(message = "userId는 필수입니다.")
    @Positive(message = "userId는 양의 정수여야 합니다.")
    private Long userId;

    @Positive(message = "userCouponId는 양의 정수여야 합니다.")
    private Long userCouponId;

    @NotEmpty(message = "orderItems는 최소 1개 이상이어야 합니다.")
    private ArrayList<OrderItem> orderItems;

    @Data
    public static class OrderItem {

        @NotNull(message = "productId는 필수입니다.")
        @Positive(message = "productId는 양의 정수여야 합니다.")
        private Long productId;

        @NotNull(message = "quantity는 필수입니다.")
        @Min(value = 1, message = "quantity는 최소 1 이상이어야 합니다.")
        private Long quantity;
    }

    public OrderCommand toCommand() {
        List<OrderProduct> orderProducts = orderItems.stream()
            .map(item -> new OrderCommand.OrderProduct(item.getProductId(), item.getQuantity()))
            .toList();

        return new OrderCommand(userId, userCouponId, orderProducts);
    }
}

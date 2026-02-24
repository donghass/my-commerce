package com.commerce.domain.order;

import com.commerce.application.order.OrderCommand;
import com.commerce.application.order.OrderCommand.OrderProduct;
import com.commerce.common.exception.BusinessException;
import com.commerce.domain.order.exception.OrderErrorCode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private OrderEntity currentOrder;

    @Transactional
    public Long createOrder(OrderCommand command, List<Long> productAmounts) {
        List<OrderProduct> sortedItems = command.orderItem().stream()
            .sorted(Comparator.comparing(OrderProduct::productId))
            .collect(Collectors.toList());

        OrderEntity order = OrderEntity.create(command.userId(), command.userCouponId());

        for (int i = 0; i < sortedItems.size(); i++) {
            OrderProduct item = sortedItems.get(i);
            Long amount = productAmounts.get(i);
            order.addOrderItem(item.productId(), item.quantity(), amount);
        }

        OrderEntity saved = orderRepository.save(order);
        orderRepository.saveAll(order.getOrderItems());
        this.currentOrder = saved;
        return saved.getId();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void rollbackOrder() {
        if (currentOrder != null) {
            try {
                orderRepository.delete(currentOrder);
            } catch (Exception e) {
                log.error("보상 실패 - 주문 삭제 실패", e);
            }
        }
    }

    @Transactional(readOnly = true)
    public OrderEntity readOrder(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new BusinessException(OrderErrorCode.ORDER_NOT_FOUND));
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new BusinessException(OrderErrorCode.ORDER_NOT_FOUND));
        order.updateStatus(status);
        orderRepository.save(order);
    }

    @Transactional
    public void applyCouponDiscount(Long orderId, Long discountAmount) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new BusinessException(OrderErrorCode.ORDER_NOT_FOUND));
        order.applyCouponDiscount(discountAmount);
        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderItemEntity> getOrderItems(Long orderId) {
        return orderRepository.findByOrderId(orderId);
    }

    @Transactional(readOnly = true)
    public List<OrderEntity> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}

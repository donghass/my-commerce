package com.commerce.domain.order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository {

    <T> T save(OrderEntity order);

    Optional<OrderEntity> findById(Long orderId);

    void updateOrderStatus(Long orderId, OrderStatus status);

    List<OrderEntity> findNotPaidOrdersOlderThan(LocalDateTime expiredTime);

    List<OrderItemEntity> findByOrderId(Long orderId);

    OrderItemEntity saveOrderItem(OrderItemEntity orderItem);

    void saveAll(List<OrderItemEntity> orderItems);

    List<OrderEntity> saveAllOrder(List<OrderEntity> orders);

    void delete(OrderEntity order);

    List<OrderEntity> findByUserId(Long userId);
}

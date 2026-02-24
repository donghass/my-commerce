package com.commerce.infra.order;

import com.commerce.domain.order.OrderEntity;
import com.commerce.domain.order.OrderItemEntity;
import com.commerce.domain.order.OrderRepository;
import com.commerce.domain.order.OrderStatus;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {

    private final JpaOrderRepository jpaOrderRepository;
    private final JpaOrderItemRepository jpaOrderItemRepository;
    private final EntityManager em;

    @Override
    public <T> T save(OrderEntity order) {
        return (T) jpaOrderRepository.save(order);
    }

    @Override
    public Optional<OrderEntity> findById(Long id) {
        return jpaOrderRepository.findById(id);
    }

    @Override
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Optional<OrderEntity> order = jpaOrderRepository.findById(orderId);
        order.ifPresent(o -> {
            o.updateStatus(status);
            jpaOrderRepository.save(o);
        });
    }

    @Override
    public List<OrderEntity> findNotPaidOrdersOlderThan(LocalDateTime expiredTime) {
        return jpaOrderRepository.findAll().stream()
            .filter(o -> o.getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(5))
                && o.getStatus() == OrderStatus.PENDING)
            .toList();
    }

    @Override
    public List<OrderItemEntity> findByOrderId(Long orderId) {
        return jpaOrderItemRepository.findByOrderId(orderId);
    }

    @Override
    public OrderItemEntity saveOrderItem(OrderItemEntity orderItem) {
        em.persist(orderItem);
        return orderItem;
    }

    @Override
    public void saveAll(List<OrderItemEntity> orderItems) {
        jpaOrderItemRepository.saveAll(orderItems);
    }

    @Override
    public List<OrderEntity> saveAllOrder(List<OrderEntity> orders) {
        return jpaOrderRepository.saveAll(orders);
    }

    @Override
    public void delete(OrderEntity order) {
        jpaOrderRepository.delete(order);
    }

    @Override
    public List<OrderEntity> findByUserId(Long userId) {
        return jpaOrderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}

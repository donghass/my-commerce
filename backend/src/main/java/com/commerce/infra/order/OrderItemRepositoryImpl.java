package com.commerce.infra.order;

import com.commerce.domain.order.OrderItemEntity;
import com.commerce.domain.order.OrderItemRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class OrderItemRepositoryImpl implements OrderItemRepository {

    private final JpaOrderItemRepository jpaOrderItemRepository;

    @Override
    public OrderItemEntity save(OrderItemEntity orderItem) {
        return jpaOrderItemRepository.save(orderItem);
    }

    @Override
    public List<OrderItemEntity> findByOrderId(Long orderId) {
        return jpaOrderItemRepository.findByOrderId(orderId);
    }

    @Override
    public void saveAll(List<OrderItemEntity> orderItems) {
        jpaOrderItemRepository.saveAll(orderItems);
    }

    @Override
    public void delete(OrderItemEntity orderItem) {
        jpaOrderItemRepository.delete(orderItem);
    }
}

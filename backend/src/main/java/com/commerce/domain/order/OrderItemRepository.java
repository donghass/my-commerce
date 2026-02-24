package com.commerce.domain.order;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository {

    OrderItemEntity save(OrderItemEntity orderItem);

    List<OrderItemEntity> findByOrderId(Long orderId);

    void saveAll(List<OrderItemEntity> orderItems);

    void delete(OrderItemEntity orderItem);
}

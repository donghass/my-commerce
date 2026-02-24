package com.commerce.domain.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Builder
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "user_id")
    private Long userId;

    @Column(nullable = true, name = "coupon_id")
    private Long couponId;

    @Builder.Default
    @Column(nullable = false, name = "total_amount")
    private Long totalAmount = 0L;

    @Builder.Default
    @Column(nullable = false, name = "status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false, name = "created_at")
    @CreationTimestamp
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false, name = "updated_at")
    @UpdateTimestamp
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Builder.Default
    @OneToMany(mappedBy = "order", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItemEntity> orderItems = new ArrayList<>();

    public static OrderEntity create(Long userId, Long couponId) {
        return OrderEntity.builder()
            .userId(userId)
            .couponId(couponId)
            .status(OrderStatus.PENDING)
            .totalAmount(0L)
            .build();
    }

    public void addOrderItem(Long productId, Long quantity, Long amount) {
        OrderItemEntity item = OrderItemEntity.create(productId, this, quantity, amount);
        this.orderItems.add(item);
        this.totalAmount += amount;
    }

    public void updateStatus(OrderStatus status) {
        this.status = status;
    }

    public void applyCouponDiscount(Long discountAmount) {
        this.totalAmount -= discountAmount;
    }
}

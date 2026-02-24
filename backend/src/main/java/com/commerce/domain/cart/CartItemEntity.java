package com.commerce.domain.cart;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CartItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @Setter
    private CartEntity cart;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productName;

    private String imageUrl;

    @Column(nullable = false)
    private Long quantity;

    @Column(nullable = false)
    private Long price;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public static CartItemEntity create(Long productId, String productName, String imageUrl, Long quantity, Long price) {
        return CartItemEntity.builder()
                .productId(productId)
                .productName(productName)
                .imageUrl(imageUrl)
                .quantity(quantity)
                .price(price)
                .build();
    }

    public void updateQuantity(Long quantity) {
        this.quantity = quantity;
    }
}

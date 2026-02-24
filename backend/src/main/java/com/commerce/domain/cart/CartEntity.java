package com.commerce.domain.cart;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItemEntity> items = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static CartEntity create(Long userId) {
        return CartEntity.builder()
                .userId(userId)
                .build();
    }

    public void addItem(CartItemEntity item) {
        this.items.add(item);
        item.setCart(this);
        this.updatedAt = LocalDateTime.now();
    }

    public void removeItem(CartItemEntity item) {
        this.items.remove(item);
        this.updatedAt = LocalDateTime.now();
    }

    public void clearItems() {
        this.items.clear();
        this.updatedAt = LocalDateTime.now();
    }
}

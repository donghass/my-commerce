package com.commerce.domain.product;

import com.commerce.common.exception.BusinessException;
import com.commerce.domain.product.exception.ProductErrorCode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    @Builder.Default
    private Long stock = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    private String imageUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static ProductEntity create(String name, String description, Long price, Long stock, CategoryEntity category, String imageUrl) {
        return ProductEntity.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .category(category)
                .imageUrl(imageUrl)
                .build();
    }

    public void update(String name, String description, Long price, Long stock, CategoryEntity category, String imageUrl) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.imageUrl = imageUrl;
        this.updatedAt = LocalDateTime.now();
    }

    public void decreaseStock(Long quantity) {
        if (quantity > this.stock) {
            throw new BusinessException(ProductErrorCode.INSUFFICIENT_STOCK);
        }
        this.stock -= quantity;
        this.updatedAt = LocalDateTime.now();
    }

    public void increaseStock(Long quantity) {
        this.stock += quantity;
        this.updatedAt = LocalDateTime.now();
    }
}

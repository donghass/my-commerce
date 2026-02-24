package com.commerce.infra.product;

import com.commerce.domain.product.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaProductRepository extends JpaRepository<ProductEntity, Long> {
    Page<ProductEntity> findByCategoryId(Long categoryId, Pageable pageable);
    List<ProductEntity> findByNameContaining(String keyword);
}

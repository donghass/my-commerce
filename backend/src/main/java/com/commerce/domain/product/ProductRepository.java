package com.commerce.domain.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    ProductEntity save(ProductEntity product);
    Optional<ProductEntity> findById(Long id);
    Page<ProductEntity> findPagedProducts(Pageable pageable);
    Page<ProductEntity> findByCategoryId(Long categoryId, Pageable pageable);
    List<ProductEntity> findByNameContaining(String keyword);
    void deleteById(Long id);
}

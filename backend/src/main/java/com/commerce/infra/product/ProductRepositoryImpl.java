package com.commerce.infra.product;

import com.commerce.domain.product.ProductEntity;
import com.commerce.domain.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepository {

    private final JpaProductRepository jpaProductRepository;

    @Override
    public ProductEntity save(ProductEntity product) {
        return jpaProductRepository.save(product);
    }

    @Override
    public Optional<ProductEntity> findById(Long id) {
        return jpaProductRepository.findById(id);
    }

    @Override
    public Page<ProductEntity> findPagedProducts(Pageable pageable) {
        return jpaProductRepository.findAll(pageable);
    }

    @Override
    public Page<ProductEntity> findByCategoryId(Long categoryId, Pageable pageable) {
        return jpaProductRepository.findByCategoryId(categoryId, pageable);
    }

    @Override
    public List<ProductEntity> findByNameContaining(String keyword) {
        return jpaProductRepository.findByNameContaining(keyword);
    }

    @Override
    public void deleteById(Long id) {
        jpaProductRepository.deleteById(id);
    }
}

package com.commerce.domain.product;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository {
    CategoryEntity save(CategoryEntity category);
    Optional<CategoryEntity> findById(Long id);
    List<CategoryEntity> findAll();
    void deleteById(Long id);
}

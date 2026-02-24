package com.commerce.infra.product;

import com.commerce.domain.product.CategoryEntity;
import com.commerce.domain.product.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CategoryRepositoryImpl implements CategoryRepository {

    private final JpaCategoryRepository jpaCategoryRepository;

    @Override
    public CategoryEntity save(CategoryEntity category) {
        return jpaCategoryRepository.save(category);
    }

    @Override
    public Optional<CategoryEntity> findById(Long id) {
        return jpaCategoryRepository.findById(id);
    }

    @Override
    public List<CategoryEntity> findAll() {
        return jpaCategoryRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        jpaCategoryRepository.deleteById(id);
    }
}

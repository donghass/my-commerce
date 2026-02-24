package com.commerce.application.category;

import com.commerce.domain.product.CategoryEntity;
import com.commerce.domain.product.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryFacade {

    private final CategoryService categoryService;

    public List<CategoryResult> getAllCategories() {
        List<CategoryEntity> categories = categoryService.getAllCategories();
        return categories.stream()
                .map(CategoryResult::from)
                .collect(Collectors.toList());
    }

    public CategoryResult getCategory(Long id) {
        CategoryEntity category = categoryService.getCategoryById(id);
        return CategoryResult.from(category);
    }

    public CategoryResult createCategory(String name) {
        CategoryEntity category = categoryService.createCategory(name);
        return CategoryResult.from(category);
    }

    public CategoryResult updateCategory(Long id, String name) {
        CategoryEntity category = categoryService.updateCategory(id, name);
        return CategoryResult.from(category);
    }

    public void deleteCategory(Long id) {
        categoryService.deleteCategory(id);
    }
}

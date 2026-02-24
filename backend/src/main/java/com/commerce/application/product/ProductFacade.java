package com.commerce.application.product;

import com.commerce.domain.product.ProductEntity;
import com.commerce.domain.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductFacade {

    private final ProductService productService;

    @Transactional
    public ProductResult createProduct(ProductCommand command) {
        ProductEntity product = productService.createProduct(
                command.name(),
                command.description(),
                command.price(),
                command.stock(),
                command.categoryId(),
                command.imageUrl()
        );
        return ProductResult.from(product);
    }

    @Transactional(readOnly = true)
    public ProductResult getProduct(Long productId) {
        ProductEntity product = productService.findById(productId);
        return ProductResult.from(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductResult> getProducts(Pageable pageable) {
        return productService.getProducts(pageable)
                .map(ProductResult::from);
    }

    @Transactional(readOnly = true)
    public Page<ProductResult> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productService.getProductsByCategory(categoryId, pageable)
                .map(ProductResult::from);
    }

    @Transactional(readOnly = true)
    public List<ProductResult> searchProducts(String keyword) {
        return productService.searchProducts(keyword).stream()
                .map(ProductResult::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResult updateProduct(Long productId, ProductCommand command) {
        ProductEntity product = productService.updateProduct(
                productId,
                command.name(),
                command.description(),
                command.price(),
                command.stock(),
                command.categoryId(),
                command.imageUrl()
        );
        return ProductResult.from(product);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        productService.deleteProduct(productId);
    }
}

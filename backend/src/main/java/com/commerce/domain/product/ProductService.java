package com.commerce.domain.product;

import com.commerce.common.exception.BusinessException;
import com.commerce.domain.product.exception.ProductErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductEntity createProduct(String name, String description, Long price, Long stock, Long categoryId, String imageUrl) {
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.CATEGORY_NOT_FOUND));

        ProductEntity product = ProductEntity.create(name, description, price, stock, category, imageUrl);
        return productRepository.save(product);
    }

    public ProductEntity findById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));
    }

    public Page<ProductEntity> getProducts(Pageable pageable) {
        return productRepository.findPagedProducts(pageable);
    }

    public Page<ProductEntity> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }

    public List<ProductEntity> searchProducts(String keyword) {
        return productRepository.findByNameContaining(keyword);
    }

    @Transactional
    public ProductEntity updateProduct(Long productId, String name, String description, Long price, Long stock, Long categoryId, String imageUrl) {
        ProductEntity product = findById(productId);
        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ProductErrorCode.CATEGORY_NOT_FOUND));

        product.update(name, description, price, stock, category, imageUrl);
        return product;
    }

    @Transactional
    public void deleteProduct(Long productId) {
        if (!productRepository.findById(productId).isPresent()) {
            throw new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND);
        }
        productRepository.deleteById(productId);
    }

    @Transactional
    public void decreaseStock(Long productId, Long quantity) {
        ProductEntity product = findById(productId);
        product.decreaseStock(quantity);
    }

    @Transactional
    public void increaseStock(Long productId, Long quantity) {
        ProductEntity product = findById(productId);
        product.increaseStock(quantity);
    }
}

package com.commerce.api.product;

import com.commerce.application.product.ProductCommand;
import com.commerce.application.product.ProductFacade;
import com.commerce.application.product.ProductResult;
import com.commerce.common.response.CommonResponse;
import com.commerce.common.response.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "상품", description = "상품 관련 API")
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductFacade productFacade;

    @Operation(summary = "상품 목록 조회", description = "페이징된 상품 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<CommonResponse<Page<ProductResponse>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResult> results = productFacade.getProducts(pageable);
        Page<ProductResponse> response = results.map(ProductResponse::from);

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "상품 상세 조회", description = "상품 ID로 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<CommonResponse<ProductResponse>> getProduct(@PathVariable Long id) {
        ProductResult result = productFacade.getProduct(id);
        ProductResponse response = ProductResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "카테고리별 상품 조회", description = "특정 카테고리의 상품 목록을 조회합니다.")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<CommonResponse<Page<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResult> results = productFacade.getProductsByCategory(categoryId, pageable);
        Page<ProductResponse> response = results.map(ProductResponse::from);

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "상품 검색", description = "키워드로 상품을 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<CommonResponse<List<ProductResponse>>> searchProducts(
            @RequestParam String keyword
    ) {
        List<ProductResult> results = productFacade.searchProducts(keyword);
        List<ProductResponse> response = results.stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "상품 등록", description = "새로운 상품을 등록합니다. (관리자 전용)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request
    ) {
        ProductCommand command = new ProductCommand(
                request.name(),
                request.description(),
                request.price(),
                request.stock(),
                request.categoryId(),
                request.imageUrl()
        );

        ProductResult result = productFacade.createProduct(command);
        ProductResponse response = ProductResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(ResponseCode.CREATED, response));
    }

    @Operation(summary = "상품 수정", description = "기존 상품 정보를 수정합니다. (관리자 전용)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        ProductCommand command = new ProductCommand(
                request.name(),
                request.description(),
                request.price(),
                request.stock(),
                request.categoryId(),
                request.imageUrl()
        );

        ProductResult result = productFacade.updateProduct(id, command);
        ProductResponse response = ProductResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "상품 삭제", description = "상품을 삭제합니다. (관리자 전용)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse<Void>> deleteProduct(@PathVariable Long id) {
        productFacade.deleteProduct(id);
        return ResponseEntity.ok(CommonResponse.success(null));
    }
}

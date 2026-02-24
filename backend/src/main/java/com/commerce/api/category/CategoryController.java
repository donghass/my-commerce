package com.commerce.api.category;

import com.commerce.application.category.CategoryFacade;
import com.commerce.application.category.CategoryResult;
import com.commerce.common.response.CommonResponse;
import com.commerce.common.response.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "카테고리", description = "카테고리 관련 API")
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryFacade categoryFacade;

    @Operation(summary = "카테고리 목록 조회", description = "모든 카테고리 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<CommonResponse<List<CategoryResponse>>> getCategories() {
        List<CategoryResult> results = categoryFacade.getAllCategories();
        List<CategoryResponse> response = results.stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "카테고리 상세 조회", description = "카테고리 ID로 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<CommonResponse<CategoryResponse>> getCategory(@PathVariable Long id) {
        CategoryResult result = categoryFacade.getCategory(id);
        CategoryResponse response = CategoryResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "카테고리 생성", description = "새로운 카테고리를 생성합니다. (관리자 전용)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse<CategoryResponse>> createCategory(@RequestBody CategoryRequest request) {
        CategoryResult result = categoryFacade.createCategory(request.name());
        CategoryResponse response = CategoryResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(ResponseCode.CREATED, response));
    }

    @Operation(summary = "카테고리 수정", description = "기존 카테고리 정보를 수정합니다. (관리자 전용)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request
    ) {
        CategoryResult result = categoryFacade.updateCategory(id, request.name());
        CategoryResponse response = CategoryResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "카테고리 삭제", description = "카테고리를 삭제합니다. (관리자 전용)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryFacade.deleteCategory(id);
        return ResponseEntity.ok(CommonResponse.success(null));
    }
}

package com.commerce.domain.product.exception;

import com.commerce.common.response.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ProductErrorCode implements BaseResponseCode {
    PRODUCT_NOT_FOUND(404, "NOT_FOUND", "상품을 찾을 수 없습니다."),
    CATEGORY_NOT_FOUND(404, "NOT_FOUND", "카테고리를 찾을 수 없습니다."),
    INSUFFICIENT_STOCK(409, "CONFLICT", "재고가 부족합니다."),
    INVALID_QUANTITY(400, "BAD_REQUEST", "잘못된 수량입니다.");

    private final int code;
    private final String status;
    private final String message;
}

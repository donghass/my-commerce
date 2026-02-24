package com.commerce.domain.cart.exception;

import com.commerce.common.response.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CartErrorCode implements BaseResponseCode {
    CART_NOT_FOUND(404, "NOT_FOUND", "장바구니를 찾을 수 없습니다."),
    CART_ITEM_NOT_FOUND(404, "NOT_FOUND", "장바구니 아이템을 찾을 수 없습니다.");

    private final int code;
    private final String status;
    private final String message;
}

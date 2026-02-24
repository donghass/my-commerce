package com.commerce.domain.order.exception;

import com.commerce.common.response.BaseResponseCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderErrorCode implements BaseResponseCode {

    // 400 - 잘못된 요청
    INVALID_USER_ID(400, "Invalid User ID", "유효하지 않은 사용자 ID입니다."),
    INVALID_ORDER_ID(400, "Invalid Order ID", "유효하지 않은 주문 ID입니다."),
    INVALID_QUANTITY(400, "Invalid Quantity", "수량은 1 이상이어야 합니다."),

    // 404 - 리소스 없음
    USER_NOT_FOUND(404, "User Not Found", "사용자를 찾을 수 없습니다."),
    ORDER_NOT_FOUND(404, "Order Not Found", "주문을 찾을 수 없습니다."),
    ORDER_ITEM_NOT_FOUND(404, "Order Item Not Found", "주문상품을 찾을 수 없습니다."),

    // 409 - 비즈니스 충돌
    ORDER_STATUS_INVALID(409, "Order Status Invalid", "결제가 불가능한 주문 상태입니다."),
    INSUFFICIENT_STOCK(409, "Insufficient Stock", "재고가 부족합니다.");

    private final int code;
    private final String status;
    private final String message;
}

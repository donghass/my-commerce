package com.commerce.domain.order;

public enum OrderStatus {
    PENDING,      // 대기 중
    CONFIRMED,    // 확인됨
    SHIPPED,      // 배송됨
    DELIVERED,    // 배송 완료
    CANCELLED     // 취소됨
}

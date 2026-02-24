package com.commerce.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponseCode implements BaseResponseCode {
    // Success
    SUCCESS(200, "SUCCESS", "요청이 정상적으로 처리되었습니다."),
    CREATED(201, "CREATED", "리소스가 성공적으로 생성되었습니다."),

    // Client Errors
    BAD_REQUEST(400, "BAD_REQUEST", "잘못된 요청입니다."),
    UNAUTHORIZED(401, "UNAUTHORIZED", "인증이 필요합니다."),
    FORBIDDEN(403, "FORBIDDEN", "접근 권한이 없습니다."),
    NOT_FOUND(404, "NOT_FOUND", "요청한 리소스를 찾을 수 없습니다."),
    CONFLICT(409, "CONFLICT", "요청이 현재 서버 상태와 충돌합니다."),

    // Server Errors
    INTERNAL_ERROR(500, "INTERNAL_ERROR", "서버 오류가 발생했습니다."),

    // Custom Errors
    VALIDATION_FAILED(400, "VALIDATION_FAILED", "입력값 검증에 실패했습니다."),
    DUPLICATE_RESOURCE(409, "DUPLICATE_RESOURCE", "이미 존재하는 리소스입니다."),
    LOCK_ACQUISITION_FAILED(500, "LOCK_ACQUISITION_FAILED", "락 획득에 실패했습니다.");

    private final int code;
    private final String status;
    private final String message;
}

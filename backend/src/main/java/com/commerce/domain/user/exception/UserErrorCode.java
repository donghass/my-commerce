package com.commerce.domain.user.exception;

import com.commerce.common.response.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserErrorCode implements BaseResponseCode {
    USER_NOT_FOUND(404, "NOT_FOUND", "사용자를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(409, "CONFLICT", "이미 존재하는 이메일입니다."),
    INVALID_PASSWORD(400, "BAD_REQUEST", "비밀번호가 일치하지 않습니다."),
    INVALID_CREDENTIALS(401, "UNAUTHORIZED", "이메일 또는 비밀번호가 잘못되었습니다.");

    private final int code;
    private final String status;
    private final String message;
}

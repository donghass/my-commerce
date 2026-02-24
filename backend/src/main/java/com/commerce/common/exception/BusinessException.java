package com.commerce.common.exception;

import com.commerce.common.response.BaseResponseCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final BaseResponseCode baseResponseCode;

    public BusinessException(BaseResponseCode baseResponseCode) {
        super(baseResponseCode.getMessage());
        this.baseResponseCode = baseResponseCode;
    }

    public BusinessException(BaseResponseCode baseResponseCode, String customMessage) {
        super(customMessage);
        this.baseResponseCode = baseResponseCode;
    }
}

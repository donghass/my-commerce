package com.commerce.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommonResponse<T> {
    private int code;
    private String status;
    private String message;
    private Timestamp createdAt;
    private T data;

    public static <T> CommonResponse<T> success(BaseResponseCode responseCode, T data) {
        return CommonResponse.<T>builder()
                .code(responseCode.getCode())
                .status(responseCode.getStatus())
                .message(responseCode.getMessage())
                .data(data)
                .createdAt(Timestamp.from(Instant.now()))
                .build();
    }

    public static <T> CommonResponse<T> success(T data) {
        return success(ResponseCode.SUCCESS, data);
    }

    public static <T> CommonResponse<T> fail(BaseResponseCode responseCode) {
        return CommonResponse.<T>builder()
                .code(responseCode.getCode())
                .status(responseCode.getStatus())
                .message(responseCode.getMessage())
                .createdAt(Timestamp.from(Instant.now()))
                .build();
    }

    public static <T> CommonResponse<T> fail(BaseResponseCode responseCode, String customMessage) {
        return CommonResponse.<T>builder()
                .code(responseCode.getCode())
                .status(responseCode.getStatus())
                .message(customMessage)
                .createdAt(Timestamp.from(Instant.now()))
                .build();
    }
}

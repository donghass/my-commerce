package com.commerce.api.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangePasswordRequest(
    @NotBlank(message = "현재 비밀번호를 입력해주세요")
    String oldPassword,

    @NotBlank(message = "새 비밀번호를 입력해주세요")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$",
        message = "비밀번호는 최소 8자 이상이며 숫자와 특수문자를 포함해야 합니다"
    )
    String newPassword
) {
}

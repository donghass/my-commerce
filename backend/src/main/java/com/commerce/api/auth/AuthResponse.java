package com.commerce.api.auth;

import com.commerce.application.auth.AuthResult;
import com.commerce.domain.user.UserRole;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthResponse(
        Long userId,
        String email,
        String name,
        UserRole role,
        String accessToken,
        String refreshToken
) {
    public static AuthResponse from(AuthResult result) {
        return AuthResponse.builder()
                .userId(result.userId())
                .email(result.email())
                .name(result.name())
                .role(result.role())
                .accessToken(result.accessToken())
                .refreshToken(result.refreshToken())
                .build();
    }
}

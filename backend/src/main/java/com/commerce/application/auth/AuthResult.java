package com.commerce.application.auth;

import com.commerce.domain.user.UserEntity;
import com.commerce.domain.user.UserRole;
import lombok.Builder;

@Builder
public record AuthResult(
        Long userId,
        String email,
        String name,
        UserRole role,
        String accessToken,
        String refreshToken
) {
    public static AuthResult of(UserEntity user, String accessToken, String refreshToken) {
        return AuthResult.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public static AuthResult from(UserEntity user) {
        return AuthResult.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }
}

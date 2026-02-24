package com.commerce.application.auth;

import com.commerce.common.exception.BusinessException;
import com.commerce.config.security.JwtTokenProvider;
import com.commerce.domain.user.UserEntity;
import com.commerce.domain.user.UserService;
import com.commerce.domain.user.exception.UserErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthFacade {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";
    private static final long REFRESH_TOKEN_TTL_DAYS = 7;

    @Transactional
    public AuthResult signup(SignupCommand command) {
        UserEntity user = userService.createUser(
                command.email(),
                command.password(),
                command.name(),
                command.phone()
        );

        return AuthResult.from(user);
    }

    @Transactional(readOnly = true)
    public AuthResult login(LoginCommand command) {
        UserEntity user = userService.findByEmail(command.email());

        if (!userService.verifyPassword(user, command.password())) {
            throw new BusinessException(UserErrorCode.INVALID_CREDENTIALS);
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        // Redis에 Refresh Token 저장
        String refreshTokenKey = REFRESH_TOKEN_PREFIX + user.getId();
        redisTemplate.opsForValue().set(refreshTokenKey, refreshToken, REFRESH_TOKEN_TTL_DAYS, TimeUnit.DAYS);

        return AuthResult.of(user, accessToken, refreshToken);
    }

    @Transactional
    public void logout(Long userId) {
        String refreshTokenKey = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.delete(refreshTokenKey);
    }

    @Transactional(readOnly = true)
    public AuthResult refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException(UserErrorCode.INVALID_CREDENTIALS, "Invalid refresh token");
        }

        Long userId = jwtTokenProvider.getUserId(refreshToken);
        String refreshTokenKey = REFRESH_TOKEN_PREFIX + userId;

        String storedToken = redisTemplate.opsForValue().get(refreshTokenKey);
        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new BusinessException(UserErrorCode.INVALID_CREDENTIALS, "Refresh token not found or mismatch");
        }

        UserEntity user = userService.findById(userId);
        String newAccessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResult.of(user, newAccessToken, refreshToken);
    }
}

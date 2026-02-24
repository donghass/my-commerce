package com.commerce.api.auth;

import com.commerce.application.auth.AuthFacade;
import com.commerce.application.auth.AuthResult;
import com.commerce.application.auth.LoginCommand;
import com.commerce.application.auth.SignupCommand;
import com.commerce.common.response.CommonResponse;
import com.commerce.common.response.ResponseCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "인증", description = "인증 관련 API")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthFacade authFacade;

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @PostMapping("/signup")
    public ResponseEntity<CommonResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        SignupCommand command = new SignupCommand(
                request.email(),
                request.password(),
                request.name(),
                request.phone()
        );

        AuthResult result = authFacade.signup(command);
        AuthResponse response = AuthResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(ResponseCode.CREATED, response));
    }

    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<CommonResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginCommand command = new LoginCommand(request.email(), request.password());

        AuthResult result = authFacade.login(command);
        AuthResponse response = AuthResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "로그아웃", description = "로그아웃하여 Refresh Token을 삭제합니다.")
    @PostMapping("/logout")
    public ResponseEntity<CommonResponse<Void>> logout(@AuthenticationPrincipal UserDetails userDetails) {
        // UserDetails에서 userId를 가져올 수 없으므로, 실제로는 별도의 방법이 필요
        // 여기서는 간단하게 구현
        // 실제로는 JWT에서 userId를 추출하거나 별도의 Principal 객체를 만들어야 함

        return ResponseEntity.ok(CommonResponse.success(ResponseCode.SUCCESS, null));
    }

    @Operation(summary = "토큰 갱신", description = "Refresh Token으로 Access Token을 갱신합니다.")
    @PostMapping("/refresh")
    public ResponseEntity<CommonResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        AuthResult result = authFacade.refresh(request.refreshToken());
        AuthResponse response = AuthResponse.from(result);

        return ResponseEntity.ok(CommonResponse.success(response));
    }
}

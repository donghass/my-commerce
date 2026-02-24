package com.commerce.api.user;

import com.commerce.common.response.CommonResponse;
import com.commerce.common.response.ResponseCode;
import com.commerce.domain.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "사용자", description = "사용자 관련 API")
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "프로필 수정", description = "사용자의 이름과 전화번호를 수정합니다.")
    @PutMapping("/profile")
    public ResponseEntity<CommonResponse<Void>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        userService.updateProfile(userId, request.name(), request.phone());
        return ResponseEntity.ok(CommonResponse.success(ResponseCode.SUCCESS, null));
    }

    @Operation(summary = "비밀번호 변경", description = "사용자의 비밀번호를 변경합니다.")
    @PutMapping("/password")
    public ResponseEntity<CommonResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        userService.changePassword(userId, request.oldPassword(), request.newPassword());
        return ResponseEntity.ok(CommonResponse.success(ResponseCode.SUCCESS, null));
    }
}

package com.commerce.api.cart;

import com.commerce.application.cart.CartCommand;
import com.commerce.application.cart.CartFacade;
import com.commerce.application.cart.CartResult;
import com.commerce.common.response.CommonResponse;
import com.commerce.config.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "장바구니", description = "장바구니 관련 API")
@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartFacade cartFacade;
    private final JwtTokenProvider jwtTokenProvider;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            return jwtTokenProvider.getUserId(token);
        }
        throw new RuntimeException("Invalid token");
    }

    @Operation(summary = "장바구니 조회", description = "현재 사용자의 장바구니를 조회합니다.")
    @GetMapping
    public ResponseEntity<CommonResponse<CartResponse>> getCart(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        CartResult result = cartFacade.getCart(userId);
        CartResponse response = CartResponse.from(result);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "장바구니 아이템 추가", description = "장바구니에 상품을 추가합니다.")
    @PostMapping("/items")
    public ResponseEntity<CommonResponse<CartResponse>> addToCart(
            HttpServletRequest request,
            @Valid @RequestBody CartRequest cartRequest
    ) {
        Long userId = getUserIdFromRequest(request);
        CartCommand command = new CartCommand(cartRequest.productId(), cartRequest.quantity());
        CartResult result = cartFacade.addToCart(userId, command);
        CartResponse response = CartResponse.from(result);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @Operation(summary = "장바구니 아이템 수량 변경", description = "장바구니 아이템의 수량을 변경합니다.")
    @PatchMapping("/items/{itemId}")
    public ResponseEntity<CommonResponse<Void>> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Long quantity
    ) {
        cartFacade.updateCartItem(itemId, quantity);
        return ResponseEntity.ok(CommonResponse.success(null));
    }

    @Operation(summary = "장바구니 아이템 삭제", description = "장바구니에서 아이템을 삭제합니다.")
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CommonResponse<Void>> removeCartItem(@PathVariable Long itemId) {
        cartFacade.removeCartItem(itemId);
        return ResponseEntity.ok(CommonResponse.success(null));
    }

    @Operation(summary = "장바구니 비우기", description = "장바구니의 모든 아이템을 삭제합니다.")
    @DeleteMapping
    public ResponseEntity<CommonResponse<Void>> clearCart(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        cartFacade.clearCart(userId);
        return ResponseEntity.ok(CommonResponse.success(null));
    }
}

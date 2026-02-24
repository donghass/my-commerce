package com.commerce.api.order;

import com.commerce.application.order.OrderFacade;
import com.commerce.application.order.OrderResult;
import com.commerce.common.response.CommonResponse;
import com.commerce.common.response.ResponseCode;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderFacade orderFacade;

    @PostMapping
    public ResponseEntity<CommonResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
        // 실제 구현에서는 장바구니에서 상품 정보를 가져와야 함
        // 여기서는 임시로 빈 리스트 전달
        OrderResult orderResult = orderFacade.createOrder(request.toCommand(), java.util.List.of());

        CommonResponse<OrderResponse> response = CommonResponse.success(
            ResponseCode.SUCCESS,
            OrderResponse.from(orderResult)
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<CommonResponse<List<OrderResponse>>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        List<OrderResult> orderResults = orderFacade.getOrdersByUserId(userId);

        List<OrderResponse> responses = orderResults.stream()
            .map(OrderResponse::from)
            .collect(Collectors.toList());

        CommonResponse<List<OrderResponse>> response = CommonResponse.success(
            ResponseCode.SUCCESS,
            responses
        );

        return ResponseEntity.ok(response);
    }
}

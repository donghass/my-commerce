package com.commerce.application.auth;

public record SignupCommand(
        String email,
        String password,
        String name,
        String phone
) {
}

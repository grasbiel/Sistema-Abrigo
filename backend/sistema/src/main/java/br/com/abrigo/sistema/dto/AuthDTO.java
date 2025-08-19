package br.com.abrigo.sistema.dto;

import jakarta.validation.constraints.NotBlank;


public class AuthDTO {
    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

    
    public record LoginResponse(String accessToken, String refreshToken) {}
    
    public record TokenRefreshRequest(@NotBlank String refreshToken) {}

    public record TokenRefreshResponse(String accessToken, String refreshToken) {}
}
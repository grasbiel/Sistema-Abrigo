package br.com.abrigo.sistema.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Usuário não pode ser vazio")
    String username,
    @NotBlank(message = "Senha não pode ser vazia")
    String password
) {}

public record LoginResponse(
    String accessToken,
    String refreshToken
) {}

public record TokenRefreshRequest(
    @NotBlank(message = "O refresh token é obrigatório")
    String refreshToken
) {}

public record TokenRefreshResponse(
    String accessToken,
    String refreshToken
) {}
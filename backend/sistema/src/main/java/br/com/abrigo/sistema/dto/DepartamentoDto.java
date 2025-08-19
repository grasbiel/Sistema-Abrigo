package br.com.abrigo.sistema.dto;

import jakarta.validation.constraints.NotBlank;

public class DepartamentoDto {
    public record DepartamentoRequest (
        @NotBlank (message = "O nome do departamento é obrigatório")
        String nome
    ) {}

    public record DepartamentoResponse (
        Long id,
        String nome
    ) {}
}

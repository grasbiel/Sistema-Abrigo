package br.com.abrigo.sistema.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

public class CriancaDto {

    public record CriancaRequest(
        @NotBlank(message = "Nome completo é obrigatório")
        String nome_completo,

        @NotNull(message = "Data de nascimento é obrigatória")
        @PastOrPresent(message = "Data de nascimento não pode ser no futuro")
        LocalDate data_nascimento,

        @NotNull(message = "Data de entrada é obrigatória")
        @PastOrPresent(message = "Data de entrada não pode ser no futuro")
        LocalDate data_entrada
    ) {}

    public record CriancaResponse(
        Long id,
        String nome_completo,
        LocalDate data_nascimento,
        Integer idade,
        boolean status_acolhimento,
        LocalDate data_entrada,
        LocalDate data_saida
    ) {}
}
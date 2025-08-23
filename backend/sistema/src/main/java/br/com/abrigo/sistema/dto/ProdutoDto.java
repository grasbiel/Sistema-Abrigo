package br.com.abrigo.sistema.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class ProdutoDto {

    // DTO para requisições de criação/atualização de um produto
    public record ProdutoRequest(
        @NotBlank String nome,
        String marca,
        @NotBlank String unidade_medida,
        BigDecimal tamanho,
        @NotNull Long departamentoId,
        String descricao_adicional,
        String codigo_barras,
        @NotNull @PositiveOrZero BigDecimal quantidade_minima
    ) {}

    // DTO para respostas, mostrando os dados formatados do produto
    public record ProdutoResponse(
        Long id,
        String nome,
        String marca,
        String unidade_medida,
        BigDecimal tamanho,
        String departamentoNome,
        String descricao_adicional,
        String codigo_barras,
        BigDecimal quantidade_em_estoque,
        BigDecimal quantidade_minima,
        String displayName
    ) {}
}
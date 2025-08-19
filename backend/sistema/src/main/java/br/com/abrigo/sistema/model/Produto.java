package br.com.abrigo.sistema.model;

import java.math.BigDecimal;
import java.util.List;

import br.com.abrigo.sistema.enums.UnidadeMedida;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
public class Produto {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String marca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnidadeMedida unidadeMedida;

    @Column (precision = 10, scale = 3)
    private BigDecimal tamanho;

    @Column(length = 1000)
    private String descricaoAdicional; 
    
    @Column(unique = true)
    private String codigoBarras;

    @Column(nullable = false, precision = 10, scale=2)
    private BigDecimal quantidadeEmEstoque = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantidadeMinima;

    @ManyToOne(fetch =FetchType.LAZY) // Muitos produtos para um departamento
    @JoinColumn(name = "departamento_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Departamento departamento;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Movimentacao> movimentacoes;

    @Override
    public String toString() {
        StringBuilder displayName = new StringBuilder(nome);
        if (marca != null && !marca.isEmpty()) {
            displayName.append(" ").append(tamanho.stripTrailingZeros().toPlainString());
            if (unidadeMedida != null) {
                
                displayName.append(getUnidadeMedidaSigla());
            }
        }
        return displayName.toString();
    }

    private String getUnidadeMedidaSigla() {
        if (unidadeMedida == null) return "";

        return switch (unidadeMedida) {
            case QUILOGRAMA -> "kg";
            case GRAMA -> "g";
            case LITRO -> "L";
            case MILILITRO -> "mL";
            case MILIGRAMA -> "mG";
            default -> "";
        };
    }
    

}


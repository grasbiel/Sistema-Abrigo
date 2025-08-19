package br.com.abrigo.sistema.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import br.com.abrigo.sistema.enums.StatusMovimentacao;
import br.com.abrigo.sistema.enums.TipoMovimentacao;
import jakarta.persistence.*;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
public class Movimentacao {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable= false, precision =10, scale =2)
    private BigDecimal quantidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimentacao tipo;

    @Enumerated (EnumType.STRING)
    @Column(nullable = false)
    private StatusMovimentacao status;

    private LocalDate dataValidade;

    @Column(precision = 10, scale =2 )
    private BigDecimal precoUnitarioDoacao;

    @Column(length = 1000)
    private String justificativa;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataMovimentacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "produto_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Produto produto;

    @ManyToOne (fetch = FetchType.LAZY )
    @JoinColumn (name = "validado_por_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario registradoPor;

    @PrePersist
    protected void onCreate() {
        this.dataMovimentacao = LocalDateTime.now();
        this.status = StatusMovimentacao.PENDENTE;
    }

}

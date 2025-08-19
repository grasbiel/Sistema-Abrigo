package br.com.abrigo.sistema.model;

import java.beans.Transient;
import java.time.LocalDate;
import java.time.Period;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Crianca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeCompleto;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false)
    private boolean statusAcolhimento = true;

    @Column(nullable = false)
    private LocalDate dataEntrada;

    private LocalDate dataSaida;

    @Transient
    public Integer getIdade(){
        if (this.dataNascimento == null ){
            return null;
        }

        return Period.between(this.dataNascimento, LocalDate.now()).getYears();
    }

    



}

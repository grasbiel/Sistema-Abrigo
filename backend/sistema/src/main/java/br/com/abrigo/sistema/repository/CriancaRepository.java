package br.com.abrigo.sistema.repository;

import org.springframework.stereotype.Repository;

import br.com.abrigo.sistema.model.Crianca;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CriancaRepository extends JpaRepository<Crianca, Long> {
    

}

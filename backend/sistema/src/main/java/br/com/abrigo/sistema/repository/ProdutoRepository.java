package br.com.abrigo.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.abrigo.sistema.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository <Produto, Long> {

}

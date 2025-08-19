package br.com.abrigo.sistema.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.abrigo.sistema.model.Usuario;

public interface UsuarioRepository extends JpaRepository <Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
}

package br.com.abrigo.sistema.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.abrigo.sistema.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}

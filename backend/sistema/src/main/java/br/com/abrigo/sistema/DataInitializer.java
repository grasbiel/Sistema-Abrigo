package br.com.abrigo.sistema;

import br.com.abrigo.sistema.model.Role;
import br.com.abrigo.sistema.model.Usuario;
import br.com.abrigo.sistema.repository.RoleRepository;
import br.com.abrigo.sistema.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Cria os Roles se não existirem
        if (roleRepository.findByName("ROLE_CONTROLADOR") == null) {
            roleRepository.save(new Role("ROLE_CONTROLADOR"));
        }
        if (roleRepository.findByName("ROLE_REGISTRADOR") == null) {
            roleRepository.save(new Role("ROLE_REGISTRADOR"));
        }

        // Cria o usuário administrador padrão se nenhum usuário existir
        if (usuarioRepository.count() == 0) {
            Role controladorRole = roleRepository.findByName("ROLE_CONTROLADOR");
            
            Usuario adminUser = new Usuario();
            adminUser.setUsername("controlador");
            // Criptografa a senha antes de salvar
            adminUser.setPassword(passwordEncoder.encode("123456"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("do Sistema");
            adminUser.setEnabled(true);
            adminUser.setRoles(List.of(controladorRole));
            
            usuarioRepository.save(adminUser);
        }
    }
}
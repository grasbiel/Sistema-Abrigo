package br.com.abrigo.sistema.controller;

import br.com.abrigo.sistema.dto.CriancaDto;
import br.com.abrigo.sistema.service.CriancaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/criancas")
public class CriancaController {

    @Autowired
    private CriancaService criancaService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CONTROLADOR')")
    public ResponseEntity<CriancaDto.CriancaResponse> createCrianca(@RequestBody @Valid CriancaDto.CriancaRequest request, UriComponentsBuilder uriBuilder) {
        CriancaDto.CriancaResponse response = criancaService.createCrianca(request);
        URI uri = uriBuilder.path("/api/criancas/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_CONTROLADOR', 'ROLE_REGISTRADOR')")
    public ResponseEntity<Page<CriancaDto.CriancaResponse>> findAllCriancas(Pageable pageable) {
        Page<CriancaDto.CriancaResponse> response = criancaService.findAllCriancas(pageable);
        return ResponseEntity.ok(response);
    }
    
    // --- NOVO ENDPOINT DE DEBUG TEMPORÁRIO ---
    @GetMapping("/test-auth")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> testAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        String authorities = authentication.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.joining(", "));
                
        String logMessage = String.format("A autenticação para o usuário '%s' foi um sucesso. Autoridades: [%s]",
                                          authentication.getName(), authorities);

        System.out.println(logMessage); // Imprime a informação no terminal do Spring Boot
        
        return ResponseEntity.ok(logMessage);
    }
}
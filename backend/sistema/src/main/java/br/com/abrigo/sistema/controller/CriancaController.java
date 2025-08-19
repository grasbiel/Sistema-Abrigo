package br.com.abrigo.sistema.controller;

import br.com.abrigo.sistema.dto.CriancaDto;
import br.com.abrigo.sistema.service.CriancaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/criancas")
public class CriancaController {

    @Autowired
    private CriancaService criancaService;

    @PostMapping
    public ResponseEntity<CriancaDto.CriancaResponse> createCrianca(@RequestBody @Valid CriancaDto.CriancaRequest request, UriComponentsBuilder uriBuilder) {
        CriancaDto.CriancaResponse response = criancaService.createCrianca(request);
        URI uri = uriBuilder.path("/api/criancas/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<CriancaDto.CriancaResponse>> findAllCriancas(Pageable pageable) {
        Page<CriancaDto.CriancaResponse> response = criancaService.findAllCriancas(pageable);
        return ResponseEntity.ok(response);
    }
}
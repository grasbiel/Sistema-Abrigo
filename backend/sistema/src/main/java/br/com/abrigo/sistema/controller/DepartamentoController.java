package br.com.abrigo.sistema.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import br.com.abrigo.sistema.dto.DepartamentoDto;
import br.com.abrigo.sistema.service.DepartamentoService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("/api/departamentos")
public class DepartamentoController {

    @Autowired
    private DepartamentoService departamentoService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CONTROLADOR')")
    public ResponseEntity<DepartamentoDto.DepartamentoResponse> createDepartamento(@RequestBody @Valid DepartamentoDto.DepartamentoRequest request, UriComponentsBuilder uriBuilder) {
        DepartamentoDto.DepartamentoResponse response = departamentoService.createDepartamento(request);
        URI uri = uriBuilder.path("/api/departamentos/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(uri).body(response);
    }
        
    @GetMapping
    public ResponseEntity<List<DepartamentoDto.DepartamentoResponse>> findAllDepartamentos(){
        List<DepartamentoDto.DepartamentoResponse> response = departamentoService.findAllDepartamentos();
        return ResponseEntity.ok(response);
    }
        
    
    
    
    

}

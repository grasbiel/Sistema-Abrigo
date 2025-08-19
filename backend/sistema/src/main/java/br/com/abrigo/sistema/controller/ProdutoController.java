package br.com.abrigo.sistema.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import br.com.abrigo.sistema.dto.ProdutoDto;
import br.com.abrigo.sistema.service.ProdutoService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoDto.ProdutoResponse> createProduto(@RequestBody @Valid ProdutoDto.ProdutoRequest produtoRequest, UriComponentsBuilder uriBuilder) {
        ProdutoDto.ProdutoResponse produtoResponse= produtoService.createProduto(produtoRequest);
        URI uri = uriBuilder.path("/api/produtos/{id}").buildAndExpand(produtoResponse.id()).toUri();
        return ResponseEntity.created(uri).body(produtoResponse);

    }

    @GetMapping
    public ResponseEntity<Page<ProdutoDto.ProdutoResponse>> findAllProdutos(Pageable pageable) {
        Page<ProdutoDto.ProdutoResponse> produtos = produtoService.findAllProdutos(pageable);
        return ResponseEntity.ok(produtos);
    }    
}

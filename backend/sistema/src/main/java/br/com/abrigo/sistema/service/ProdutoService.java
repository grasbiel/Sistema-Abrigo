package br.com.abrigo.sistema.service;

import br.com.abrigo.sistema.dto.ProdutoDto;
import br.com.abrigo.sistema.enums.UnidadeMedida;
import br.com.abrigo.sistema.model.Departamento;
import br.com.abrigo.sistema.model.Produto;
import br.com.abrigo.sistema.repository.DepartamentoRepository;
import br.com.abrigo.sistema.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @Transactional
    public ProdutoDto.ProdutoResponse createProduto(ProdutoDto.ProdutoRequest produtoRequest) {
        Departamento departamento = departamentoRepository.findById(produtoRequest.departamentoId())
                .orElseThrow(() -> new RuntimeException("Departamento não encontrado com id: " + produtoRequest.departamentoId()));

        Produto produto = new Produto();
        mapDtoToEntity(produtoRequest, produto, departamento);

        Produto savedProduto = produtoRepository.save(produto);
        return mapEntityToResponse(savedProduto);
    }

    @Transactional(readOnly = true)
    public Page<ProdutoDto.ProdutoResponse> findAllProdutos(Pageable pageable) {
        Page<Produto> produtos = produtoRepository.findAll(pageable);
        return produtos.map(this::mapEntityToResponse);
    }

    private void mapDtoToEntity(ProdutoDto.ProdutoRequest dto, Produto entity, Departamento departamento) {
        entity.setNome(dto.nome());
        entity.setMarca(dto.marca());
        entity.setUnidadeMedida(UnidadeMedida.valueOf(dto.unidade_medida().toUpperCase()));
        entity.setTamanho(dto.tamanho());
        entity.setDepartamento(departamento);
        entity.setDescricaoAdicional(dto.descricao_adicional());
        entity.setCodigoBarras(dto.codigo_barras());
        entity.setQuantidadeMinima(dto.quantidade_minima());
    }

    private ProdutoDto.ProdutoResponse mapEntityToResponse(Produto entity) {
        return new ProdutoDto.ProdutoResponse(
            entity.getId(),
            entity.getNome(),
            entity.getMarca(),
            entity.getUnidadeMedida().name(),
            entity.getTamanho(),
            entity.getDepartamento().getNome(),
            entity.getDescricaoAdicional(),
            entity.getCodigoBarras(),
            entity.getQuantidadeEmEstoque(),
            entity.getQuantidadeMinima(),
            entity.toString()
        );
    }
}
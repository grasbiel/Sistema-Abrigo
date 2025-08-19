package br.com.abrigo.sistema.service;

import br.com.abrigo.sistema.dto.CriancaDto;
import br.com.abrigo.sistema.model.Crianca;
import br.com.abrigo.sistema.repository.CriancaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CriancaService {

    @Autowired
    private CriancaRepository criancaRepository;

    @Transactional
    public CriancaDto.CriancaResponse createCrianca(CriancaDto.CriancaRequest request) {
        Crianca crianca = new Crianca();
        crianca.setNomeCompleto(request.nome_completo());
        crianca.setDataNascimento(request.data_nascimento());
        crianca.setDataEntrada(request.data_entrada());
        crianca.setStatusAcolhimento(true); // Sempre entra como ativa

        Crianca savedCrianca = criancaRepository.save(crianca);
        return mapEntityToResponse(savedCrianca);
    }

    @Transactional(readOnly = true)
    public Page<CriancaDto.CriancaResponse> findAllCriancas(Pageable pageable) {
        Page<Crianca> criancas = criancaRepository.findAll(pageable);
        return criancas.map(this::mapEntityToResponse);
    }

    private CriancaDto.CriancaResponse mapEntityToResponse(Crianca entity) {
        return new CriancaDto.CriancaResponse(
            entity.getId(),
            entity.getNomeCompleto(),
            entity.getDataNascimento(),
            entity.getIdade(), // O método getIdade() é chamado aqui
            entity.isStatusAcolhimento(),
            entity.getDataEntrada(),
            entity.getDataSaida()
        );
    }
}
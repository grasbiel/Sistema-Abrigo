package br.com.abrigo.sistema.service;

import br.com.abrigo.sistema.dto.DepartamentoDto;
import br.com.abrigo.sistema.model.Departamento;
import br.com.abrigo.sistema.repository.DepartamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartamentoService {

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @Transactional
    public DepartamentoDto.DepartamentoResponse createDepartamento(DepartamentoDto.DepartamentoRequest request) {
        Departamento departamento = new Departamento();
        departamento.setNome(request.nome());
        Departamento savedDepartamento = departamentoRepository.save(departamento);
        return mapEntityToResponse(savedDepartamento);
    }

    @Transactional(readOnly = true)
    public List<DepartamentoDto.DepartamentoResponse> findAllDepartamentos() {
        List<Departamento> departamentos = departamentoRepository.findAll();
        return departamentos.stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    // Métodos para update e delete podem ser adicionados aqui

    private DepartamentoDto.DepartamentoResponse mapEntityToResponse(Departamento entity) {
        return new DepartamentoDto.DepartamentoResponse(entity.getId(), entity.getNome());
    }
}
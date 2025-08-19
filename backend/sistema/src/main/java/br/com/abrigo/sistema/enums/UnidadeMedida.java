package br.com.abrigo.sistema.enums;

public enum UnidadeMedida {
    UNIDADE("Unidade"),
    QUILOGRAMA("Quilograma"),
    GRAMA("Grama"),
    LITRO("Litro"),
    MILILITRO("Mililitro"),
    PACOTE("Pacote"),
    CAIXA("Caixa"),
    MILIGRAMA("Miligrama"),
    LATA("Lata");

    private final String descricao;

    UnidadeMedida(String descricao){
        this.descricao = descricao;
    }

    public String getDescricao () {
        return this.descricao;
    }
}

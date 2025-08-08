from django.contrib import admin

# Register your models here.
# core/admin.py

from django.contrib import admin
from .models import Usuario, Departamento, Produto, Crianca, Movimentacao, Notificacao

# Para melhorar a visualização no Admin, podemos customizar como cada modelo é exibido.
# Esta é uma boa prática.

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'is_staff')

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nome',)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'departamento', 'quantidade_em_estoque', 'quantidade_minima', 'data_validade')
    list_filter = ('departamento',)
    search_fields = ('nome',)

@admin.register(Crianca)
class CriancaAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'idade', 'status_acolhimento', 'data_entrada', 'data_saida')
    list_filter = ('status_acolhimento',)
    search_fields = ('nome_completo',)

@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = ('produto', 'departamento', 'tipo', 'quantidade', 'status', 'registrado_por', 'data_movimentacao')
    list_filter = ('status', 'tipo', 'produto__departamento')
    search_fields = ('produto__nome',)
    
    # Adicionado para filtrar o departamento na lista
    def departamento(self, obj):
        return obj.produto.departamento
    departamento.short_description = 'Departamento'

    # Esta função busca o nome do departamento através da relação para exibir na lista
    @admin.display(description='Departamento', ordering='produto__departamento')
    def departamento(self, obj):
        if obj.produto:
            return obj.produto.departamento
        return "N/A"


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('produto', 'mensagem', 'data_criacao', 'lida')
    list_filter = ('lida',)
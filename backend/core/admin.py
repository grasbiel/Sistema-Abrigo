from django.contrib import admin
from .models import Usuario, Departamento, Produto, Crianca, Movimentacao, Notificacao

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nome',)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    # Usa a função __str__ para uma exibição amigável e mostra os novos campos
    list_display = ('__str__', 'departamento', 'quantidade_em_estoque', 'quantidade_minima')
    list_filter = ('departamento', 'marca')
    search_fields = ('nome', 'marca', 'codigo_barras')

@admin.register(Crianca)
class CriancaAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'idade', 'status_acolhimento', 'data_entrada')
    search_fields = ('nome_completo',)

@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    # Adiciona os novos campos da movimentação à lista
    list_display = ('produto', 'tipo', 'quantidade', 'status', 'data_validade', 'registrado_por', 'data_movimentacao')
    list_filter = ('status', 'tipo', 'produto__departamento')
    search_fields = ('produto__nome', 'produto__marca')
    list_per_page = 25

@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('produto', 'mensagem', 'data_criacao', 'lida')
    list_filter = ('lida',)
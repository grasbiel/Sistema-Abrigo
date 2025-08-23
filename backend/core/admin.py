from django.contrib import admin

# Register your models here.
# core/admin.py

from django.contrib import admin
from .models import Usuario, Departamento, Produto, Crianca, Movimentacao, Notificacao

# Para melhorar a visualização no Admin, podemos customizar como cada modelo é exibido.
# Esta é uma boa prática.

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nome',)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'departamento', 'quantidade_em_estoque', 'quantidade_minima')
    list_filter = ('departamento',)
    search_fields = ('nome', 'marca', 'codigo_barras')

@admin.register(Crianca)
class CriancaAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'idade', 'status_acolhimento', 'data_entrada')
    search_fields = ('nome_completo',)

@admin.register(Movimentacao)
class MovimentacaoAdmin(admin.ModelAdmin):
    list_display = ('produto', 'tipo', 'quantidade', 'status', 'data_validade', 'registrado_por')
    list_filter = ('status', 'tipo', 'produto__departamento')
    search_fields = ('produto__nome', 'produto__marca')


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ('produto', 'mensagem', 'data_criacao', 'lida')
    list_filter = ('lida',)
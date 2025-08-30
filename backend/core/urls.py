from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Importa todas as Views e ViewSets que criamos
from .views import (
    UsuarioViewSet,
    GroupViewSet,
    DepartamentoViewSet,
    ProdutoViewSet,
    CriancaViewSet,
    MovimentacaoViewSet,
    NotificacaoViewSet,
    IndicadoresView
)

# Cria um roteador para gerar as URLs das ViewSets automaticamente
router = DefaultRouter()

# Registra cada ViewSet com uma rota base
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'grupos', GroupViewSet, basename='grupo')
router.register(r'departamentos', DepartamentoViewSet, basename='departamento')
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'criancas', CriancaViewSet, basename='crianca')
router.register(r'movimentacoes', MovimentacaoViewSet, basename='movimentacao')
router.register(r'notificacoes', NotificacaoViewSet, basename='notificacao')

# Define os padrões de URL para a nossa aplicação 'core'
urlpatterns = [   
    path('', include(router.urls)),

    
    path('indicadores/', IndicadoresView.as_view(), name='indicadores'),
]
# backend/core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartamentoViewSet,
    ProdutoViewSet,
    CriancaViewSet,
    MovimentacaoViewSet,
    NotificacaoViewSet,
    IndicadoresView
)

# O router registra automaticamente as rotas para os ViewSets (ex: /produtos, /criancas)
router = DefaultRouter()
router.register(r'departamentos', DepartamentoViewSet, basename='departamento')
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'criancas', CriancaViewSet, basename='crianca')
router.register(r'movimentacoes', MovimentacaoViewSet, basename='movimentacao')
router.register(r'notificacoes', NotificacaoViewSet, basename='notificacao')

# A lista de URLs da nossa API
urlpatterns = [
    # Inclui todas as rotas geradas pelo router (ex: /api/produtos/)
    path('', include(router.urls)),
    
    path('indicadores/', IndicadoresView.as_view(), name='indicadores'),
]
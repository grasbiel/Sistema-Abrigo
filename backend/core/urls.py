# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'criancas', CriancaViewSet)
router.register(r'movimentacoes', MovimentacaoViewSet)
router.register(r'notificacoes', NotificacaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('indicadores/', IndicadoresView.as_view(), name='indicadores'),
]
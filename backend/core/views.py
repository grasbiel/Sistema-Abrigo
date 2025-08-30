from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import Group
from django.db import models  # <-- 1. IMPORT FALTANTE ADICIONADO
from datetime import date     # <-- 2. IMPORT FALTANTE ADICIONADO

from .models import Usuario, Departamento, Produto, Crianca, Movimentacao, Notificacao
from .serializers import (
    MyTokenObtainPairSerializer, UsuarioSerializer, GroupSerializer, DepartamentoSerializer,
    ProdutoSerializer, CriancaSerializer, MovimentacaoSerializer, NotificacaoSerializer
)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class IsControlador(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Controlador').exists()


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.all().order_by('username')
    serializer_class = UsuarioSerializer
    permission_classes = [IsControlador]

class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all().order_by('nome')
    serializer_class = DepartamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all().order_by('nome')
    serializer_class = ProdutoSerializer
    permission_classes = [permissions.IsAuthenticated]

class CriancaViewSet(viewsets.ModelViewSet):
    queryset = Crianca.objects.all().order_by('nome_completo')
    serializer_class = CriancaSerializer
    permission_classes = [permissions.IsAuthenticated]

class MovimentacaoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar o fluxo completo de movimentações de estoque.
    """
    queryset = Movimentacao.objects.all().order_by('-data_movimentacao')
    serializer_class = MovimentacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Associa o usuário logado ao criar uma nova movimentação."""
        serializer.save(registrado_por=self.request.user)

    def get_queryset(self):
        """Filtra as movimentações por status, se o parâmetro for passado na URL."""
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsControlador])
    def validar(self, request, pk=None):
        """Ação customizada para um Controlador aprovar uma movimentação pendente."""
        movimentacao = self.get_object()
        
        if movimentacao.status != 'pendente':
            return Response({'error': 'Esta movimentação já foi processada.'}, status=status.HTTP_400_BAD_REQUEST)
        
        produto = movimentacao.produto
        
        if movimentacao.tipo == 'saida' and produto.quantidade_em_estoque < movimentacao.quantidade:
            return Response({'error': f'Estoque insuficiente. Estoque atual: {produto.quantidade_em_estoque}'}, status=status.HTTP_400_BAD_REQUEST)

        # Lógica principal: Atualiza o estoque do produto
        if movimentacao.tipo == 'entrada':
            produto.quantidade_em_estoque += movimentacao.quantidade
        else: # Saída
            produto.quantidade_em_estoque -= movimentacao.quantidade
        produto.save()
        
        # Atualiza o status da movimentação
        movimentacao.status = 'aprovada'
        movimentacao.validado_por = request.user
        movimentacao.save()
        
        # Gera notificação de estoque baixo, se necessário
        if produto.quantidade_em_estoque <= produto.quantidade_minima:
            Notificacao.objects.create(
                produto=produto,
                mensagem=f"Estoque baixo para o produto '{produto.display_name}'. Restam {produto.quantidade_em_estoque}."
            )
            
        return Response(self.get_serializer(movimentacao).data)

    @action(detail=True, methods=['post'], permission_classes=[IsControlador])
    def recusar(self, request, pk=None):
        """Ação customizada para um Controlador recusar uma movimentação pendente."""
        movimentacao = self.get_object()
        if movimentacao.status != 'pendente':
            return Response({'error': 'Esta movimentação já foi processada.'}, status=status.HTTP_400_BAD_REQUEST)
        
        movimentacao.status = 'recusada'
        movimentacao.validado_por = request.user
        movimentacao.save()
        return Response(self.get_serializer(movimentacao).data)

class NotificacaoViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacaoSerializer
    permission_classes = [IsControlador]

    def get_queryset(self):
        return Notificacao.objects.filter(lida=False).order_by('-data_criacao')

    @action(detail=True, methods=['post'])
    def marcar_como_lida(self, request, pk=None):
        notificacao = self.get_object()
        notificacao.lida = True
        notificacao.save()
        return Response({'status': 'Notificação marcada como lida'}, status=status.HTTP_200_OK)

class IndicadoresView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        total_criancas_ativas = Crianca.objects.filter(status_acolhimento=True).count()
        produtos_em_alerta = Produto.objects.filter(quantidade_em_estoque__lte=models.F('quantidade_minima')).count()
        
        # Estas queries agora funcionarão por causa dos imports
        hoje = date.today()
        seis_anos_atras = hoje.replace(year=hoje.year - 6)
        doze_anos_atras = hoje.replace(year=hoje.year - 12)
        treze_anos_atras = hoje.replace(year=hoje.year - 13)

        distribuicao_idade = {
            '0-6': Crianca.objects.filter(status_acolhimento=True, data_nascimento__gte=seis_anos_atras).count(),
            '7-12': Crianca.objects.filter(status_acolhimento=True, data_nascimento__gt=treze_anos_atras, data_nascimento__lte=seis_anos_atras).count(),
            '13+': Crianca.objects.filter(status_acolhimento=True, data_nascimento__lte=treze_anos_atras).count()
        }

        response_data = {
            'total_criancas_ativas': total_criancas_ativas,
            'produtos_em_alerta': produtos_em_alerta,
            'distribuicao_idade': distribuicao_idade
        }
        return Response(response_data)
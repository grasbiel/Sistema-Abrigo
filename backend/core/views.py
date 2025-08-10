# core/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import Group
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from .serializers import *

# --- Permissões Customizadas ---
class IsControlador(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Controlador').exists()

# --- ViewSets da API ---
class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [permissions.IsAuthenticated]

class CriancaViewSet(viewsets.ModelViewSet):
    queryset = Crianca.objects.all()
    serializer_class = CriancaSerializer
    permission_classes = [permissions.IsAuthenticated]

class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='Controlador').exists():
            return Movimentacao.objects.all()
        return Movimentacao.objects.filter(registrado_por=user)

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsControlador])
    def validar(self, request, pk=None):
        movimentacao = self.get_object()
        if movimentacao.status != 'pendente':
            return Response({'error': 'Esta movimentação já foi processada.'}, status=status.HTTP_400_BAD_REQUEST)
        
        movimentacao.status = 'aprovada'
        movimentacao.validado_por = request.user
        produto = movimentacao.produto

        if movimentacao.tipo == 'entrada':
            produto.quantidade_em_estoque += movimentacao.quantidade
        elif movimentacao.tipo == 'saida':
            if produto.quantidade_em_estoque < movimentacao.quantidade:
                return Response({'error': 'Estoque insuficiente para esta saída.'}, status=status.HTTP_400_BAD_REQUEST)
            produto.quantidade_em_estoque -= movimentacao.quantidade
        
        produto.save()
        movimentacao.save()
        
        # Lógica de Notificação
        if produto.quantidade_em_estoque <= produto.quantidade_minima and not Notificacao.objects.filter(produto=produto, lida=False).exists():
            msg = f"Estoque baixo para '{produto.nome}'. Restam {produto.quantidade_em_estoque} unidades."
            Notificacao.objects.create(produto=produto, mensagem=msg)
            
        return Response(self.get_serializer(movimentacao).data)

class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.filter(lida=False)
    serializer_class = NotificacaoSerializer
    permission_classes = [permissions.IsAuthenticated, IsControlador]

    @action(detail=True, methods=['post'])
    def marcar_como_lida(self, request, pk=None):
        notificacao = self.get_object()
        notificacao.lida = True
        notificacao.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- View de Indicadores ---
class IndicadoresView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        total_criancas_ativas = Crianca.objects.filter(status_acolhimento=True).count()
        distribuicao_idade = {'0-6': 0, '7-12': 0, '13+': 0}
        for crianca in Crianca.objects.filter(status_acolhimento=True):
            if crianca.idade <= 6: distribuicao_idade['0-6'] += 1
            elif 7 <= crianca.idade <= 12: distribuicao_idade['7-12'] += 1
            else: distribuicao_idade['13+'] += 1
        
        produtos_em_alerta = Produto.objects.filter(quantidade_em_estoque__lte=models.F('quantidade_minima')).count()

        return Response({
            'total_criancas_ativas': total_criancas_ativas,
            'distribuicao_idade': distribuicao_idade,
            'produtos_em_alerta': produtos_em_alerta,
        })
    
class MyTokenObtainPairView (TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
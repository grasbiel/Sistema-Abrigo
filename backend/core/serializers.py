# core/serializers.py
from rest_framework import serializers
from .models import *

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'first_name', 'last_name', 'groups')

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class CriancaSerializer(serializers.ModelSerializer):
    idade = serializers.IntegerField(source='idade', read_only=True)
    class Meta:
        model = Crianca
        fields = '__all__'

class MovimentacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    registrado_por_nome = serializers.CharField(source='registrado_por.username', read_only=True)
    class Meta:
        model = Movimentacao
        fields = '__all__'
        read_only_fields = ('status', 'registrado_por', 'validado_por')

class NotificacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    class Meta:
        model = Notificacao
        fields = '__all__'
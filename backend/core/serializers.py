from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import Group
from .models import Usuario, Departamento, Produto, Crianca, Movimentacao, Notificacao

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adicionando campos customizados ao payload do token
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['groups'] = [group.name for group in user.groups.all()]
        return token

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name"]

class UsuarioSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True)
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'groups')

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    # Usamos a property 'display_name' do modelo para o nome de exibição
    display_name = serializers.CharField(read_only=True)
    class Meta:
        model = Produto
        fields = [
            'id', 'nome', 'marca', 'unidade_medida', 'tamanho', 'departamento',
            'descricao_adicional', 'codigo_barras', 'quantidade_em_estoque',
            'quantidade_minima', 'display_name'
        ]

class MovimentacaoSerializer(serializers.ModelSerializer):
    # Campos 'read_only' que buscam informações de modelos relacionados
    produto_nome = serializers.CharField(source='produto.display_name', read_only=True)
    registrado_por_nome = serializers.CharField(source='registrado_por.username', read_only=True)

    class Meta:
        model = Movimentacao
        fields = [
            'id',
            'produto',
            'produto_nome',
            'quantidade',
            'tipo',
            'data_validade',
            'preco_unitario_doacao',
            'data_movimentacao',
            'status',
            'justificativa',
            'registrado_por',
            'registrado_por_nome',
            'validado_por'
        ]
        # Define campos que não podem ser enviados pelo frontend, apenas lidos
        read_only_fields = ('status', 'registrado_por', 'validado_por', 'data_movimentacao')

class CriancaSerializer(serializers.ModelSerializer):
    idade = serializers.IntegerField(source='idade', read_only=True)
    class Meta:
        model = Crianca
        fields = '__all__'

class NotificacaoSerializer(serializers.ModelSerializer):
    # Pega o nome de exibição do produto para mostrar na notificação
    produto_nome = serializers.CharField(source='produto.display_name', read_only=True)

    class Meta:
        model = Notificacao
        fields = ['id', 'produto', 'produto_nome', 'mensagem', 'data_criacao', 'lida']
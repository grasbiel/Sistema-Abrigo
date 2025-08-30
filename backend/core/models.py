from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import date
from decimal import Decimal

# Modelo de usuário customizado para futuras expansões.
class Usuario(AbstractUser):
    pass

# Modelo para os departamentos do abrigo (Dispensa, Farmácia, etc.)
class Departamento(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome

# Modelo para o "Catálogo" de produtos, com a estrutura robusta.
class Produto(models.Model):
    # Usando TextChoices para uma definição de choices mais moderna e clara
    class UnidadeMedida(models.TextChoices):
        UNIDADE = 'un', 'Unidade'
        QUILOGRAMA = 'kg', 'Quilograma'
        GRAMA = 'g', 'Grama'
        LITRO = 'L', 'Litro'
        MILILITRO = 'ml', 'Mililitro'
        PACOTE = 'pacote', 'Pacote'
        CAIXA = 'caixa', 'Caixa'
        LATA = 'lata', 'Lata'
        FARDO = 'fardo', 'Fardo'

    # Campos do Catálogo
    nome = models.CharField(max_length=200, help_text="Nome principal do produto. Ex: Leite em pó integral")
    marca = models.CharField(max_length=100, blank=True, null=True, help_text="Marca do produto. Ex: Ninho")
    unidade_medida = models.CharField(max_length=10, choices=UnidadeMedida.choices, default=UnidadeMedida.UNIDADE)
    tamanho = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True, help_text="Tamanho ou volume. Ex: 0.400 para 400g, 1.5 para 1.5L")
    departamento = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name='produtos')
    descricao_adicional = models.TextField(blank=True, null=True, help_text="Informações extras. Ex: 'Tamanho G', 'Sem lactose'")
    codigo_barras = models.CharField(max_length=100, blank=True, null=True, unique=True)

    # Campos de controle de estoque (gerenciados pelo sistema)
    quantidade_em_estoque = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    quantidade_minima = models.DecimalField(max_digits=10, decimal_places=3, default=5, verbose_name="Quantidade Mínima de Alerta")

    def __str__(self):
        # Remove zeros desnecessários do tamanho (ex: 5.00 -> 5)
        tamanho_formatado = self.tamanho.normalize() if self.tamanho and self.tamanho % 1 == 0 else self.tamanho
        
        marca_str = f" {self.marca}" if self.marca else ""
        tamanho_str = f" {tamanho_formatado}{self.unidade_medida}" if self.tamanho else ""
        
        return f"{self.nome}{marca_str}{tamanho_str}"

    @property
    def display_name(self):
        return self.__str__()

# Modelo para as crianças e adolescentes acolhidos.
class Crianca(models.Model):
    nome_completo = models.CharField(max_length=255)
    data_nascimento = models.DateField()
    status_acolhimento = models.BooleanField(default=True, verbose_name="Está atualmente no abrigo?")
    data_entrada = models.DateField(default=date.today)
    data_saida = models.DateField(null=True, blank=True)

    @property
    def idade(self):
        hoje = date.today()
        try:
            return hoje.year - self.data_nascimento.year - ((hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day))
        except TypeError:
            return 0

    def __str__(self):
        return f"{self.nome_completo} ({self.idade} anos)"

    class Meta:
        verbose_name = "Criança"
        verbose_name_plural = "Crianças"

# Modelo para registrar cada entrada e saída de estoque.
class Movimentacao(models.Model):
    TIPO_MOVIMENTACAO = (('entrada', 'Entrada'), ('saida', 'Saída'))
    STATUS_MOVIMENTACAO = (('pendente', 'Pendente'), ('aprovada', 'Aprovada'), ('recusada', 'Recusada'))

    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    quantidade = models.DecimalField(max_digits=10, decimal_places=3)
    tipo = models.CharField(max_length=10, choices=TIPO_MOVIMENTACAO)

    # Campos específicos da movimentação de entrada
    data_validade = models.DateField(blank=True, null=True, help_text="Preencher na ENTRADA de perecíveis")
    preco_unitario_doacao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Valor monetário do item, se aplicável")
    
    # Campos de controle
    data_movimentacao = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='movimentacoes_registradas')
    validado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name='movimentacoes_validadas')
    status = models.CharField(max_length=10, choices=STATUS_MOVIMENTACAO, default='pendente')
    justificativa = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_tipo_display()} de {self.quantidade}x {self.produto.nome}"

# Modelo para notificações (ex: estoque baixo).
class Notificacao(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    mensagem = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    def __str__(self):
        return f"Alerta para {self.produto.nome}"

    class Meta:
        ordering = ['-data_criacao']
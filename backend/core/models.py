# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import date

class Usuario(AbstractUser):
    """Modelo de usuário customizado para futuras expansões."""
    pass

class Departamento(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):  
        return self.nome

class Produto(models.Model):
    UNIDADE_MEDIDA_CHOICES =[
        ('un', 'Unidade'),
        ('kg', 'Quilograma'),
        ('g', 'Grama'),
        ('L', 'Litro'),
        ('mL', 'Mililitro'),
        ('pacote', 'Pacote'),
        ('caixa', 'Caixa'),
        ('lata', 'Lata'),
        ('fardo', 'Fardo')
    ]
    nome = models.CharField(max_length=200, help_text='Nome principal do produto. Ex: Leite em pó integral')
    marca = models.CharField(max_length=200, blank=True, null=True, help_text="Marca do produto. Ninho")
    unidade_medida = models.CharField(max_length=10, choices=UNIDADE_MEDIDA_CHOICES, default='un')
    tamanho = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null= True, help_text="Tamanho ou volume. Ex: 0.4 para 400g, 1 para 1L")
    departamento = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name='produtos')
    descricao_adicional = models.TextField(blank=True, null=True, help_text="Informações extras. Ex: 'Tamanho G', 'Sem lactose'")
    codigo_barras = models.CharField(max_length=100,blank=True,null=True,unique=True)

    # Campos de controle de estoque (calculado)
    quantidade_em_estoque = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    quantidade_minima = models.DecimalField(max_digits=10, decimal_places=2, default=5, verbose_name="Quantidade Mínima de Alerta")

    def __str__(self):
        marca_str = f" {self.marca}" if self.marca else ""
        tamanho_str = f" {self.tamanho}{self.unidade_medida}" if self.tamanho else ""
        return f"{self.nome}{marca_str}{tamanho_str}"

class Crianca(models.Model):
    nome_completo = models.CharField(max_length=255)
    data_nascimento = models.DateField()
    status_acolhimento = models.BooleanField(default=True, verbose_name="Está atualmente no abrigo?")
    data_entrada = models.DateField(default=date.today)
    data_saida = models.DateField(null=True, blank=True)

    @property
    def idade(self):
        hoje = date.today()
        return hoje.year - self.data_nascimento.year - ((hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day))

    def __str__(self):
        return f"{self.nome_completo} ({self.idade} anos)"

    class Meta:
        verbose_name = "Criança"
        verbose_name_plural = "Crianças"

class Movimentacao(models.Model):
    TIPO_MOVIMENTACAO = (('entrada', 'Entrada'), ('saida', 'Saída'))
    STATUS_MOVIMENTACAO = (('pendente', 'Pendente'), ('aprovada', 'Aprovada'), ('recusada', 'Recusada'))

    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    quantidade = models.DecimalField(max_digits=10,decimal_places=2)
    tipo = models.CharField(max_length=10, choices=TIPO_MOVIMENTACAO)

    # Novos campos para a movimentação de entrada
    data_validade = models.DateField(blank=True, null=True, help_text="Preencher na ENTRADA de perecíveis")
    preco_unitario_doacao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Valor monetário do item, se aplicável")
    
    data_movimentacao = models.DateTimeField(auto_now_add=True)
    registrado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='movimentacoes_registradas')
    validado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name='movimentacoes_validadas')
    status = models.CharField(max_length=10, choices=STATUS_MOVIMENTACAO, default='pendente')
    justificativa = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_tipo_display()} de {self.quantidade}x {self.produto.nome}"

class Notificacao(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    mensagem = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    def __str__(self):
        return f"Alerta para {self.produto.nome}"

    class Meta:
        ordering = ['-data_criacao']
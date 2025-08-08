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
    nome = models.CharField(max_length=200)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name='produtos')
    data_validade = models.DateField(blank=True, null=True, help_text="Apenas para itens da farmácia.")
    quantidade_em_estoque = models.PositiveIntegerField(default=0)
    quantidade_minima = models.PositiveIntegerField(default=5, verbose_name="Quantidade Mínima de Alerta")

    def __str__(self):
        return f"{self.nome} ({self.departamento.nome})"

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
    quantidade = models.PositiveIntegerField()
    tipo = models.CharField(max_length=10, choices=TIPO_MOVIMENTACAO)
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
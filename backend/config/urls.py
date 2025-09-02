from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

# Importa a nossa view customizada para obter o token
from core.views import MyTokenObtainPairView

urlpatterns = [
    # Rota para o painel de administração padrão do Django
    path('admin/', admin.site.urls),

    # Rota principal da API:
    # Delega qualquer URL que comece com "api/" para ser gerenciada
    # pelo arquivo "urls.py" da nossa aplicação "core".
    path('api/', include('core.urls')),

    # Rotas específicas para autenticação JWT
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
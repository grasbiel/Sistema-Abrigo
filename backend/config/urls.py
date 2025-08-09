# backend/config/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import MyTokenObtainPairView

urlpatterns = [
    # 1. Rota para a interface de administração do Django
    path('admin/', admin.site.urls),
    
    # 2. Rota que delega tudo que começa com 'api/' para o arquivo urls.py da app 'core'
    path('api/', include('core.urls')),
    
    # 3. Rotas para autenticação com Token JWT
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
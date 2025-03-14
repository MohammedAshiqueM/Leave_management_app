from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .serializers import CustomTokenObtainPairSerializer
from .views import ProfileView,LogoutView

urlpatterns = [
    # JWT Authentication URLs
    path('token/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtain JWT token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh JWT token
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
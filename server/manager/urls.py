from django.urls import path
from .views import AllUsersView

urlpatterns = [
    path('all-users/', AllUsersView.as_view(), name='all_users'),
]
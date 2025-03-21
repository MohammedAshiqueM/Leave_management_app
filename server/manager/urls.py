from django.urls import path
from .views import AllUsersView,UserStatusView,UserView,LeaveView,LeaveStatusView

urlpatterns = [
    path('all-users/', AllUsersView.as_view(), name='all_users'),
    path('users/<int:pk>/status/', UserStatusView.as_view(), name='user_status'),
    path('users/create/', UserView.as_view(), name='user_vie'),
    path('leaves/', LeaveView.as_view(), name='all_leaves'),
    path('leave/<int:pk>/status/', LeaveStatusView.as_view(), name='leave_status'),
    
    
]
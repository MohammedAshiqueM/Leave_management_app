from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from employee.models import Profile
from employee.serializers import UserSerializer,ProfileSerializer

User = get_user_model()

class AllUsersView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        users = Profile.objects.filter(user__is_superuser=False)
        serializer = ProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from employee.models import Profile, LeaveRequest
from employee.serializers import UserSerializer,ProfileSerializer,LeaveRequestSerializer

User = get_user_model()

class AllUsersView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        users = Profile.objects.filter(user__is_superuser=False)
        serializer = ProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserStatusView(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, pk):
        user = get_object_or_404(User,id=pk)
        user.is_active = not user.is_active
        user.save()
        return Response(status=status.HTTP_200_OK)
    
class UserView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class LeaveView(APIView):
    persmission_classes = [IsAdminUser]
    
    def get(self, request):
        leaves = LeaveRequest.objects.all()
        serializer = LeaveRequestSerializer(leaves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LeaveStatusView(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, pk):
        leave = get_object_or_404(LeaveRequest, id=pk)
        previous_status = leave.status
        
        serializer = LeaveRequestSerializer(instance=leave, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_leave = serializer.save()
            
            if previous_status != 'approved' and updated_leave.status == 'approved':
                user_profile = updated_leave.user.profile
                
                if updated_leave.leave_type == 'sick':
                    user_profile.sick_leave_balance -= updated_leave.no_days
                elif updated_leave.leave_type == 'casual':
                    user_profile.casual_leave_balance -= updated_leave.no_days
                
                user_profile.save()
            
            elif previous_status == 'approved' and updated_leave.status != 'approved':
                user_profile = updated_leave.user.profile
                
                if updated_leave.leave_type == 'sick':
                    user_profile.sick_leave_balance += updated_leave.no_days
                elif updated_leave.leave_type == 'casual':
                    user_profile.casual_leave_balance += updated_leave.no_days
                    
                user_profile.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
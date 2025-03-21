from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from .models import Profile, LeaveRequest
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name

        return token
    
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'is_active', 'password']
        
    def create(self, validated_data):
        """Override create method to hash the password before saving."""
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'role', 'casual_leave_balance', 'sick_leave_balance']
        read_only_fields = ['id', 'user']

class LeaveRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'user', 'leave_type', 'start_date', 'end_date', 'no_days', 
            'reason', 'status', 'reason_not_approved'
        ]
        read_only_fields = ['id', 'user', 'no_days',]

    def validate(self, data):
        """
        Custom validation for:
        1. Ensure start_date and end_date are not in the past.
        2. Check if the user has already taken leave on the applied dates.
        3. Check if the user has sufficient leave balance for casual/sick leave.
        """
        current_date = timezone.now().date()
        user = self.context['request'].user
        profile = user.profile

        start_date = data['start_date'].date()
        end_date = data['end_date'].date()

        # 1. Check if start_date or end_date is in the past
        if start_date < current_date or end_date < current_date:
            raise serializers.ValidationError({
                "start_date": "Leave dates cannot be in the past.",
                "end_date": "Leave dates cannot be in the past."
            })

        # 2. Check if the user has already taken leave on the applied dates
        overlapping_leaves = LeaveRequest.objects.filter(
            user=user,
            start_date__lte=data['end_date'],
            end_date__gte=data['start_date'],
        ).exclude(id=self.instance.id if self.instance else None ).exclude(status='rejected')

        if overlapping_leaves.exists():
            raise serializers.ValidationError({
                "start_date": "You have already taken leave on these dates.",
                "end_date": "You have already taken leave on these dates."
            })

        # 3. Check leave balance for casual and sick leaves
        leave_type = data['leave_type']
        no_days = (data['end_date'] - data['start_date']).days + 1

        if leave_type == 'casual' and profile.casual_leave_balance < no_days:
            raise serializers.ValidationError({
                "leave_type": "Insufficient casual leave balance."
            })

        if leave_type == 'sick' and profile.sick_leave_balance < no_days:
            raise serializers.ValidationError({
                "leave_type": "Insufficient sick leave balance."
            })

        return data

    def create(self, validated_data):
        """
        Automatically calculate no_days when creating a new LeaveRequest.
        """
        delta = validated_data['end_date'] - validated_data['start_date']
        validated_data['no_days'] = delta.days + 1
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Automatically calculate no_days when updating a LeaveRequest.
        """
        if 'start_date' in validated_data or 'end_date' in validated_data:
            start_date = validated_data.get('start_date', instance.start_date)
            end_date = validated_data.get('end_date', instance.end_date)
            delta = end_date - start_date
            validated_data['no_days'] = delta.days + 1
        return super().update(instance, validated_data)
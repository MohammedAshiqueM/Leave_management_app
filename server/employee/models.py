from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import timedelta

User = get_user_model()

class Profile(models.Model):
    ROLE_CHOICES = (
        ('employee', 'Employee'),
        ('admin', 'Admin')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    casual_leave_balance = models.IntegerField(default=10)
    sick_leave_balance = models.IntegerField(default=10)

    def __str__(self):
        return f'Profile of {self.user.email}'

class LeaveRequest(models.Model):
    LEAVE_TYPE_CHOICES = (
        ('casual', 'Casual Leave'),
        ('sick', 'Sick Leave'),
        ('other', 'Other Leave')
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leave_requests', db_index=True)
    leave_type = models.CharField(max_length=10, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    no_days = models.IntegerField(default=1) #number of days that leave taken
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', db_index=True)
    reason_not_approved = models.TextField(null=True, blank=True)

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError("End date cannot be before start date.")

    def save(self, *args, **kwargs):
        delta = self.end_date - self.start_date
        self.no_days = delta.days + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.email} - {self.leave_type} Leave ({self.status})'
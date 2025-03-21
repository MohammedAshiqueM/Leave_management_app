from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to create a Profile whenever a User is created.
    """
    if created:
        # role based on whether the user is a superuser
        role = 'admin' if instance.is_superuser else 'employee'
        Profile.objects.create(user=instance, role=role)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal to save the Profile whenever the User is saved.
    """
    instance.profile.save()
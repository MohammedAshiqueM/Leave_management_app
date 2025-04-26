from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os

#Automating the superuser creation
class Command(BaseCommand):
    help = "Creates a superuser if one doesn't already exist."

    def handle(self, *args, **options):
        username = os.getenv("DJANGO_SUPERUSER_USERNAME")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

        if not User.objects.filter(username=username).exists():
            self.stdout.write(f"Creating superuser: {username}")
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS("Superuser created successfully."))
        else:
            self.stdout.write("Superuser already exists.")
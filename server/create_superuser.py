import os
from django.conf import settings
import dj_database_url

# creating super user
if not settings.configured:
    settings.configure(
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3', 
                'NAME': 'db.sqlite3',
            }
        },
        db_from_env = dj_database_url.config(default=os.environ.get('DATABASE_URL'), conn_max_age=600)
        DATABASES['default'].update(db_from_env)
        INSTALLED_APPS=[
            'django.contrib.admin',
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.sessions',
            'django.contrib.messages',
            'django.contrib.staticfiles',
            'leave_app', 
        ],
        SECRET_KEY=os.getenv('SECRET_KEY')
    )

# Initialize Django
import django
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")  # Default username
    email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")  # Default email
    password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "12345")  # Default password

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser: {username}")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("Superuser created successfully.")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    create_superuser()
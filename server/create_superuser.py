import os
from django.conf import settings
import dj_database_url

# Configure Django settings programmatically
if not settings.configured:
    # Use SQLite for local testing or PostgreSQL for production
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'db.sqlite3',  # Path to your SQLite database
        }
    }

    # Update DATABASES with Render's PostgreSQL configuration if available
    db_from_env = dj_database_url.config(default=os.environ.get('DATABASE_URL'), conn_max_age=600)
    if db_from_env:
        DATABASES['default'].update(db_from_env)

    settings.configure(
        DATABASES=DATABASES,
        INSTALLED_APPS=[
            'django.contrib.admin',
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.sessions',
            'django.contrib.messages',
            'django.contrib.staticfiles',
            # Third-party apps
            'rest_framework',
            'rest_framework_simplejwt',
            'rest_framework_simplejwt.token_blacklist',
            'corsheaders',
            'drf_yasg',
            # Local apps
            'employee',
        ],
        SECRET_KEY=os.getenv('SECRET_KEY', 'your-secret-key-for-script'),  # Use a secure key for production
    )

# Initialize Django
import django
django.setup()

# Import Django components AFTER initializing Django
from django.contrib.auth.models import User
from employee.models import Profile  # Import the Profile model

def create_superuser():
    username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")  # Default username
    email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")  # Default email
    password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "securepassword123")  # Default password

    # Check if the superuser exists
    user, created = User.objects.get_or_create(
        username=username,
        defaults={'email': email, 'is_staff': True, 'is_superuser': True}
    )

    if created:
        # Set the password for the newly created superuser
        user.set_password(password)
        user.save()
        print(f"Superuser '{username}' created successfully.")
    else:
        print(f"Superuser '{username}' already exists.")

    # Check if the Profile exists for the superuser
    profile, profile_created = Profile.objects.get_or_create(user=user, defaults={'role': 'admin'})

    if profile_created:
        print(f"Profile created for superuser '{username}'.")
    else:
        print(f"Profile already exists for superuser '{username}'.")

if __name__ == "__main__":
    create_superuser()
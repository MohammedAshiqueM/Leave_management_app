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
            'employee', # Replace with your app name
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

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser: {username}")
        user = User.objects.create_superuser(username=username, email=email, password=password)
        print("Superuser created successfully.")

        # Create a Profile for the superuser
        Profile.objects.create(user=user, role='admin')
        print("Profile created for the superuser.")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    create_superuser()
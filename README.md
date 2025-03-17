# Leave Application and Approval System

## Overview
The **Leave Application and Approval System** is a web-based application that facilitates the seamless submission, review, and approval of leave requests within an organization. It includes user authentication, leave request management, approval workflow, and a reporting system.

## Features
- **User Authentication**: Secure login and access control for managers and employees.
- **Leave Application Submission**: Employees can submit leave requests with details like leave type, duration, and reason.
- **Leave Approval Workflow**: Managers can approve or reject leave requests.
- **Leave Status Tracking**: Users can track the status of their leave requests.
- **Calendar View / Leave Report**: Visual representation of leave schedules or total leave reports.
- **Responsive Design**: Accessible across different devices and browsers.

---

## Tech Stack
### Backend:
- Django (DRF) for API development
- SQLite for database management
- Django REST Framework for API handling
- Swagger for API documentation

### Frontend:
- React (Vite) for UI development
- Context API for state management
- Tailwind CSS for styling

### Deployment:
- Backend: Hosted on **Render**
- Frontend: Hosted on **Vercel**

---

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- Python (3.9 or later)
- Node.js (16.x or later) & npm/yarn

### Backend Setup (Django API)
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/leave-app.git
   cd Leave_app/server
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. Create a `.env` file and configure the API URL:
   ```env
   SECRET_KEY = 'your django secret key'
   ```
   
4. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
5. Set up the database:
   ```sh
   python manage.py migrate
   ```
6. Create a superuser:
   ```sh
   python manage.py createsuperuser
   ```
7. Run the development server:
   ```sh
   python manage.py runserver
   ```

### Frontend Setup (React Vite)
1. Navigate to the frontend directory:
   ```sh
   cd Leave_app/server
   ```
2. Install all dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```
Note : baseUrl = 'http://127.0.0.1:8000/api/' is initialized on src/constants.js
---

## API Documentation
API documentation is available via Swagger. Once the backend is running, access:
```
http://127.0.0.1:8000/swagger/
```

---

## Accessing the Deployed Version
- **Frontend**: [Live URL]
- **Backend API**: [API URL]
- **Swagger Docs**: [Swagger URL]

---



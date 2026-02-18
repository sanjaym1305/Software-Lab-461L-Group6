# HaaS - Hardware as a Service

A web application for managing hardware resources as a service. Users can create accounts, manage projects, and checkout/checkin shared hardware sets.

**EE 461L Software Engineering Lab - Group 6**

## Team

- Manas Pathak – Frontend development and UI integration
- Eshan Mehdiratta – Backend API development and system integration
- Pranav Krishnan – Database design and persistence logic
- Sanjay Margabandu – Infrastructure, deployment planning, and DevOps support
- Rohan Siva – Testing strategy, validation, and documentation

## Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React + Vite       |
| Backend   | Python / Flask     |
| Database  | MongoDB            |
| Auth      | bcrypt + JWT       |
| Testing   | pytest             |

## Project Structure

```
├── backend/
│   ├── app.py              # Flask application factory
│   ├── config.py           # Environment-based configuration
│   ├── models/             # Database access layer
│   │   ├── user.py         # User CRUD + authentication
│   │   ├── project.py      # Project CRUD + membership
│   │   └── hardware.py     # Hardware checkout/checkin logic
│   ├── routes/             # REST API endpoints
│   │   ├── auth.py         # POST /api/register, /api/login
│   │   ├── projects.py     # GET/POST /api/projects, join
│   │   └── hardware.py     # GET /api/hardware, checkout, checkin
│   ├── utils/
│   │   └── encryption.py   # bcrypt hashing + custom cipher
│   └── tests/              # pytest test suite
├── frontend/
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── api/api.js      # API client
│   │   └── context/        # Auth state management
│   └── index.html
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local install or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string and a JWT secret
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Run the Application

**Terminal 1 – Backend:**

```bash
cd backend
source venv/bin/activate
python app.py
```

The API server runs at `http://localhost:5050`.

**Terminal 2 – Frontend:**

```bash
cd frontend
npm run dev
```

The app opens at `http://localhost:3000`. The Vite dev server proxies `/api` requests to the Flask backend.

### 4. Run Tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

> Tests require a local MongoDB instance running on `localhost:27017`.

## API Endpoints

| Method | Endpoint                        | Description                    | Auth |
|--------|---------------------------------|--------------------------------|------|
| POST   | `/api/register`                 | Create a new user account      | No   |
| POST   | `/api/login`                    | Authenticate and get JWT token | No   |
| GET    | `/api/projects`                 | List user's projects           | Yes  |
| POST   | `/api/projects`                 | Create a new project           | Yes  |
| GET    | `/api/projects/:id`             | Get project details            | Yes  |
| POST   | `/api/projects/:id/join`        | Join an existing project       | Yes  |
| GET    | `/api/hardware`                 | List all hardware sets         | Yes  |
| POST   | `/api/hardware/checkout`        | Checkout hardware for project  | Yes  |
| POST   | `/api/hardware/checkin`         | Check-in hardware for project  | Yes  |
| GET    | `/api/health`                   | Health check                   | No   |

## Environment Variables

| Variable          | Description                          | Default                         |
|-------------------|--------------------------------------|---------------------------------|
| `MONGODB_URI`     | MongoDB connection string            | `mongodb://localhost:27017/haas_db` |
| `JWT_SECRET_KEY`  | Secret for signing JWT tokens        | `dev-secret-key-change-in-production` |
| `HWSET1_CAPACITY` | Initial capacity for HWSet1          | `100`                           |
| `HWSET2_CAPACITY` | Initial capacity for HWSet2          | `100`                           |

## Features

- **User Management**: Secure registration and login with bcrypt password hashing and JWT sessions
- **Project Management**: Create projects, join existing projects, view all your projects
- **Hardware Resources**: View HWSet1/HWSet2 capacity and availability, checkout and checkin hardware
- **Global Hardware Pool**: Hardware capacity is shared across all projects
- **Responsive UI**: Clean, modern interface that works on desktop and mobile

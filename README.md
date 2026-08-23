# Car Dealership Inventory System

A full-stack Car Dealership Inventory System that allows authenticated users to browse, search, and purchase vehicles, while admin users can manage the vehicle inventory through add, update, delete, and restock operations.

The project was developed as a full-stack application with a **FastAPI backend**, **React frontend**, and **PostgreSQL database**. The system also includes authentication, role-based authorization, vehicle search, inventory management, and automated backend tests.

---

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected vehicle APIs
* Role-based access control
* Admin-only inventory management

### Vehicle Inventory

Each vehicle contains:

* Unique ID
* Make
* Model
* Category
* Price
* Quantity in stock

### Vehicle Operations

#### Regular Users

* View available vehicles
* Search vehicles
* Filter by make
* Filter by model
* Filter by category
* Filter by minimum price
* Filter by maximum price
* Purchase vehicles

#### Admin Users

* Add vehicles
* Update vehicle details
* Delete vehicles
* Restock vehicles
* Perform all regular-user operations

Admin authorization is enforced at the backend API level as well as reflected in the frontend UI.

---

## Search

The vehicle search functionality supports multiple filters:

* Make
* Model
* Category
* Minimum price
* Maximum price

Multiple filters can be combined in a single search.

Example:

```text
Make: Toyota
Category: Sedan
Minimum Price: ₹20,000
Maximum Price: ₹30,000
```

---

## Technology Stack

### Frontend

* React
* JavaScript
* CSS
* Vite

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication

### Database

* PostgreSQL

### Testing

* Pytest
* FastAPI TestClient

### Development Tools

* Git
* GitHub
* VS Code
* AI-assisted development using Claude and ChatGPT

---

# Project Structure

```text
car-dealership-inventory/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── dependencies/
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── VehicleDashboard.jsx
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── PROMPTS.md
└── README.md
```

---

# Local Setup

## Prerequisites

Make sure the following are installed:

* Python 3.11+
* Node.js and npm
* PostgreSQL
* Git

---

# Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

## Create a virtual environment

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Configure the database

Create a PostgreSQL database and configure the database connection using the environment variables expected by the backend.

Example:

```text
DATABASE_URL=postgresql://username:password@localhost:5432/dealership
```

Configure the JWT/authentication settings required by the application.

---

## Run the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

FastAPI interactive API documentation is available at:

```text
http://localhost:8000/docs
```

---

# Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Make sure the backend is running before using the frontend.

---

# Running Tests

Navigate to the backend:

```bash
cd backend
```

Run the test suite:

```bash
pytest
```

The test suite covers important functionality including:

* Authentication
* Protected endpoints
* Vehicle operations
* Authorization
* Inventory functionality

## Test Report

Final test results should be recorded here after running the complete test suite.

Example:

```text
============================= test session starts =============================
collected XX items

XX passed
============================== XX passed ==============================
```

---

# API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Vehicles

```text
GET    /api/vehicles
GET    /api/vehicles/search
POST   /api/vehicles
PUT    /api/vehicles/{id}
DELETE /api/vehicles/{id}
```

## Vehicle Operations

```text
POST /api/vehicles/{id}/purchase
POST /api/vehicles/{id}/restock
```

### Authorization

The following operations require an administrator account:

```text
POST   /api/vehicles
PUT    /api/vehicles/{id}
DELETE /api/vehicles/{id}
POST   /api/vehicles/{id}/restock
```

Normal authenticated users can view/search vehicles and purchase vehicles.

---

# My AI Usage

AI tools were used as development assistants throughout the project. The implementation, integration, testing, and final decisions were performed and verified manually.

## AI Tools Used

### Claude

Claude was used primarily to assist with frontend development and styling.

Examples of usage:

* Generated initial CSS boilerplate for the premium vehicle dashboard.
* Assisted with structuring the dashboard styling.
* Helped improve the visual presentation of the vehicle inventory cards and dashboard sections.

The generated styling was manually reviewed, integrated, and adapted into the React application.

### ChatGPT

ChatGPT was used as a development assistant during both frontend and backend development.

Examples of usage:

* Assisted with debugging frontend and backend integration issues.
* Helped reason through API endpoint behavior.
* Assisted with identifying authorization requirements.
* Helped review the vehicle search implementation, including price-range filtering.
* Assisted with understanding and resolving development errors.
* Helped review the final application against the project requirements.
* Assisted with documentation and development workflow decisions.

## Reflection on AI Usage

AI tools helped accelerate the development process by providing suggestions, debugging assistance, and initial implementation ideas. They were particularly useful when troubleshooting integration issues and improving the frontend styling.

However, AI-generated code was not treated as a final solution without review. I manually integrated the generated code into the project, adapted it to the existing architecture, tested the functionality, and made the final implementation decisions.

Using AI also helped me focus more on understanding the underlying architecture and requirements rather than spending excessive time on repetitive boilerplate. At the same time, reviewing and debugging AI-generated suggestions reinforced the importance of understanding the code rather than relying on generated solutions blindly.

---

# AI Prompt Logs

The root-level `PROMPTS.md` file contains the raw AI prompts/chat logs used during development, as required by the project specification.

The prompts are provided without AI-generated summaries.

---

# Development Approach

The project was developed incrementally by implementing and testing the backend APIs before integrating them with the React frontend.

The main development areas included:

1. Authentication
2. Database and vehicle models
3. Vehicle CRUD APIs
4. Search functionality
5. Purchase and inventory management
6. Role-based authorization
7. React frontend integration
8. Admin dashboard functionality
9. Automated testing
10. UI refinement and final documentation

---
# Screenshots

### 1. Login Page
<img width="1568" height="717" alt="image" src="https://github.com/user-attachments/assets/5af9cf24-e7d8-4705-99b4-9f8a0d10cdf4" />

**Features:**
- Email and password input fields
- "Sign in" button
- Secure access message
- Professional branding (Velocity Motors)

---

### 2. Dashboard
<img width="1568" height="726" alt="image" src="https://github.com/user-attachments/assets/b07fd915-246c-4738-9cbf-0128e27a4a45" />

**Features:**
- Welcome message
- Quick statistics
- Total Models, Available Stock, Categories

---

### 3. Vehicle Inventory
<img width="1568" height="730" alt="image" src="https://github.com/user-attachments/assets/0f7d48c0-2935-46a3-af61-210c53aa219e" />

**Features:**
- Admin "Add Vehicle" button
- Search filters (Make, Model, Category, Price)
- Vehicle cards with details and actions

---

### 4. Sold Out Vehicle
<img width="578" height="686" alt="image" src="https://github.com/user-attachments/assets/955f60db-5bf8-4d07-8eda-fde23bd1d4ed" />

**Features:**
- "Sold Out" badge
- "Unavailable" disabled button
- Full vehicle details

---

### 5. Restock Success
<img width="1551" height="784" alt="image" src="https://github.com/user-attachments/assets/67c5e671-1059-4873-b573-3e993e5597b7" />

**Features:**
- Success notification
- Updated inventory count
- Real-time UI refresh

---

### 6. Search Functionality
<img width="1568" height="654" alt="image" src="https://github.com/user-attachments/assets/4634270b-2afd-4f30-8a37-724d3113e9de" />

**Features:**
- Filter by Make, Model, Category, Price
- Results displayed instantly
- Clear button to reset filters

---

### 7. Add Vehicle Form
<img width="1568" height="779" alt="image" src="https://github.com/user-attachments/assets/6f94248c-8507-4865-9f25-11883468df2a" />

**Features:**
- Admin form to add new vehicles
- Fields: Make, Model, Category, Price, Quantity
- Success notification on submission

---

### 8. Final Inventory
<img width="1228" height="862" alt="image" src="https://github.com/user-attachments/assets/3675745e-bc66-4e9c-9dc9-cfea8122a117" />

**Features:**
- Multiple vehicles with stock levels
- Mixed inventory states
- Responsive card layout
- All CRUD operations functional

---
# Security & Authorization

The application uses JWT-based authentication for protected endpoints.

Admin privileges are checked on the backend for inventory-management operations. This prevents non-admin users from bypassing the frontend and directly calling protected APIs.

Admin-only operations include:

* Adding vehicles
* Updating vehicles
* Deleting vehicles
* Restocking vehicles

Frontend controls are also conditionally displayed based on the authenticated user's role.

---

# Future Improvements

Possible future improvements include:

* Deploying the application to a cloud platform
* Adding advanced sorting options
* Adding pagination for larger inventories
* Adding vehicle image uploads
* Adding transaction history
* Adding an analytics dashboard for administrators
* Adding more comprehensive frontend tests
* Improving production configuration and environment management

---

# License

This project was developed as part of a software development/TDD assignment.

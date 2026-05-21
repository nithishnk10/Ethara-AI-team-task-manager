# Ethara AI Team Task Manager

## Project Overview

Ethara AI Team Task Manager is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The application is designed to simplify project and task management within teams by implementing secure authentication and role-based access control.

The system allows administrators to create projects, assign tasks, manage team members, and monitor task progress efficiently. Members can securely access only the tasks assigned to them and update task statuses accordingly.

The project demonstrates complete frontend-backend integration, RESTful API development, database management, JWT-based authentication, role-based authorization, and cloud deployment using modern development tools and services.

---

# Objective

The primary objective of this project is to develop a centralized task management platform that enables efficient collaboration between administrators and team members.

The application aims to:

* Improve task assignment and monitoring
* Provide secure user authentication
* Implement role-based dashboards
* Enable project-level collaboration
* Demonstrate full-stack application deployment

---

# Technologies Used

## Frontend Technologies

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Toastify
* React Icons

## Backend Technologies

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js

## Database

* MongoDB Atlas

## Deployment Platforms

* Frontend Deployment: Vercel
* Backend Deployment: Railway

---

# Key Features

## User Authentication

* User signup and login functionality
* JWT-based authentication system
* Secure password hashing using bcrypt
* Session persistence using localStorage

## Role-Based Access Control

The application supports two different user roles:

### Admin

Admins have permission to:

* Create projects
* Add or remove members from projects
* Create and assign tasks
* Update and delete tasks
* Delete projects
* Monitor project progress and task analytics

### Member

Members can:

* View assigned projects
* Access only their assigned tasks
* Update task status
* Monitor personal task progress

---

# Dashboard Functionalities

## Admin Dashboard

The Admin Dashboard acts as the central management panel for the entire application.

The admin can:

* Create multiple projects
* Assign project members using registered email IDs
* Create tasks with title, description, priority, and status
* Assign tasks to specific members
* Delete completed or unnecessary tasks
* Delete projects along with associated tasks
* Track project progress using analytics cards

The dashboard is dynamically updated to reflect changes in real time.

---

## Member Dashboard

The Member Dashboard provides a simplified interface focused only on tasks assigned to the logged-in member.

Members can:

* View assigned tasks grouped by project
* Update task status
* Monitor pending and completed tasks
* Access only authorized project information

This ensures secure access control and prevents unauthorized visibility of other users’ tasks.

---

# Authentication Flow

The authentication system is implemented using JWT (JSON Web Token).

Authentication workflow:

1. User creates an account through the signup page.
2. Passwords are encrypted using bcrypt before storing in MongoDB.
3. During login, credentials are verified securely.
4. A JWT token is generated after successful authentication.
5. The token is stored in localStorage.
6. Protected routes validate the token and user role before granting access.

---

# Database Design

MongoDB Atlas is used as the cloud database solution.

The application includes the following collections:

* Users
* Projects
* Tasks

Relationships between collections:

* A project can contain multiple members
* A project can contain multiple tasks
* Each task is assigned to a specific user

---

# API Functionalities

The backend is developed using Express.js and follows REST API architecture.

Major API functionalities include:

* User authentication APIs
* Project management APIs
* Task management APIs
* Dashboard analytics APIs
* Member management APIs

The APIs are secured using JWT middleware and role-based authorization middleware.

---

# Project Structure

```bash id="y4j7np"
Ethara-AI-team-task-manager
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   └── App.jsx
│   │
│   ├── public
│   └── package.json
│
└── README.md
```

---

# Installation and Setup Instructions

## Step 1: Clone Repository

```bash id="j4xv9a"
git clone https://github.com/nithishnk10/Ethara-AI-team-task-manager.git
```

---

# Backend Setup

## Navigate to Backend Directory

```bash id="j92n3m"
cd backend
```

## Install Dependencies

```bash id="x6m2wp"
npm install
```

## Create Environment Variables

Create a `.env` file inside the backend folder.

Example configuration:

```env id="j6k4ns"
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

## Start Backend Server

```bash id="m3q8ft"
npm start
```

Backend server runs on:

```bash id="u2p9lv"
http://localhost:5000
```

---

# Frontend Setup

## Navigate to Frontend Directory

```bash id="q7d1xc"
cd frontend
```

## Install Dependencies

```bash id="n3w8ke"
npm install
```

## Create Frontend Environment Variables

Create a `.env` file inside the frontend directory.

Example configuration:

```env id="b7t2mz"
VITE_API_URL=http://localhost:5000/api
```

## Run Frontend Application

```bash id="t5v8an"
npm run dev
```

Frontend runs on:

```bash id="f8y1kc"
http://localhost:5173
```

---

# Deployment Details

## Frontend Deployment

The frontend application is deployed using Vercel.

Deployment process:

* GitHub repository connected to Vercel
* Frontend directory configured as root directory
* Environment variables configured in Vercel dashboard
* Automatic deployment enabled on every GitHub push

## Backend Deployment

The backend APIs are deployed using Railway.

Deployment process:

* Railway connected to GitHub repository
* Backend directory configured as root directory
* MongoDB Atlas connection string configured through environment variables
* Backend APIs exposed publicly

## Database Hosting

MongoDB Atlas is used for cloud database hosting and management.

---

# Live Application Links

## Frontend URL

[(Add your Vercel frontend URL)](https://ethara-ai-team-task-manager-two.vercel.app/)

## Backend URL

[(Add your Railway backend URL)](https://ethara-ai-team-task-manager-production-c9b2.up.railway.app/)

## GitHub Repository

https://github.com/nithishnk10/Ethara-AI-team-task-manager

---

# Sample Credentials

## Admin Account

```bash id="e6z4pc"
Email: nithis@gmail.com
Password: nithish
```

## Member Account

```bash id="q9f7rw"
Email: manoj@gmail.com
Password: manoj
```

---

# Testing Functionalities

The following functionalities were tested successfully:

* User registration
* User login
* JWT authentication
* Protected routes
* Project creation
* Member assignment
* Task assignment
* Task status updates
* Role-based dashboard rendering
* Cloud deployment integration

---

# Challenges Faced During Development

Some major challenges faced during development included:

* Synchronizing task updates between dashboards
* Managing role-based route protection
* Configuring cloud deployment environments
* Connecting frontend and backend after deployment
* Handling project and task deletion synchronization

These issues were resolved through API optimization, state management improvements, and deployment configuration fixes.

---

# Learning Outcomes

This project helped in gaining practical knowledge in:

* Full-stack MERN application development
* REST API creation and integration
* JWT authentication and authorization
* MongoDB schema design
* React state management
* Protected routing
* Cloud deployment using Railway and Vercel
* Real-world project structuring

---

# Conclusion

Ethara AI Team Task Manager is a scalable and secure project management application developed using modern full-stack technologies.

The project successfully demonstrates:

* Authentication and authorization
* Role-based dashboards
* Task and project management
* Cloud database integration
* Full-stack deployment workflow

The application provides a strong foundation for building larger enterprise-level collaboration and productivity systems in the future.


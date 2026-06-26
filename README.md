# Mini Task Manager

A simple full-stack task management application built with **React**, **Node.js**, **Express**, and **TypeScript**.

The application demonstrates clean architecture, RESTful API design, task lifecycle management, and immutable audit logging. Data is stored in JSON files to keep the project lightweight and easy to run without requiring a database.

---

# Features

## Task Management

* Create a task
* View all tasks
* Update task status
* Delete a task

## Task Status Workflow

Each task must follow the predefined workflow:

```
to_do → pending → in_progress → done
```

Invalid status transitions are rejected by the server to ensure data consistency.

## Audit Log

Every successful status update creates a new audit log containing:

* Task ID
* Actor
* Previous status
* New status
* Timestamp

Audit logs are stored separately and displayed in chronological order.

## Idempotent Status Update

Updating a task with the same status does not create duplicate audit logs.

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Axios

## Backend

* Node.js
* Express
* TypeScript

## Data Storage

* JSON Files

---

# Project Structure

## Backend

The backend follows a simple layered architecture.

```
src
├── controllers
├── routes
├── services
├── persistence
├── models
└── app.ts
```

### Layers

### Route Layer

Defines REST API endpoints.

### Controller Layer

Handles HTTP requests and responses.

### Service Layer

Contains business logic including:

* Task creation
* Status transition validation
* Audit log generation
* Idempotent update handling

### Persistence Layer

Handles reading and writing data to JSON files.

---

## Frontend

The frontend is organized into:

```
src
├── api
├── components
├── pages
├── types
└── App.tsx
```

Responsibilities include:

* Fetching data from the backend
* Displaying tasks
* Updating task status
* Viewing audit history

State management is implemented using React Hooks (`useState` and `useEffect`).

---

# API Endpoints

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/tasks`                | Get all tasks             |
| POST   | `/tasks`                | Create a new task         |
| PATCH  | `/tasks/:id/status`     | Update task status        |
| DELETE | `/tasks/:id`            | Delete a task             |
| GET    | `/tasks/:id/audit-logs` | Get audit logs for a task |

---

# Running the Project

## Backend

```bash
cd backend
npm install
npm run dev
```

Runs on:

```
http://localhost:3001
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# Design Decisions

This project uses JSON files instead of a database to keep the setup simple and dependency-free.

The business logic is separated from the persistence layer, making it easier to migrate to a relational or NoSQL database in the future.

Audit logs are designed as append-only records and cannot be modified through the API, preserving the integrity of task history.

---

# Current Limitations

* JSON file storage is not suitable for concurrent users.
* No authentication or authorization.
* No database transactions.
* No pagination or search functionality.

---

# Possible Improvements

Future enhancements may include:

* PostgreSQL or MongoDB integration
* JWT authentication
* Unit and integration testing
* Docker support
* Request validation using Zod
* Search, filtering, and sorting
* Pagination
* Better UI/UX
* Structured application logging
* CI/CD pipeline with GitHub Actions

---

# Learning Objectives

This project was created to practice:

* REST API development
* Layered architecture
* TypeScript
* React frontend development
* Business rule validation
* Audit logging
* Clean project structure
* Separation of concerns

---

# License

This project is available under the MIT License.

# 🏗️ Kizuna Backend Architecture

> **Version:** 1.0.0
> **Project:** Kizuna - Real-Time Chat Application
> **Backend Stack:** Node.js, Express.js, MongoDB, Socket.IO

---

# Overview

Kizuna follows a **layered architecture** to keep the backend modular, scalable, maintainable, and easy to test.

Each layer has a single responsibility and communicates only with adjacent layers.

```
                Client (React)
                      │
               HTTP / WebSocket
                      │
              Express Application
                      │
        ┌─────────────┴─────────────┐
        │                           │
    REST API                  Socket.IO
        │                           │
        └─────────────┬─────────────┘
                      │
                 Middleware Layer
                      │
                 Route Layer
                      │
              Validation Layer
                      │
              Controller Layer
                      │
               Service Layer
                      │
                Database Layer
                      │
                  MongoDB Atlas
```

---

# Project Structure

```
Kizuna-Server/
│
├── docs/
│
├── src/
│   ├── config/
│   │
│   ├── constants/
│   │
│   ├── controllers/
│   │
│   ├── db/
│   │
│   ├── lib/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── sockets/
│   │
│   ├── utils/
│   │
│   ├── validations/
│   │
│   ├── app.js
│   └── server.js
│
├── public/
├── package.json
└── README.md
```

---

# Layer Responsibilities

## 1. Config Layer

Responsible for loading application configuration.

Examples:

- Environment Variables
- Database Configuration
- Cloudinary Configuration
- JWT Configuration

Directory

```
src/config/
```

---

## 2. Database Layer

Responsible for connecting to MongoDB.

Directory

```
src/db/
```

Responsibilities

- Connect MongoDB
- Handle connection errors
- Retry logic (future)

---

## 3. Models Layer

Represents MongoDB collections.

Directory

```
src/models/
```

Responsibilities

- Database Schema
- Relationships
- Indexes
- Model Methods
- Static Methods

Example

```
User
Conversation
Message
Attachment
Notification
MessageReaction
```

---

## 4. Validation Layer

Validates incoming request data before reaching controllers.

Directory

```
src/validations/
```

Responsibilities

- Required fields
- Email validation
- Password validation
- Request body validation
- Query validation

Example

```
Create Conversation

↓

Validate Participants

↓

Controller
```

---

## 5. Middleware Layer

Executes before controllers.

Directory

```
src/middleware/
```

Responsibilities

- JWT Authentication
- Error Handling
- Multer Uploads
- Rate Limiting
- Security
- Request Logging

---

## 6. Route Layer

Defines API endpoints.

Directory

```
src/routes/
```

Example

```
POST /login

↓

Auth Controller
```

Routes should remain thin.

No business logic belongs here.

---

## 7. Controller Layer

Handles incoming requests.

Directory

```
src/controllers/
```

Responsibilities

- Receive Request
- Call Services
- Handle Errors
- Return Response

Controllers should NOT contain complex business logic.

---

## 8. Service Layer

Contains application business logic.

Directory

```
src/services/
```

Responsibilities

- Create Conversation
- Send Message
- Delete Message
- Add Participants
- Upload Attachments

Controllers call Services.

Services call Models.

---

## 9. Socket Layer

Responsible for all real-time communication.

Directory

```
src/sockets/
```

Responsibilities

- User Connection
- Join Conversation
- Typing Indicator
- Read Receipts
- Message Delivery
- Online Users
- Notifications

---

## 10. Utils Layer

Reusable helper functions.

Directory

```
src/utils/
```

Examples

- ApiResponse
- ApiError
- AsyncHandler
- Token Helpers

---

## 11. Library Layer

Third-party integrations.

Directory

```
src/lib/
```

Examples

- Cloudinary
- Redis (Future)

---

# Request Lifecycle

A normal HTTP request follows this flow:

```
Client

↓

Express

↓

Route

↓

Authentication Middleware

↓

Validation

↓

Controller

↓

Service

↓

Model

↓

MongoDB

↓

Service

↓

Controller

↓

Response
```

---

# Socket Lifecycle

```
Client

↓

Socket Connect

↓

Authenticate User

↓

Join Conversation

↓

Receive Events

↓

Broadcast Events

↓

Update Database

↓

Emit Response
```

---

# Database Flow

```
Controller

↓

Service

↓

Model

↓

MongoDB
```

Business logic never communicates directly with MongoDB.

---

# Authentication Flow

```
Register

↓

Hash Password

↓

Save User

↓

Login

↓

Generate Access Token

↓

Generate Refresh Token

↓

Protected Routes

↓

Verify JWT
```

---

# File Upload Flow

```
Client

↓

Multer

↓

Cloudinary

↓

Store URL

↓

Save Attachment

↓

Return Response
```

---

# Notification Flow

```
Message Created

↓

Save Notification

↓

Socket Emit

↓

Receiver Gets Notification
```

---

# Design Principles

The backend follows these principles:

- Separation of Concerns
- Single Responsibility Principle
- Layered Architecture
- RESTful API Design
- Modular Code Structure
- Scalable Folder Organization
- Reusable Components
- Centralized Error Handling
- Stateless Authentication
- Production-Ready Codebase

---

# Technologies

| Layer | Technology |
|--------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Hashing | bcrypt |
| File Upload | Multer |
| Media Storage | Cloudinary |
| Real-Time | Socket.IO |
| Validation | Validator / Custom Middleware |
| Security | Helmet, HPP, Rate Limiter |
| Logging | Morgan |

---

# Future Improvements

Planned architecture enhancements:

- Redis Caching
- Message Queue
- Push Notifications
- Elasticsearch
- Distributed File Storage
- Microservices
- Docker
- Kubernetes
- CI/CD Pipeline
- Monitoring & Logging

---

# Architecture Summary

```
React Client
      │
      ▼
Express Server
      │
      ▼
Routes
      │
      ▼
Middleware
      │
      ▼
Validation
      │
      ▼
Controllers
      │
      ▼
Services
      │
      ▼
Models
      │
      ▼
MongoDB Atlas

          ▲

Socket.IO
```

---

**Status:** ✅ Approved for Version 1.0

**Last Updated:** July 2026
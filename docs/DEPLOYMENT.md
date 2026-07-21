# 🚀 Kizuna Backend Deployment Guide

> **Version:** 1.0.0
> **Project:** Kizuna - Real-Time Chat Application
> **Environment:** Development & Production

---

# Overview

This document explains how to configure, run, and deploy the Kizuna backend.

Supported platforms:

- Local Development
- Render
- Railway
- VPS (Ubuntu)
- Docker (Future)

---

# Prerequisites

Install:

- Node.js (v20+ LTS recommended)
- npm
- Git
- MongoDB Atlas Account
- Cloudinary Account

---

# Clone Repository

```bash
git clone https://github.com/<username>/Kizuna-Server.git

cd Kizuna-Server
```

---

# Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
PORT=8000

NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# Run Development Server

```bash
npm run dev
```

---

# Run Production Server

```bash
npm start
```

---

# Project Structure

```
Kizuna-Server/

src/
docs/
public/

package.json

.env
.gitignore
```

---

# Build Checklist

Before deployment verify:

- Environment variables configured
- MongoDB Atlas connected
- Cloudinary configured
- JWT secrets added
- CORS configured
- Rate limiter enabled
- Helmet enabled

---

# MongoDB Atlas

Configure:

- Database User
- Network Access
- Connection URI

Example

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/kizuna
```

---

# Cloudinary

Required values:

```
Cloud Name

API Key

API Secret
```

---

# CORS

Development

```
http://localhost:5173
```

Production

```
https://your-domain.com
```

---

# Render Deployment

1. Connect GitHub repository
2. Select Node.js environment
3. Add environment variables
4. Build Command

```
npm install
```

5. Start Command

```
npm start
```

---

# Railway Deployment

1. Import GitHub repository
2. Add environment variables
3. Deploy

---

# Health Check

Recommended endpoint:

```
GET /api/v1/health
```

Response

```json
{
    "success": true,
    "message": "Server is running."
}
```

---

# Logging

Production logs should include:

- Server startup
- Database connection
- Authentication failures
- Unexpected errors

Sensitive data such as passwords, JWT secrets, and refresh tokens must never be logged.

---

# Deployment Checklist

- Node.js installed
- Dependencies installed
- Environment variables configured
- MongoDB connected
- Cloudinary connected
- Server starts successfully
- API routes accessible
- Socket.IO connection works

---

# Future Improvements

- Docker support
- Docker Compose
- Nginx reverse proxy
- GitHub Actions CI/CD
- PM2 process manager
- HTTPS with SSL
- Monitoring (Grafana/Prometheus)

---

# Status

✅ Deployment guide finalized for **Kizuna Backend v1.0**
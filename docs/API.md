# 🔌 Kizuna Backend API

> **Version:** 1.0.0
> **Base URL:** `/api/v1`
> **Protocol:** REST API
> **Authentication:** JWT (Bearer Token)

---

# API Overview

Kizuna exposes REST APIs for:

- Authentication
- Users
- Conversations
- Messages
- Attachments
- Message Reactions
- Notifications

---

# Response Format

Every API returns a consistent response structure.

## Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Something went wrong.",
    "errors": []
}
```

---

# Authentication

Protected routes require:

```
Authorization: Bearer <AccessToken>
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# Authentication APIs

---

## Register

POST `/auth/register`

Authentication

❌ Not Required

Body

```json
{
    "username": "",
    "email": "",
    "fullName": "",
    "password": ""
}
```

Success

```
201 Created
```

---

## Login

POST `/auth/login`

Authentication

❌ Not Required

Body

```json
{
    "email": "",
    "password": ""
}
```

Success

```
200 OK
```

---

## Logout

POST `/auth/logout`

Authentication

✅ Required

---

## Refresh Token

POST `/auth/refresh-token`

Authentication

❌ Uses Refresh Token Cookie

---

## Get Current User

GET `/auth/me`

Authentication

✅ Required

---

## Change Password

PATCH `/auth/change-password`

Authentication

✅ Required

---

## Update Profile

PATCH `/auth/update-profile`

Authentication

✅ Required

---

## Update Avatar

PATCH `/auth/avatar`

Authentication

✅ Required

Multipart/Form-Data

---

# User APIs

---

## Search Users

GET `/users/search`

Query

```
?q=john
```

Authentication

✅ Required

---

## Get User Profile

GET `/users/:userId`

Authentication

✅ Required

---

# Conversation APIs

---

## Create Conversation

POST `/conversations`

Authentication

✅ Required

Body

```json
{
    "type": "direct",
    "participants": []
}
```

---

## Get User Conversations

GET `/conversations`

Authentication

✅ Required

---

## Get Conversation

GET `/conversations/:conversationId`

Authentication

✅ Required

---

## Update Conversation

PATCH `/conversations/:conversationId`

Authentication

✅ Required

---

## Delete Conversation

DELETE `/conversations/:conversationId`

Authentication

✅ Required

---

## Add Participants

POST `/conversations/:conversationId/participants`

Authentication

✅ Required

---

## Remove Participant

DELETE `/conversations/:conversationId/participants/:userId`

Authentication

✅ Required

---

# Message APIs

---

## Send Message

POST `/messages`

Authentication

✅ Required

Multipart/Form-Data

Body

```
conversation
content
attachments[]
replyTo
```

---

## Get Messages

GET `/messages/:conversationId`

Authentication

✅ Required

Supports

- Pagination
- Infinite Scroll

---

## Edit Message

PATCH `/messages/:messageId`

Authentication

✅ Required

---

## Delete Message

DELETE `/messages/:messageId`

Authentication

✅ Required

---

## Pin Message

PATCH `/messages/:messageId/pin`

Authentication

✅ Required

---

# Attachment APIs

---

## Upload Attachment

POST `/attachments`

Authentication

✅ Required

Multipart/Form-Data

---

## Delete Attachment

DELETE `/attachments/:attachmentId`

Authentication

✅ Required

---

# Message Reaction APIs

---

## Add Reaction

POST `/messages/:messageId/reactions`

Authentication

✅ Required

Body

```json
{
    "emoji": "❤️"
}
```

---

## Remove Reaction

DELETE `/messages/:messageId/reactions`

Authentication

✅ Required

---

# Notification APIs

---

## Get Notifications

GET `/notifications`

Authentication

✅ Required

---

## Mark Notification as Read

PATCH `/notifications/:notificationId/read`

Authentication

✅ Required

---

## Mark All Notifications as Read

PATCH `/notifications/read-all`

Authentication

✅ Required

---

# Pagination

Supported Endpoints

- Conversations
- Messages
- Notifications

Example

```
?page=1&limit=20
```

---

# Sorting

Supported

```
?sort=createdAt

?sort=lastActivity
```

---

# Searching

Example

```
GET /users/search?q=arman
```

---

# API Versioning

Current Version

```
/api/v1
```

Future

```
/api/v2
```

---

# API Modules

```
Authentication
│
├── Register
├── Login
├── Logout
├── Refresh Token
└── Profile

Users
│
├── Search
└── Profile

Conversations
│
├── Create
├── Read
├── Update
├── Delete
└── Participants

Messages
│
├── Send
├── Edit
├── Delete
├── Pin
└── Reply

Attachments
│
├── Upload
└── Delete

Reactions
│
├── Add
└── Remove

Notifications
│
├── Get
├── Read
└── Read All
```

---

# API Status

| Module | Status |
|---------|--------|
| Authentication | ✅ Complete |
| Users | 🟡 Planned |
| Conversations | 🟡 Planned |
| Messages | 🟡 Planned |
| Attachments | 🟡 Planned |
| Reactions | 🟡 Planned |
| Notifications | 🟡 Planned |

---

# Status

✅ API Contract finalized for **Kizuna Backend v1.0**
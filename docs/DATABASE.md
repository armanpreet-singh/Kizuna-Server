# 🗄️ Database Design

> **Version:** 1.0.0  
> **Project:** Kizuna - Real-Time Chat Application  
> **Database:** MongoDB Atlas  
> **ODM:** Mongoose

---

# Overview

Kizuna uses **MongoDB** as its primary database with **Mongoose** as the Object Data Modeling (ODM) library.

The database is designed to be:

- Scalable
- Normalized
- Easy to maintain
- Optimized for real-time messaging
- Flexible for future features

---

# Database Collections

Kizuna consists of **6 primary collections**.

| Collection | Purpose |
|------------|---------|
| Users | Store user accounts |
| Conversations | Store direct & group chats |
| Messages | Store chat messages |
| Attachments | Store uploaded media metadata |
| MessageReactions | Store emoji reactions |
| Notifications | Store user notifications |

---

# Entity Relationship Diagram

> **Diagram Source**

```
docs/diagrams/er-diagram.eraser
```

> **Diagram Preview**

```text
                     USERS
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
 Conversations    Notifications   MessageReactions
        │                               ▲
        │                               │
        ▼                               │
     Messages───────────────────────────┘
        │
        ▼
   Attachments
```

> Exported Image

```
docs/diagrams/er-diagram.png
```

---

# Collections

---

# 1. Users

Stores registered user information.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| username | String | Unique username |
| email | String | User email |
| fullName | String | Display name |
| avatar | String | Profile image URL |
| coverImage | String | Cover image |
| bio | String | User bio |
| password | String | Hashed password |
| refreshToken | String | JWT Refresh Token |
| isOnline | Boolean | Online status |
| lastSeen | Date | Last active timestamp |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Update timestamp |

---

## Relationships

```
User

↓

Conversation

↓

Message

↓

Notification

↓

Reaction
```

---

## Indexes

```
username (Unique)

email (Unique)
```

---

# 2. Conversations

Stores direct and group chats.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| type | String | direct / group |
| name | String | Group name |
| description | String | Group description |
| participants | ObjectId[] | Members |
| groupAdmin | ObjectId | Admin user |
| createdBy | ObjectId | Creator |
| groupAvatar | String | Group image |
| lastMessage | ObjectId | Latest message |
| lastActivity | Date | Last activity |
| createdAt | Date | Creation time |
| updatedAt | Date | Update time |

---

## Relationships

```
Conversation

↓

Users

↓

Messages
```

---

## Indexes

```
participants

lastActivity
```

---

# 3. Messages

Stores every chat message.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| conversation | ObjectId | Parent conversation |
| sender | ObjectId | Sender |
| type | String | text/image/video/audio/file |
| content | String | Message text |
| attachments | ObjectId[] | Media |
| replyTo | ObjectId | Reply target |
| isEdited | Boolean | Edited status |
| isDeleted | Boolean | Soft delete |
| isPinned | Boolean | Pinned message |
| createdAt | Date | Creation time |
| updatedAt | Date | Update time |

---

## Relationships

```
Conversation

↓

Messages

↓

Attachments

↓

Replies
```

---

## Indexes

```
conversation

createdAt

sender
```

---

# 4. Attachments

Stores uploaded file metadata.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| url | String | Cloudinary URL |
| publicId | String | Cloudinary ID |
| fileName | String | Original filename |
| mimeType | String | File type |
| fileSize | Number | Size in bytes |
| thumbnail | String | Preview |
| duration | Number | Audio/video duration |
| createdAt | Date | Upload time |

---

## Supported Types

- Image
- Video
- Audio
- PDF
- Document
- ZIP

---

# 5. Message Reactions

Stores emoji reactions.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| message | ObjectId | Target message |
| user | ObjectId | Reacting user |
| emoji | String | Emoji |
| createdAt | Date | Timestamp |

---

## Relationships

```
User

↓

Reaction

↓

Message
```

---

## Indexes

```
message

user
```

---

# 6. Notifications

Stores notifications for users.

## Fields

| Field | Type | Description |
|-------|------|-------------|
| receiver | ObjectId | Recipient |
| sender | ObjectId | Sender |
| type | String | Notification type |
| title | String | Title |
| content | String | Message |
| referenceId | ObjectId | Related document |
| isRead | Boolean | Read status |
| createdAt | Date | Timestamp |

---

## Notification Types

```
message

reaction

group

system
```

---

## Indexes

```
receiver

isRead
```

---

# Collection Relationships

```
Conversation
    │
    ├── Participants → Users
    ├── Group Admin → Users
    └── Created By → Users

Message
    ├── Conversation → Conversations
    ├── Sender → Users
    ├── Attachments → Attachments
    └── Reply To → Messages

Notification
    ├── Receiver → Users
    └── Sender → Users

Reaction
    ├── User → Users
    └── Message → Messages
```

---

# Database Design Decisions

## Why Separate Conversations?

Allows:

- Direct chats
- Group chats
- Easy participant management

---

## Why Separate Messages?

Messages grow rapidly.

Keeping them in a dedicated collection improves scalability.

---

## Why Separate Attachments?

Only metadata is stored.

Actual files remain in **Cloudinary**.

Benefits:

- Smaller message documents
- Easier file management
- Better scalability

---

## Why Message Reactions?

Avoids bloating message documents.

Supports:

- ❤️
- 👍
- 😂
- 🔥
- 🎉

---

## Why Notifications?

Centralized notification system.

Supports:

- New messages
- Group events
- Reactions
- System announcements

---

# Data Flow

```
User

↓

Conversation

↓

Message

↓

Attachment

↓

Notification

↓

Reaction
```

---

# Future Database Enhancements

Future collections may include:

- Friend Requests
- Voice Calls
- Video Calls
- Stories
- Status Updates
- User Blocking
- Archived Chats
- Message Search
- AI Assistant

---

# Database Summary

| Property | Value |
|----------|-------|
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Collections | 6 |
| Relationships | Referenced using ObjectId |
| File Storage | Cloudinary |
| Authentication | JWT |
| Scalability | High |
| Normalization | High |
| Soft Delete | Supported |
| Real-Time | Socket.IO |

---

# Status

✅ Database schema finalized for **Kizuna Backend v1.0**

Last Updated: July 2026
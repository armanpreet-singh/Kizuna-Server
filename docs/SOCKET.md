# ⚡ Kizuna Socket.IO Documentation

> **Version:** 1.0.0  
> **Transport:** WebSocket (Socket.IO)  
> **Authentication:** JWT  
> **Status:** Planned

---

# Overview

Kizuna uses **Socket.IO** to provide real-time communication.

Features powered by Socket.IO include:

- Real-time messaging
- Typing indicators
- Online/offline status
- Read receipts
- Message reactions
- Notifications
- Group updates

---

# Connection Flow

```
React Client

↓

Socket.IO Connect

↓

JWT Authentication

↓

User Connected

↓

Join Personal Room

↓

Join Conversation Rooms

↓

Ready
```

---

# Authentication

Client sends JWT during connection.

Example

```javascript
const socket = io(BASE_URL, {
    auth: {
        token: accessToken
    }
});
```

Server

```
Verify JWT

↓

Find User

↓

Allow Connection

↓

Reject if Invalid
```

---

# Socket Rooms

Every connected user automatically joins:

```
user:<userId>
```

Example

```
user:64ab91...
```

Conversation rooms:

```
conversation:<conversationId>
```

Example

```
conversation:6829a...
```

---

# Client Events

---

## Join Conversation

Event

```
conversation:join
```

Payload

```json
{
    "conversationId": ""
}
```

---

## Leave Conversation

Event

```
conversation:leave
```

Payload

```json
{
    "conversationId": ""
}
```

---

## Send Message

Event

```
message:send
```

Payload

```json
{
    "conversationId": "",
    "content": "",
    "attachments": [],
    "replyTo": null
}
```

---

## Start Typing

Event

```
typing:start
```

Payload

```json
{
    "conversationId": ""
}
```

---

## Stop Typing

Event

```
typing:stop
```

Payload

```json
{
    "conversationId": ""
}
```

---

## Mark Messages Read

Event

```
message:read
```

Payload

```json
{
    "conversationId": ""
}
```

---

## React to Message

Event

```
message:reaction
```

Payload

```json
{
    "messageId": "",
    "emoji": "❤️"
}
```

---

# Server Events

---

## Message Received

```
message:new
```

Payload

```json
{
    "message": {}
}
```

---

## Message Updated

```
message:updated
```

---

## Message Deleted

```
message:deleted
```

---

## User Typing

```
typing:start
```

Payload

```json
{
    "userId": "",
    "conversationId": ""
}
```

---

## User Stopped Typing

```
typing:stop
```

---

## User Online

```
user:online
```

Payload

```json
{
    "userId": ""
}
```

---

## User Offline

```
user:offline
```

---

## Message Read

```
message:read
```

---

## New Notification

```
notification:new
```

Payload

```json
{
    "notification": {}
}
```

---

## Reaction Added

```
reaction:new
```

Payload

```json
{
    "messageId": "",
    "emoji": "🔥"
}
```

---

# Event Flow

## Sending a Message

```
User

↓

message:send

↓

Validate

↓

Save Message

↓

Broadcast

↓

message:new

↓

Clients Updated
```

---

## Typing Indicator

```
User Starts Typing

↓

typing:start

↓

Broadcast

↓

Other Users See "Typing..."
```

---

## Read Receipts

```
User Opens Chat

↓

message:read

↓

Update Database

↓

Broadcast

↓

Sender Sees Read Status
```

---

## Reactions

```
React

↓

Save Reaction

↓

Broadcast

↓

Update UI
```

---

## Notifications

```
Message Created

↓

Create Notification

↓

notification:new

↓

Receiver Updated
```

---

# Socket Middleware

Before any event is processed:

```
Connect

↓

JWT Verify

↓

Load User

↓

Attach socket.user

↓

Continue
```

---

# Error Events

Server emits:

```
socket:error
```

Example

```json
{
    "message": "Unauthorized"
}
```

---

# Disconnect Flow

```
User Disconnects

↓

Update isOnline = false

↓

Update lastSeen

↓

Broadcast user:offline

↓

Disconnect
```

---

# Folder Structure

```
src/
└── sockets/
    ├── index.js
    ├── auth.socket.js
    ├── conversation.socket.js
    ├── message.socket.js
    ├── notification.socket.js
    ├── reaction.socket.js
    └── presence.socket.js
```

---

# Future Events

Planned for v2

```
voice:start

voice:end

call:start

call:end

screen:share

story:new

message:forward

message:pin

conversation:mute

conversation:archive
```

---

# Socket Summary

| Feature | Status |
|---------|--------|
| Authentication | ✅ |
| Join Rooms | ✅ |
| Send Message | ✅ |
| Typing | ✅ |
| Online Status | ✅ |
| Read Receipts | ✅ |
| Reactions | ✅ |
| Notifications | ✅ |
| Voice Calls | 🔜 |
| Video Calls | 🔜 |

---

# Status

✅ Socket.IO design finalized for **Kizuna Backend v1.0**
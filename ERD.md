
```mermaid
erDiagram

  %% ================= USERS & AUTH =================
  USER {
    string id PK
    string email
    string password_hash
    string username
    string avatar_url
    string status
    datetime created_at
    datetime updated_at
  }

  VERIFY_CODE {
    string id PK
    string user_id FK
    string code
    datetime expires_at
    boolean is_used
    datetime created_at
  }

  USER_SESSION {
    string id PK
    string user_id FK
    string jwt_token
    datetime created_at
    datetime expires_at
  }

  %% ================= SOCIAL =================
  FRIEND {
    string id PK
    string requester_id FK
    string addressee_id FK
    string status
    datetime created_at
  }
  %% FRIEND.status = pending | accepted | declined | blocked

  BLOCKED_USER {
    string id PK
    string user_id FK
    string blocked_user_id FK
    datetime blocked_at
  }

  %% ================= CHAT =================
  CONVERSATION {
    string id PK
    string type
    string name
    string created_by FK
    datetime created_at
  }
  %% CONVERSATION.type = private | group

  CONVERSATION_MEMBER {
    string id PK
    string conversation_id FK
    string user_id FK
    string role
    datetime joined_at
  }
  %% CONVERSATION_MEMBER.role = admin | member

  MESSAGE {
    string id PK
    string conversation_id FK
    string sender_id FK
    string type
    string content
    string status
    datetime timestamp
  }
  %% MESSAGE.type = text | image | file | voice
  %% MESSAGE.status = sent | delivered | read

  MESSAGE_REACTION {
    string id PK
    string message_id FK
    string user_id FK
    string emoji
    datetime reacted_at
  }

  READ_RECEIPT {
    string id PK
    string message_id FK
    string user_id FK
    datetime read_at
  }

  %% ================= NOTIFICATION =================
  NOTIFICATION {
    string id PK
    string user_id FK
    string title
    string body
    string type
    string related_id
    boolean is_read
    datetime created_at
  }
  %% NOTIFICATION.type = message | friend_request | system | ...
  %% related_id: tuỳ theo type (message_id, friend_id, ...)

  %% ================= RELATIONSHIPS =================
  USER ||--o{ VERIFY_CODE : has
  USER ||--o{ USER_SESSION : has

  USER ||--o{ FRIEND : requester
  USER ||--o{ FRIEND : addressee

  USER ||--o{ BLOCKED_USER : blocks
  BLOCKED_USER ||--|| USER : blocked_target

  USER ||--o{ CONVERSATION : creates
  CONVERSATION ||--o{ CONVERSATION_MEMBER : has
  USER ||--o{ CONVERSATION_MEMBER : joins

  CONVERSATION ||--o{ MESSAGE : contains
  USER ||--o{ MESSAGE : sends

  MESSAGE ||--o{ MESSAGE_REACTION : has
  USER ||--o{ MESSAGE_REACTION : reacts

  MESSAGE ||--o{ READ_RECEIPT : read_by
  USER ||--o{ READ_RECEIPT : reads

  USER ||--o{ NOTIFICATION : receives
           
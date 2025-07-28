```meimaid 
erDiagram
    %% Value Types
    # conversation.type: "direct", "group"
    # message.type: "text", "image", "file", "voice", "video", "sticker"
    # message.status: "sent", "delivered", "read"
    # friend.status: "pending", "accepted", "rejected", "blocked"
    # file.type: "image", "video", "document", "audio", "other"
    # notification.type: "friend_request", "new_message", "group_invite", "group_update"
    # member.role: "admin", "member"

    direction TB
    USER {
        string id PK ""  
        string email  ""  
        string password_hash  ""  
        string username  ""  
        string avatar_url  ""  
        boolean status  ""  
        datetime created_at  ""  
        datetime updated_at  ""  
    }

	FRIEND {
		string id PK ""  
		string requester_id FK ""  
		string addressee_id FK ""  
		string status  "pending/accepted/rejected/blocked"  
		datetime created_at  ""  
	}

	BLOCKED_USER {
		string id PK ""  
		string user_id FK ""  
		string blocked_user_id FK ""  
		datetime blocked_at  ""  
	}

	CONVERSATION {
		string id PK ""  
		string type  "direct/group"  
		string name  ""  
		string avatar  ""  
		string created_by FK ""  
		datetime created_at  ""  
	}

	MESSAGE_REACTION {
		string id PK ""  
		string message_id FK ""  
		string user_id FK ""  
		string emoji  ""  
		datetime reacted_at  ""  
	}

	USER_SESSION {
		string id PK,FK ""  
		string sessionId  ""  
		datetime created_at  ""  
		datetime expires_at  ""  
	}

	Invalid_TOKEN {
		string Token PK ""  
		datetime created_at  ""  
		datetime expires_at  ""  
	}

	MESSAGE {
		string id PK ""  
		string conversation_id FK ""  
		string sender_id FK ""  
		string type  "text/image/file/voice/video/sticker"  
		string content  ""  
		string status  "sent/delivered/read"  
		datetime timestamp  ""  
	}

	File {
		string id PK ""  
		string messageId FK ""  
		string type  "image/video/document/audio/other"  
		string fileName  ""  
		string url  ""  
		string path  ""  
		string md5checksum  ""  
	}

	READ_RECEIPT {
		string id PK ""  
		string message_id FK ""  
		string user_id FK ""  
		datetime read_at  ""  
		boolean status  ""  
	}

	VERIFY_CODE {
		string id PK ""  
		string user_id FK ""  
		string code  ""  
		datetime expires_at  ""  
		boolean status  ""  
		datetime created_at  ""  
	}

	MEMBER {
		string id PK ""  
		string conversation_id FK ""  
		string user_id FK ""  
		string role  "admin/member"  
		datetime joined_at  ""  
	}
	 NOTIFICATION {
    UUID id PK
    UUID user_id FK
    string title
    text body
    string type "friend_request/new_message/group_invite/group_update"
    UUID related_id
    boolean is_read
    datetime created_at
 	 }

	MESSAGE||--o{File:"has attachment"
	USER||--o{VERIFY_CODE:"has"
	USER||--o{USER_SESSION:"has"
	USER||--o{FRIEND:"requester"
	USER||--o{FRIEND:"addressee"
	USER||--o{BLOCKED_USER:"blocks"
	USER||--o{BLOCKED_USER:"is_blocked"
	USER||--o{CONVERSATION:"creates"
	CONVERSATION||--o{MEMBER:"has"
	USER||--o{MEMBER:"joins"
	CONVERSATION||--o{MESSAGE:"contains"
	USER||--o{MESSAGE:"sends"
	MESSAGE||--o{MESSAGE_REACTION:"has"
	USER||--o{MESSAGE_REACTION:"reacts"
	MESSAGE||--o{READ_RECEIPT:"read_by"
	USER||--o{READ_RECEIPT:"reads"
  USER ||--o{ NOTIFICATION : receives
 
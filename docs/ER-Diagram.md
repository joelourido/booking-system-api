![ER Diagram](ER-Diagram.svg)


erDiagram

MOVIE {
    int movie_id PK
    string title
    date release_date
    string synopsis
    int duration
    string img_url
    string yt_id
}

ROOM {
    int room_id PK
    string room_name
    int room_capacity
}

SEAT {
    int seat_id PK
    int room_id FK
    string row
    int seat_number
}

SESSION {
    int session_id PK
    int movie_id FK
    int room_id FK
    datetime start_time
    datetime end_time
}

APP_USER {
    int user_id PK
    string email UK
    string password_hash
    string full_name
    datetime created_at
}

BOOKING {
    int booking_id PK
    int user_id FK
    int session_id FK
    string status
    datetime created_at
    datetime expires_at
    jsonb seat_snapshot
}

BOOKING_SEAT {
    int booking_seat_id PK
    int booking_id FK
    int session_id FK
    int seat_id FK
    string status
}

ADMIN {
    int admin_id PK
    string email UK
    string password_hash
} 

%% Relationships

MOVIE ||--o{ SESSION : "has"
ROOM ||--o{ SESSION: "hosts"
ROOM ||--o{ SEAT: "contains"

SESSION ||--o{ BOOKING: "has"
APP_USER ||--o{ BOOKING: "makes"

BOOKING ||--o{ BOOKING_SEAT: "includes"
SEAT ||--o{ BOOKING_SEAT: "reserved as"
SESSION ||--o{ BOOKING_SEAT: "locks"
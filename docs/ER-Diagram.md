erDiagram

MOVIE {

int movie_id PK

string title

date release_date

string synopsis

int duration

string img_url

string trailer_url

}

ROOM {

int room_id PK

int room_capacity

}

SEAT {

int seat_id PK

int room_id FK

int seat_number

string row

}

SESSION {

int session_id PK

int movie_id FK

int room_id FK

datetime start_time

datetime end_time

}

USER {

int user_id PK

string email UK

string password_hash

}

BOOKING {

int booking_id PK

int user_id FK

int session_id FK

datetime booking_time

}

BOOKING_SEAT{

int booking_id FK

int seat_id FK

}

ADMIN {

int admin_id PK

string email UK

string password_hash

}

  

%%Relationships

MOVIE ||--o{ SESSION : "has"

ROOM ||--o{ SESSION: "hosts"

ROOM ||--o{ SEAT: "contains"

SESSION ||--o{ BOOKING: "has"

USER ||--o{ BOOKING: "makes"

BOOKING ||--o{ BOOKING_SEAT: "includes"

SEAT ||--o{ BOOKING_SEAT: "assigned to"
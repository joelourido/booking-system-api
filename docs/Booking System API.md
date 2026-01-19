# Problem / Scope
A ticket booking system API that can be used for a possible movie theater. It can be used by the theater administrators to create, update and delete movie sessions and by consumers to book tickets. 

# Main Features
The main features are divided in two categories, Administrators and Users feature.
Administrator:
- The ability to add new movies into the database, edit data from existing entries and delete desired entries.
- Check all the reservations made from all users.
- Check status of reservations, categorized by day of the week, time slot, movie.
User:
- Book movie tickets, with seat selection support.
- Check all the reservations made by the user.

# Project Structure
```bash
.
├── README.md
├── client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── api.js             # Axios configuration
│       ├── main.jsx           # React entry point
│       ├── App.jsx
│       ├── components/        # Reusable UI components
│       └── pages/             # Route views (Dashboard, MoviePage, etc.)
├── server
│   ├── server.js              # Express app entry point
│   ├── package.json
│   ├── db
│   │   └── schema.sql         # Database initialization script
│   ├── scripts                # Dev utilities (seed, stress_test)
│   └── src
│       ├── db.js              # Postgres Pool connection
│       ├── middleware/        # Auth & error handling
│       ├── routes/            # API endpoint definitions
│       ├── controllers/       # Request logic
│       └── models/            # Raw SQL queries (Data Access Layer)
└── screenshots/               # Images for documentation
  ```

# Enviromental Variables
Create a `.env` file in `/server`:
```bash
# Security
JWT_SECRET=your_secret_key

# ----------------------------------------------
# Option 1: Local Development
# ----------------------------------------------
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=bookingsystempass
DB_NAME=booking_system

# ----------------------------------------------
# OPTION 2: Production / Cloud (Neon)
# ----------------------------------------------
# If this variable is present, the app should prioritize it over the local variables above.
DATABASE_URL=postgresql://neondb_owner:password@ep-patient-dust.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```
And another `.env` file in `/client`:
```bash
# In local dev: http://localhost:3000/api
# In production (Vercel): https://your-booking-system.onrender.com/api
VITE_API_URL=http://localhost:3000/api
```

# Database Schema
The Database is built on **PostgreSQL**
- **Movie**: Stores metadata (`movie_id`, `title`, `release_date`, `synopsis`, `duration`, `img_url`, `yt_id`).
- **Room**: Defines physical spaces (`room_id`, `room_name`, `capacity`).
- **Seat**: Represents physical seats (`seat_id`, `room_id`, `row`, `seat_number`) linked to a Room.
- **Session**: A specific screening instance (`session_id`, `movie_id`, `room_id`, `start_time`, `end_time`).
- **App_User**: Stores customer data (`user_id`, `email`, `password_hash`, `full_name`, `created_at`).
- **Booking**: The reservation record (`booking_id`, `user_id`, `session_id`, `status`, `created_at`, `expires_at`,`seat_snapshot`)
- **Booking_Seat**: Join table handling the specific seats for a booking to prevent double-booking (`booking_seat_id`, `booking_id`, `session_id`, `seat_id`, `status`).

 **Relationships**
- Movie (1) ↔ (N) Session
- Session (1) ↔ (N) Booking
- Users (1) ↔ (N) Booking
- Room (1) ↔ (N) Session
- Room (1) ↔ (N) Seat
- Booking (1) ↔ (N) Booking_Seat

# API Endpoints
### Admin functions (Not Implemented yet):
- `POST /api/movies` - Add a movie
- `PUT /api/movies/:id` - Edit a movie
- `DELETE /api/movies/:id` - Delete a movie
- `POST /api/sessions` - Schedule a session
- `PUT /api/sessions/:id` - Edit a session
- `DELETE /api/sessions/:id` - Cancel a session
- `GET /api/bookings` - Retrieve all bookings (made by all users)
- `DELETE /api/bookings/:id` - Cancel a booking (made by any user)
### User/Public functions:
- `POST /api/auth/register` - Register a new account
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/movies` - Retrieve all movies
- `GET /api/movies/:id` - Retrieve specific movie details
- `GET /api/sessions?movie_id=:id` - Retrieve sessions for a specific movie
- `GET /api/sessions/:id` - Retrieve a single session with seat availability
- `POST /api/bookings` - Create a booking (Atomic transaction with seat locking)
- `POST /api/bookings/:id/confirm` - Confirm the booking
- `DELETE /api/bookings/:id` - Cancel a booking (releases seats)
- `GET /api/bookings/` - Retrieve authenticated user's bookings


## ⏳ Booking Lifecycle & State Machine
The application uses a strict state machine to manage seat availability.

### Status Definitions
- **PENDING:** The user has selected a seat. The seat is locked for **10 minutes** (or your specific time). No one else can book it.
- **CONFIRMED:** "Payment" was successful. The seat is permanently sold.
- **EXPIRED:** The user failed to confirm within the time limit. The seat is released.

### Logic Flow
```mermaid
stateDiagram-v2
    [*] --> PENDING : User creates booking
    PENDING --> CONFIRMED : Payment success
    PENDING --> EXPIRED : Timeout reached (Lazy check)
    CONFIRMED --> [*]
    EXPIRED --> [*]
```

# Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL (Neon Serverless) using `pg` (node-postgres) for raw SQL.
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt.
- **API Testing**: Postman.
- **Deployment:** Vercel (Frontend) + Render (Backend) + Neon (Database).

# Future Improvements
- Add admin features.
- Implement cancel function in the frontend.




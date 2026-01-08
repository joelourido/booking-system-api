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
- Check all the reservations made by the user, who can also edit/cancel them if needed.
# User Flows
Administrator:
- Add theater rooms into the database
- Add movies into the database
- Create sessions connecting a movie to a room.
- Check reservations
- Check status for insights.
# Database Ideas
The Database will be composed by the following tables.
- **Movie table**: A table in which the movies and their metadata (Title, Year of release, Rating, Description etc).
- **Theater Room table**: A table in which the rooms of the theater will be defined (Number of the room, number of available seats).
- **Users table**: A table where all the user data are stored (Name, login information, reservations).
- **Administrator table**: A table where the administrator users data are stored (Name, login information).
- **Session table**: A table that will store information about the movie sessions, using data from the movies table and theater room table.
- **Booking table**: A table that will store information about the booking realized by the users. The user will only have access to its own bookings, the administrators will have access to all bookings.
- **Seat table**: A table that stores each room ID and all the seats that exist in it
- BookingSeat table: A join table that connects bookings and seats
- Movie (1) - (N) Session
- Session (1) - (N) Booking
- Users (1) - (N) Booking
- Theater Room (1) - (N) Session
- Theater Room (1) - (N) Seat
- Booking (N) - (N) Seats (through BookingSeat)
# Function Ideas
Admin only functions:
- POST /api/movies - Add a movie
- PUT /api/movies/:id - Edit a movie
- DELETE /api/movies/:id - Delete a movie
- POST /api/sessions/ - Add a session
- PUT /api/sessions/:id - Edit a session
- DELETE /api/sessions/:id - Delete a session
- GET /api/sessions/ - Retrieve all sessions (with filtering options)
- GET /api/bookings - Retrieve all bookings (made by all users)
- DELETE /api/bookings/:id - Cancel a booking (made by any user)
User functions:
- GET /api/movies - Retrieve all movies
- GET /api/movies/:id - Retrieve all the metadata and sessions of a certain movie
- POST /api/bookings - Book ticket(s) with Seat IDs
- GET /api/bookings - Retrieve all bookings (made by that user)
- DELETE /api/bookings/:id - Cancel a booking (made by that user)
- POST /api/auth/register - Register a new account
- POST /api/auth/login - Login into an existing account
# Tech Stack
- Backend: Node.js (Express)
- Database: PostgreSQL (with Prisma ORM)
- Authentication: JWT
- API Testing: Postman
- (Future) Frontend: React
# Open Questions





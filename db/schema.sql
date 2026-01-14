CREATE TABLE movie (
	movie_id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	release_date DATE,
	synopsis TEXT,
	duration INT,
	img_url VARCHAR(255),
	yt_id VARCHAR(255)
);

CREATE TABLE room (
	room_id SERIAL PRIMARY KEY,
	room_name VARCHAR(255) NOT NULL UNIQUE,
	room_capacity INT NOT NULL
);

CREATE TABLE seat (
	seat_id SERIAL PRIMARY KEY,
	room_id INT REFERENCES room(room_id) ON DELETE CASCADE,
	row VARCHAR(8) NOT NULL,
	seat_number INT NOT NULL,

	CONSTRAINT unique_seat_per_room
        UNIQUE (room_id, row, seat_number)
	
);

CREATE TABLE session (
	session_id SERIAL PRIMARY KEY,
	movie_id INT REFERENCES movie(movie_id) ON DELETE CASCADE,
	room_id INT REFERENCES room(room_id) ON DELETE CASCADE,
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL
);

CREATE TABLE app_user (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	full_name VARCHAR(100),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking (
	booking_id SERIAL PRIMARY KEY,
	user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
	session_id INT REFERENCES session(session_id) ON DELETE CASCADE,
	status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	expires_at TIMESTAMP NOT NULL
);

CREATE TABLE booking_seat (
	booking_seat_id SERIAL PRIMARY KEY,
	booking_id INT REFERENCES booking(booking_id) ON DELETE CASCADE,
	session_id INT REFERENCES session(session_id) ON DELETE CASCADE,
	seat_id INT REFERENCES seat(seat_id) ON DELETE CASCADE,
	status VARCHAR(20) NOT NULL
);

-- Prevent double booking
CREATE UNIQUE INDEX uniq_active_seat
ON booking_seat (session_id, seat_id)
WHERE status IN ('PENDING', 'CONFIRMED');

-- Performance indexes
CREATE INDEX idx_booking_status ON booking (status);
CREATE INDEX idx_booking_seat_session ON booking_seat (session_id);

CREATE TABLE admin (
	admin_id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL
);
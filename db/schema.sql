CREATE TABLE movie (
	movie_id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	release_date DATE,
	synopsis TEXT,
	duration INT,
	img_url VARCHAR(255),
	trailer_url VARCHAR(255)
);

CREATE TABLE room (
	room_id SERIAL PRIMARY KEY,
	room_name VARCHAR(255) NOT NULL UNIQUE,
	room_capacity INT NOT NULL
);

CREATE TABLE seat (
	seat_id SERIAL PRIMARY KEY,
	room_id INT REFERENCES room(room_id) ON DELETE CASCADE,
	seat_number INT NOT NULL,
	row VARCHAR(8) NOT NULL
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
	password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE booking (
	booking_id SERIAL PRIMARY KEY,
	user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
	session_id INT REFERENCES session(session_id) ON DELETE CASCADE,
	booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_seat (
	booking_id INT REFERENCES booking(booking_id) ON DELETE CASCADE,
	seat_id INT REFERENCES seat(seat_id) ON DELETE CASCADE,
	PRIMARY KEY (booking_id, seat_id)
);

CREATE TABLE admin (
	admin_id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL
);
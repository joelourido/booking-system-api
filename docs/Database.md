CREATE TABLE movie (
	movie_id SERIAL PRIMARY KEY,
	title TEXT,
	release_date DATE,
	synopsis TEXT,
	duration INT,
	img_url VARCHAR(255),
	trailer_url VARCHAR(255)
);

CREATE TABLE room (
	room_id INT PRIMARY KEY,
	room_capacity INT
);

CREATE TABLE seat (
	seat_id SERIAL PRIMARY KEY,
	room_id INT REFERENCES room(room_id),
	seat_number INT,
	row VARCHAR(8)
);

CREATE TABLE session (
	session_id SERIAL PRIMARY KEY,
	movie_id INT FOREIGN KEY,
	room_id INT FOREIGN KEY,
	start_time TIMESTAMP,
	end_time TIMESTAMP
);

CREATE TABLE user (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE,
	password_hash VARCHAR(255)
);

CREATE TABLE booking (
	booking_id SERIAL PRIMARY KEY,
	user_id INT FOREIGN KEY,
	session_id INT FOREIGN KEY,
	booking_time TIMESTAMP
);

CREATE TABLE booking_seat (
	booking_id FOREIGN KEY
	seat_id FOREIGN KEY
);

CREATE TABLE admin (
	admin_id INT PRIMARY KEY,
	email VARCHAR(255) UNIQUE,
	password_hash VARCHAR(255)
);
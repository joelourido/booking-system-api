import { MovieModel } from '../src/models/movieModel.js';
import { RoomModel } from '../src/models/roomModel.js';
import { SeatModel } from '../src/models/seatModel.js';
import { SessionModel } from '../src/models/sessionModel.js';
import { pool } from '../src/db.js';

async function seedMovies() {
  const movies = [
    { title: "Parasite", release_date: "2019-11-01" , duration: 133 },
    { title: "Interstellar", release_date: "2014-11-07", duration: 169 },
    { title: "Barbie", release_date: "2023-07-21", duration: 114 },
    { title: "Fight Club", release_date: "1999-10-15", duration: 139 },
    { title: "La La Land", release_date: "2016-12-16", duration: 129 },
    { title: "Whiplash", release_date: "2014-10-10", duration: 107 },
    { title: "Everything Everywhere All at Once", release_date: "2022-04-08", duration: 140 },
    { title: "The Truman Show", release_date: "1998-06-01", duration: 103 },
    { title: "Pulp Fiction", release_date: "1994-10-14", duration: 154 },
    { title: "Oppenheimer", release_date: "2023-07-21", duration: 181 }
  ];

  for (const movie of movies) {
    await MovieModel.create(movie);
  }

  console.log('Movies seeded');
}

async function seedRooms() {
  const rooms = [
    { room_name: "Room 1", room_capacity: 50 },
    { room_name: "Room 2", room_capacity: 50 },
    { room_name: "Room 3", room_capacity: 50 },
    { room_name: "Room 4", room_capacity: 50 },
    { room_name: "Room 5", room_capacity: 50 },
    { room_name: "Room 6", room_capacity: 50 },
    { room_name: "Room 7", room_capacity: 50 },
    { room_name: "Room 8", room_capacity: 50 },
    { room_name: "Room 9", room_capacity: 50 },
    { room_name: "Room 10", room_capacity: 50 }
  ];

  for (const room of rooms) {
    await RoomModel.create(room);
  }
  console.log('Rooms seeded');
}

async function seedSeats() {

  const rooms = await RoomModel.getAll();

  // Use a simple layout for all rooms: rows A-E, 10 seats each
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 10;

  for (const room of rooms) {

    // Check if seats already exist to avoid duplication
    const existingSeats = await SeatModel.getByRoom(room.room_id);
    if (existingSeats.length === 0) {
      await SeatModel.bulkCreate(room.room_id, rows, seatsPerRow);
    }
  }
  console.log('Seats seeded');
}

async function seedSessions() {
  const movies = await MovieModel.getAll();
  const rooms = await RoomModel.getAll();

  const sessionsData = [
    {
      movie_id: movies[0].movie_id,
      room_id: rooms[0].room_id,
      start_time: "2026-01-10 18:00:00",
    },
    {
      movie_id: movies[1].movie_id,
      room_id: rooms[1].room_id,
      start_time: "2026-01-10 20:30:00",
    },
  ];

  for (const session of sessionsData) {
    const movie = movies.find(m => m.movie_id === session.movie_id);

    const startDate = new Date(session.start_time);
    const endDate = new Date(startDate.getTime());
    endDate.setMinutes(startDate.getMinutes() + movie.duration);

    await SessionModel.create({
      movie_id: session.movie_id,
      room_id: session.room_id,
      start_time: startDate,
      end_time: endDate
    });
  }

  console.log("Sessions seeded");
}

// async function seedUsers() {
//   const query = `
//     INSERT INTO app_user (email, password_hash) 
//     VALUES ($1, $2)
//     ON CONFLICT (email) DO NOTHING;
//   `;
//   await pool.query(query, ['test@example.com', 'dummyhash']);
//   console.log('Users seeded');
// }

async function main() {
  try {
    await seedMovies();
    await seedRooms();
    await seedSeats();
    await seedSessions();
    await seedUsers();

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

main();

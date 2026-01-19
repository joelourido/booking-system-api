import { MovieModel } from '../src/models/movieModel.js';
import { RoomModel } from '../src/models/roomModel.js';
import { SeatModel } from '../src/models/seatModel.js';
import { SessionModel } from '../src/models/sessionModel.js';
import { pool } from '../src/db.js';

async function seedMovies() {
  const movies = [
    { title: "Parasite", release_date: "2019-11-01" , synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", duration: 133, img_url: "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "5xH0HfJHsaY"},
    { title: "Interstellar", release_date: "2014-11-07", synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.", duration: 169, img_url: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "zSWdZVtXT7E"},
    { title: "Barbie", release_date: "2023-07-21", synopsis: "Barbie and Ken are having the time of their lives in the seemingly perfect world of Barbie Land. However, when they get a chance to go to the outside world, they soon discover the joys and perils of living among regular humans.", duration: 114, img_url: "https://m.media-amazon.com/images/M/MV5BYjI3NDU0ZGYtYjA2YS00Y2RlLTgwZDAtYTE2YTM5ZjE1M2JlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "pBk4NYhWNMM"},
    { title: "Fight Club", release_date: "1999-10-15", synopsis: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.", duration: 139, img_url: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "qtRKdVHc-cE"},
    { title: "La La Land", release_date: "2016-12-16", synopsis: "When Sebastian, a pianist, and Mia, an actress, follow their passion and achieve success in their respective fields, they find themselves torn between their love for each other and their careers.", duration: 129, img_url: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_FMjpg_UX1000_.jpg", yt_id: "0pdqf4P9MB8"},
    { title: "Whiplash", release_date: "2014-10-10", synopsis: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.", duration: 107, img_url: "https://m.media-amazon.com/images/M/MV5BMDFjOWFkYzktYzhhMC00NmYyLTkwY2EtYjViMDhmNzg0OGFkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "7d_jQycdQGo"},
    { title: "Everything Everywhere All at Once", release_date: "2022-04-08", synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.", duration: 140, img_url: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "wxN1T1uxQ2g"},
    { title: "The Truman Show", release_date: "1998-06-01", synopsis: "An insurance salesman begins to suspect that his whole life is actually some sort of reality TV show.", duration: 103, img_url: "https://m.media-amazon.com/images/M/MV5BNzA3ZjZlNzYtMTdjMy00NjMzLTk5ZGYtMTkyYzNiOGM1YmM3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "dlnmQbPGuls"},
    { title: "Pulp Fiction", release_date: "1994-10-14", synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", duration: 154, img_url: "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "s7EdQ4FqbhY"},
    { title: "Oppenheimer", release_date: "2023-07-21", synopsis: "A dramatization of the life story of J. Robert Oppenheimer, the physicist who had a large hand in the development of the atomic bombs that brought an end to World War II.", duration: 181, img_url: "https://m.media-amazon.com/images/M/MV5BM2RmYmVmMzctMzc5Ny00MmNiLTgxMGUtYjk1ZDRhYjA2YTU0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", yt_id: "uYPbbksJxIg"}
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

  if (movies.length === 0 || rooms.length === 0) {
    console.error("Error: Need movies and rooms before seeding sessions.");
    return;
  }

  const daysToSeed = 365;
  let totalSessions = 0;

  console.log(`Starting seed for the next ${daysToSeed} days...`);

  // Loop through the days
  for (let i = 0; i < daysToSeed; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Store the day so we know when we've crossed midnight
    const targetDay = date.getDate();

    // Loop through rooms/movies
    for (let j = 0; j < (movies.length); j++) {
      const movie = movies[j];
      const room = rooms[j];

      // Start at 10:00, 10:00 JST - 9 hours = 01:00 UTC
      let currentStartTime = new Date(date);
      currentStartTime.setUTCHours(1, 0, 0, 0);

      // Create sessions until 22:00 (which is 13:00 UTC) of the same day 
      while (currentStartTime.getUTCHours() <= 13 && currentStartTime.getDate() === targetDay) {
        
        const endTime = new Date(currentStartTime.getTime() + movie.duration * 60000);

        await SessionModel.create({
          movie_id: movie.movie_id,
          room_id: room.room_id,
          start_time: new Date(currentStartTime),
          end_time: endTime
        });

        totalSessions++;
        
        // Advance 3 hours
        currentStartTime.setUTCHours(currentStartTime.getUTCHours() + 3);
      }
    }
  }

  console.log(`Success! Created ${totalSessions} sessions for the next ${daysToSeed} days.`);
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
    // await seedUsers();

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

main();

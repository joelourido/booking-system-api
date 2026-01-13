import { pool } from "../db.js";

export const SessionModel = {
  // SessionModel.js
  async getAll() {
    const query = `
      SELECT 
        session.session_id,
        session.start_time,
        session.end_time,
        movie.title AS movie_title,
        room.room_name AS room_name
      FROM session
      JOIN movie ON session.movie_id = movie.movie_id
      JOIN room ON session.room_id = room.room_id
      ORDER BY session.start_time;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Get a session by ID
  async getById(id) {
    const query = `
      SELECT 
            session.session_id,
            session.start_time,
            session.end_time,
            session.movie_id, 
            session.room_id,
            movie.title AS movie_title,
            room.room_name AS room_name
          FROM session
          JOIN movie ON session.movie_id = movie.movie_id
          JOIN room ON session.room_id = room.room_id 
          WHERE session.session_id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Create a new session
  async create({ movie_id, room_id, start_time, end_time }) {
    const query = `
      INSERT INTO session (movie_id, room_id, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [movie_id, room_id, start_time, end_time];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Update an existing session
  async update(id, { movie_id, room_id, start_time, end_time }) {
    const query = 
      `
      UPDATE session SET
        movie_id = COALESCE($1, movie_id),
        room_id = COALESCE($2, room_id),
        start_time = COALESCE($3, start_time),
        end_time = COALESCE($4, end_time)
      WHERE session_id = $5
      RETURNING *
      `;
    const values = [movie_id, room_id, start_time, end_time, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Delete a session
  async delete(id) {
    const query = `DELETE FROM session WHERE session_id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);
    return { message: 'Session deleted' };
  },

// Checks for overlaps in session time
  async checkOverlap(room_id, start_time, end_time, excludeSessionId = null) {
    let query = `
      SELECT * FROM session 
      WHERE room_id = $1 
      AND start_time < $3 
      AND end_time > $2
    `;
    const values = [room_id, start_time, end_time];
    // If we are updating, ignore the session we are currently editing
    if (excludeSessionId) {
      query += ` AND session_id != $4`;
      values.push(excludeSessionId);
    }
    const { rows } = await pool.query(query, values);
    return rows.length > 0; 
  },

  // Get all seats for a session with their status
  async getSeatMap(session_id) {
    const query = `
      SELECT 
        s.seat_id,
        s.row,
        s.seat_number
        CASE 
          WHEN bs.status = 'CONFIRMED' THEN 'TAKEN'
          WHEN bs.status = 'PENDING' AND b.expires_at > NOW() THEN 'TAKEN'
          ELSE 'AVAILABLE'
        END as status
      FROM seat s
      JOIN session sess ON s.room_id = sess.room_id
      LEFT JOIN booking_seat bs 
        ON s.seat_id = bs.seat_id 
        AND bs.session_id = $1
      LEFT JOIN booking b 
        ON bs.booking_id = b.booking_id
      WHERE sess.session_id = $1
      ORDER BY s.row_number, s.seat_number;
    `;
    
    const { rows } = await pool.query(query, [session_id]);
    return rows;
  }
};

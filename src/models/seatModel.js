import { pool } from "../db.js";

export const SeatModel = {
  // Get all seats for a given room
  async getByRoom(room_id) {
    const query = `
      SELECT seat_id, row, seat_number
      FROM seat
      WHERE room_id = $1
      ORDER BY row, seat_number;
    `;
    const { rows } = await pool.query(query, [room_id]);
    return rows;
  },

  // Validate that all seat_ids belong to the same room
  async validateSeats(seat_ids, room_id) {
    const query = `
      SELECT seat_id
      FROM seat
      WHERE seat_id = ANY($1)
        AND room_id = $2;
    `;
    const { rows } = await pool.query(query, [seat_ids, room_id]);
    return rows.length === seat_ids.length;
  },

  // Bulk create seats for a room, seeding the DB
  async bulkCreate(room_id, rows, seatsPerRow) {
    const values = [];
    let paramIndex = 1;

    for (const row of rows) {
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
      }
    }

    const query = `
      INSERT INTO seat (room_id, row, seat_number)
      VALUES ${values.join(", ")}
      RETURNING *;
    `;

    const params = [];
    for (const row of rows) {
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        params.push(room_id, row, seatNumber);
      }
    }

    const { rows: created } = await pool.query(query, params);
    return created;
  },

  //   Delete all the seats from a given room
  async deleteByRoom(room_id) {
    const query = `DELETE FROM seat WHERE room_id = $1;`;
    await pool.query(query, [room_id]);
  },

  // Get seats for a session with availability status
  async getBySession(session_id) {
    const query = `
      SELECT
        s.seat_id,
        s.row,
        s.seat_number,
        COALESCE(bs.status, 'AVAILABLE') AS status
      FROM seat s
      JOIN session sess ON sess.room_id = s.room_id
      LEFT JOIN booking_seat bs
        ON bs.seat_id = s.seat_id
        AND bs.session_id = sess.session_id
        AND (
          bs.status = 'CONFIRMED'
          OR (
            bs.status = 'PENDING'
            AND EXISTS (
              SELECT 1
              FROM booking b
              WHERE b.booking_id = bs.booking_id
              AND b.expires_at > NOW()
            )
          )
        )
      WHERE sess.session_id = $1
      ORDER BY s.row, s.seat_number;
    `;

    const { rows } = await pool.query(query, [session_id]);
    return rows;
  }

};

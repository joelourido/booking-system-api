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
  }
};

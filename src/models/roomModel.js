import { pool } from '../db.js';

export const RoomModel = {
  // Get all roomses
  async getAll() {
    const query = `SELECT * FROM room ORDER BY room_id`;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Get room by ID
  async getById(room_id) {
    const query = `SELECT * FROM room WHERE room_id = $1`;
    const { rows } = await pool.query(query, [room_id]);
    return rows[0];
  },

  // Create a new room
  async create({ room_name, room_capacity }) {
    const query = `
      INSERT INTO room (room_name, room_capacity)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [room_name, room_capacity];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Update a room
  async update(room_id, { room_name, room_capacity }) {
    const query = `
      UPDATE room
      SET room_name = COALESCE($1, room_name),
      room_capacity = COALESCE($2, room_capacity)
      WHERE room_id = $3
      RETURNING *;
    `;
    const values = [room_name, room_capacity, room_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
},

  // Delete a room
  async delete(room_id) {
    const query = `DELETE FROM room WHERE room_id = $1`;
    await pool.query(query, [room_id]);
    return { message: 'Room deleted' };
  }
};

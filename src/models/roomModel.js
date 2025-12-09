import { pool } from '../db.js';

export const RoomModel = {
  // Get all rooms
  async getAll() {
    const query = `SELECT * FROM room ORDER BY room_id ASC`;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Get room by ID
  async getById(id) {
    const query = `SELECT * FROM room WHERE room_id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // Create a new room
  async create({ capacity }) {
    const query = `
      INSERT INTO room (room_capacity)
      VALUES ($1)
      RETURNING *;
    `;
    const values = [capacity];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Update a room
  async update(room_id, { capacity }) {
    const query = `
      UPDATE room
      SET room_capacity = $1
      WHERE room_id = $2
      RETURNING *;
    `;
    const values = [capacity, room_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
},

  // Delete a room
  async delete(id) {
    const query = `DELETE FROM room WHERE room_id = $1`;
    await pool.query(query, [id]);
  }
};

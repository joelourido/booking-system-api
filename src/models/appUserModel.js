import { pool } from "../db.js";

export const UserModel = {
  // Find a user by email (Login)
  async findByEmail(email) {
    const query = `SELECT * FROM app_user WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  },

  // Create a new user (Registration)
  async create({ email, password_hash, full_name }) {
    const query = `
      INSERT INTO app_user (email, password_hash, full_name)
      VALUES ($1, $2, $3)
      RETURNING user_id, email, full_name, created_at;
    `;
    const { rows } = await pool.query(query, [email, password_hash, full_name]);
    return rows[0];
  }
};
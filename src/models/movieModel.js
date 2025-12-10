import { pool } from '../db.js';

export const MovieModel = {
  // Get all movie entries
  async getAll() {
    const query = `SELECT * FROM movie ORDER BY movie_id`;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Get a movie entry by ID
  async getById(movie_id) {
    const query = `SELECT * FROM movie WHERE movie_id = $1`;
    const { rows } = await pool.query(query, [movie_id]);
    return rows[0];
  },

  // Create a new movie entry
  async create({ title, release_date, synopsis, duration, img_url, trailer_url }) {
    const query = 
      `
      INSERT INTO movie (title, release_date, synopsis, duration, img_url, trailer_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `;
      const values = [title, release_date, synopsis, duration, img_url, trailer_url]
      const {rows} = await pool.query(query, values);
      return rows[0];
  },

  // Update a movie entry
  async update(movie_id, { title, release_date, synopsis, duration, img_url, trailer_url }) {
    const query = 
      `
      UPDATE movie SET
        title = COALESCE($1, title),
        release_date = COALESCE($2, release_date),
        synopsis = COALESCE($3, synopsis),
        duration = COALESCE($4, duration),
        img_url = COALESCE($5, img_url),
        trailer_url = COALESCE($6, trailer_url)
      WHERE movie_id = $7
      RETURNING *
      `;
    const values = [title, release_date, synopsis, duration, img_url, trailer_url, movie_id]
    const {rows} = await pool.query(query, values);
    return rows[0];
  },

  // Delete a movie entry
  async delete(movie_id) {
    const query = `DELETE FROM movie WHERE movie_id = $1`;
    await pool.query(query, [movie_id]);
    return { message: 'Movie deleted' };
  }
};

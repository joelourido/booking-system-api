import { pool } from '../db.js';

export const MovieModel = {
  // Get all movie entries
  async getAll() {
    const result = await pool.query('SELECT * FROM movie ORDER BY movie_id');
    return result.rows;
  },

  // Get a movie entry by ID
  async getById(movie_id) {
    const result = await pool.query('SELECT * FROM movie WHERE movie_id = $1', [movie_id]);
    return result.rows[0];
  },

  // Create a new movie entry
  async create({ title, release_date, synopsis, duration, img_url, trailer_url }) {
    const result = await pool.query(
      `INSERT INTO movie (title, release_date, synopsis, duration, img_url, trailer_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, release_date, synopsis, duration, img_url, trailer_url]
    );
    return result.rows[0];
  },

  // Update a movie entry
  async update(movie_id, { title, release_date, synopsis, duration, img_url, trailer_url }) {
    const result = await pool.query(
      `UPDATE movie
       SET title = $1, release_date = $2, synopsis = $3, duration = $4, img_url = $5, trailer_url = $6
       WHERE movie_id = $7
       RETURNING *`,
      [title, release_date, synopsis, duration, img_url, trailer_url, movie_id]
    );
    return result.rows[0];
  },

  // Delete a movie entry
  async delete(movie_id) {
    await pool.query('DELETE FROM movie WHERE movie_id = $1', [movie_id]);
    return { message: 'Movie deleted' };
  }
};

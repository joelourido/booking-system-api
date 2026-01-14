import { MovieModel } from '../models/movieModel.js';

export const MovieController = {
  // GET api/movies
  async getAll(req, res) {
    try {
      const movies = await MovieModel.getAll();
      return res.status(200).json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET api/movies/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
      const movie = await MovieModel.getById(id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST api/movies
  async create(req, res) {
    try {
      const { title, release_date, synopsis, duration, img_url, yt_id } = req.body;
      // Check title, release_date and duration fields
      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Movie title can't be empty" });
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (release_date !== undefined && !dateRegex.test(release_date)) {
        return res.status(400).json({ error: "release_date must be in YYYY-MM-DD format" });
      }
      if (duration !== undefined && !Number.isInteger(Number(duration))) {
        return res.status(400).json({ error: "Duration must be an integer number" });
      }

      const newMovie = await MovieModel.create({
        title,
        release_date,
        synopsis,
        duration,
        img_url,
        yt_id
      });

      return res.status(201).json(newMovie);
    } catch (error) {
      console.error("Error creating movie:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT api/movies/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { title, release_date, synopsis, duration, img_url, yt_id } = req.body;
      
      // Check movie ID, title, release_date and duration fields
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
      if (title !== undefined && title.trim() === "") {
        return res.status(400).json({ error: "Movie title can't be empty" });
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (release_date !== undefined && !dateRegex.test(release_date)) {
        return res.status(400).json({ error: "release_date must be in YYYY-MM-DD format" });
      }
      if (duration !== undefined && !Number.isInteger(Number(duration))) {
        return res.status(400).json({ error: "Duration must be an integer number" });
      }

      // Check if movie exists
      const existing = await MovieModel.getById(id);
      if (!existing) {
        return res.status(404).json({ error: "Movie not found" });
      }

      const updatedMovie = await MovieModel.update(id, req.body);

      return res.status(200).json(updatedMovie);
    } catch (error) {
      console.error("Error updating movie:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE api/movies/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
      // Check if exists
      const existing = await MovieModel.getById(id);
      if (!existing) {
        return res.status(404).json({ error: "Movie not found" });
      }

      await MovieModel.delete(id);

      return res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      console.error("Error deleting movie:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
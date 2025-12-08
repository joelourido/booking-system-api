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
      const { title, release_date, synopsis, duration, img_url, trailer_url } = req.body;

      // Basic validation (you can enhance later)
      if (!title || !release_date) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newMovie = await MovieModel.create({
        title,
        release_date,
        synopsis,
        duration,
        img_url,
        trailer_url
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
      const updates = req.body;

      // Check if movie exists
      const existing = await MovieModel.getById(id);
      if (!existing) {
        return res.status(404).json({ error: "Movie not found" });
      }

      const updatedMovie = await MovieModel.update(id, updates);

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
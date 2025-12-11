import { SessionModel } from '../models/sessionModel.js';
import { MovieModel } from "../models/movieModel.js";
import { RoomModel } from "../models/roomModel.js";


export const SessionController = {
  // GET api/sessions
  async getAll(req, res) {
    try {
      const sessions = await SessionModel.getAll();
      return res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET api/sessions/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }
      const session = await SessionModel.getById(id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      return res.status(200).json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST api/sessions
  async create(req, res) {
    try {
      const { movie_id, room_id, start_time} = req.body;
      // Check the required fields
      if (!movie_id || !room_id || !start_time) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (!Number.isInteger(movie_id)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
      if (!Number.isInteger(room_id)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }

      // Check if the date is a valid timestamp
      const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/;
      if (!timeRegex.test(start_time)) {
        return res.status(400).json({ 
          error: "Invalid format. Use 'YYYY-MM-DD HH:MM' (e.g., 2025-12-10 18:30)" 
        });
      }
      const startDate = new Date(start_time);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: "Invalid date value" });
      }
      
      // Fetch the movie duration
      const movie = await MovieModel.getById(movie_id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      // Calculate end time by adding the duration of the movie to the start date
      const endDate = new Date(startDate.getTime());
      endDate.setMinutes(startDate.getMinutes() + movie.duration);

      // Check if it overlaps with an existing session
      const overlapping = await SessionModel.checkOverlap(room_id, startDate, endDate);
      if (overlapping) {
        return res.status(409).json({ error: "Overlapping with an existing session."});
      }

      const newSession = await SessionModel.create({
        movie_id,
        room_id,
        start_time: startDate,
        end_time: endDate
      });

      return res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT api/sessions/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { movie_id, room_id, start_time } = req.body;
      
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      // Check whether the session exists.
      const existing = await SessionModel.getById(id);
      if (!existing) {
        return res.status(404).json({ error: "Session not found" });
      }

      // If the user didn't send a value, use the one from the existing session
      const finalMovieId = movie_id || existing.movie_id;
      const finalRoomId = room_id || existing.room_id;

      // Check if the values for movie_id and room_id are valid
      if (!Number.isInteger(Number(finalMovieId))) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
      if (!Number.isInteger(Number(finalRoomId))) {
        return res.status(400).json({ error: "Invalid room ID" });
      }
      // Check if the value of movie_id and room_id exists
      const movie = await MovieModel.getById(finalMovieId);
      const room = await RoomModel.getById(finalRoomId);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      let finalStartDate;
      // Only validate start_time if the user actually sent it
      if (start_time) {
        const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/;
        if (!timeRegex.test(start_time)) {
          return res.status(400).json({ error: "Invalid format. Use 'YYYY-MM-DD HH:MM'" });
        }
        finalStartDate = new Date(start_time);
        if (isNaN(finalStartDate.getTime())) return res.status(400).json({ error: "Invalid date" });
      } else {
      // User didn't change time, so keep the old start time
        finalStartDate = new Date(existing.start_time);
      }

      let finalEndDate;
      // Only recalculate end_time if movie or start time changed
      if (movie_id || start_time) {
        // First fetch the movie to get the duration
        finalEndDate = new Date(finalStartDate.getTime());
        finalEndDate.setMinutes(finalStartDate.getMinutes() + movie.duration);
      } else {
        // Nothing changed regarding time, so preserve the old end time
        finalEndDate = new Date(existing.end_time);
      }

      // Check for overlaps with existing sessions
      const overlap = await SessionModel.checkOverlap(finalRoomId, finalStartDate, finalEndDate, id);
      if (overlap) {
        return res.status(409).json({ error: "Update causes overlap" });
      }
      
      const updatedSession = await SessionModel.update(id, {
        movie_id: finalMovieId,
        room_id: finalRoomId,
        start_time: finalStartDate,
        end_time: finalEndDate
      });

      return res.status(200).json(updatedSession);
    } catch (error) {
      console.error("Error updating session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE api/sessions/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }
      // Check if exists
      const existing = await SessionModel.getById(id);
      if (!existing) {
        return res.status(404).json({ error: "Session not found" });
      }

      await SessionModel.delete(id);

      return res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
      console.error("Error deleting session:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
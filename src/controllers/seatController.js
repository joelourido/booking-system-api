import { SeatModel } from "../models/seatModel.js";
import { RoomModel } from "../models/roomModel.js";

export const SeatController = {

  // GET /api/rooms/:roomId/seats
  async getByRoom(req, res) {
    try {
      const roomId = Number(req.params.roomId);

      if (!Number.isInteger(roomId)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }

      const room = await RoomModel.getById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const seats = await SeatModel.getByRoom(roomId);
      return res.status(200).json(seats);
    } catch (error) {
      console.error("Error fetching seats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /api/rooms/:roomId/seats
  async bulkCreate(req, res) {
    try {
      const roomId = Number(req.params.roomId);
      const { rows, seats_per_row } = req.body;

      if (!Number.isInteger(roomId)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: "Rows must be a non-empty array" });
      }

      if (!Number.isInteger(seats_per_row) || seats_per_row <= 0) {
        return res.status(400).json({ error: "Invalid seats_per_row" });
      }

      const room = await RoomModel.getById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Check if there already are seats in the room
      const existingSeats = await SeatModel.getByRoom(roomId);
      if (existingSeats.length > 0) {
        return res.status(409).json({
          error: "Seats already exist for this room"
        });
      }

      // Normalize the rows array
      const normalizedRows = rows.map(r => r.toUpperCase().trim());

      const createdSeats = await SeatModel.bulkCreate(
        roomId,
        normalizedRows,
        seats_per_row
      );


      return res.status(201).json({
        room_id: roomId,
        total_seats: createdSeats.length,
        seats: createdSeats
      });
    } catch (error) {
      console.error("Error creating seats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE /api/rooms/:roomId/seats
  async deleteByRoom(req, res) {
    try {
      const roomId = Number(req.params.roomId);

      if (!Number.isInteger(roomId)) {
        return res.status(400).json({ error: "Invalid room ID" });
      }

      const room = await RoomModel.getById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      await SeatModel.deleteByRoom(roomId);

      return res.status(200).json({
        message: "All seats deleted for this room successfully"
      });
    } catch (error) {
      console.error("Error deleting seats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

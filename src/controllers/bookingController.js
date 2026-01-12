import { BookingModel } from "../models/bookingModel.js";

export const BookingController = {

  async create(req, res) {
    try {
      
      const user_id = req.user.user_id;

      let { session_id, seat_ids } = req.body;

      // Normalize inputs
      session_id = Number(session_id);
      seat_ids = Array.isArray(seat_ids)
        ? seat_ids.map(Number)
        : [];

      if (!Number.isInteger(session_id)) {
        return res.status(400).json({ error: "Invalid session_id" });
      }

      if (!Array.isArray(seat_ids) || seat_ids.length === 0) {
        return res.status(400).json({
          error: "seat_ids must be a non-empty array"
        });
      }

      if (!seat_ids.every(id => Number.isInteger(id))) {
        return res.status(400).json({ error: "Invalid seat_ids" });
      }

      const booking = await BookingModel.createPendingBooking({
        user_id,
        session_id,
        seat_ids
      });

      return res.status(201).json(booking);
    } catch (error) {
      if (error.code === "SEAT_TAKEN") {
        return res.status(409).json({
          error: "One or more seats are already taken"
        });
      }

      console.error("Create booking error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /api/bookings/:id/confirm
  async confirm(req, res) {
    try {
      const booking_id = Number(req.params.id);

      if (!Number.isInteger(booking_id)) {
        return res.status(400).json({ error: "Invalid booking id" });
      }

      const booking = await BookingModel.confirmBooking(booking_id);

      if (!booking) {
        return res.status(404).json({
          error: "Booking not found or expired"
        });
      }

      return res.status(200).json(booking);
    } catch (error) {
      console.error("Confirm booking error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /api/bookings/:id/cancel
  async cancel(req, res) {
    try {
      const booking_id = Number(req.params.id);

      if (!Number.isInteger(booking_id)) {
        return res.status(400).json({ error: "Invalid booking id" });
      }

      const success = await BookingModel.cancelBooking(booking_id);

      if (!success) {
        return res.status(404).json({ error: "Booking not found" });
      }

      return res.status(200).json({
        message: "Booking cancelled successfully"
      });
    } catch (error) {
      console.error("Cancel booking error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET /api/bookings
  async list(req, res) {
    try {
      // Get the user ID from the token
      const user_id = req.user.user_id;

      const bookings = await BookingModel.findByUser(user_id);

      return res.status(200).json(bookings);
    } catch (error) {
      console.error("List bookings error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
